import json
import os
import logging
import concurrent.futures
import time
from flask import Flask, render_template
from dotenv import load_dotenv
import requests as r
from filters import init_filters

load_dotenv()
app = Flask(__name__)
init_filters(app)
logger = logging.getLogger(__name__)

ERRORS = {
    "steam": {
        "not_found": "STEAM_NOT_FOUND"
    },
    "faceit": {
        "not_found": "FACEIT_NOT_FOUND",
        "no_recent_games": "FACEIT_RECENT_NOT_FOUND"
    },
    "leetify": {
        "not_found": "LEETIFY_NOT_FOUND"
    }
}

CS2_RATINGS = {
    0: "tier-1",
    5000: "tier-2",
    10000: "tier-3",
    15000: "tier-4",
    20000: "tier-5",
    25000: "tier-6",
    30000: "tier-7",
}

def get_cs2_rating_tier(rating: int) -> str:
    tier = ""

    for key in CS2_RATINGS:
        if rating >= key:
            tier = CS2_RATINGS[key]
        else:
            break

    return tier

def get_average_stats(items, count):
    adr = 0
    kills = 0
    deaths = 0
    assists = 0
    rounds_won = 0
    games_won = 0
    kd = 0
    headshot_percentage = 0
    for item in items:
        adr += float(item["stats"].get("ADR", 0))
        kills += float(item["stats"]["Kills"])
        deaths += float(item["stats"]["Deaths"])
        assists += float(item["stats"]["Assists"])
        rounds_won += float(item["stats"]["Final Score"])
        games_won += float(item["stats"]["Result"])
        kd += float(item["stats"]["K/D Ratio"])
        headshot_percentage += float(item["stats"]["Headshots %"])

    return {
        "adr": "%0.2f" % (adr / count),
        "kills": "%0.2f" % (kills / count),
        "deaths": "%0.2f" % (deaths / count),
        "assists": "%0.2f" % (assists / count),
        "kd_ratio": "%0.2f" % (kd / count),
        "rounds_won":"%0.2f" % (rounds_won / count),
        "win_percentage": "%0.2f" % (games_won / count * 100),
        "headshot_percentage": "%0.2f" % (headshot_percentage / count),
    }


class Scraper:
    def __init__(self, steam_id, is_vanity_name=False) -> None:
        self.steam_id = steam_id
        self.is_vanity_name = is_vanity_name
        self.steam_api_key = os.getenv("STEAM_API_KEY")
        self.faceit_api_key_name = os.getenv("FACEIT_API_KEY_NAME")
        self.faceit_api_key = os.getenv("FACEIT_API_KEY")

    def resolve_steam_id(self, vanity_name: str) -> str | None:
        url = (f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key="
               f"{self.steam_api_key}&vanityurl={vanity_name}")

        try:
            response = r.get(url)
            data = response.json()["response"]

            if data["success"]:
                return data["steamid"]
            else:
                logger.error("Failed to resolve vanity URL")
                return None
        except Exception as e:
            logger.error(str(e))

        return None

    def get_steam_stats(self) -> dict:
        """Gets player statistics from Steam API by Steam user ID. Returns a dictionary with player statistics."""
        cs2_app_id = 730

        # CS2 app ID is 730
        url = (f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key="
               f"{self.steam_api_key}&steamid={self.steam_id}&appid={cs2_app_id}")
        response_cs2 = r.get(url)

        if response_cs2.status_code != 200:
            return {
                "error": ERRORS["steam"]["not_found"]
            }

        url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="
               f"{self.steam_api_key}&steamids={self.steam_id}")
        response_general = r.get(url)

        if response_cs2.status_code != 200:
            return {
                "error": ERRORS["steam"]["not_found"]
            }

        cs2_json = response_cs2.json()
        general_json = response_general.json()["response"]

        return {
            "general": general_json["players"][0],
            "cs2": cs2_json
        }

    def get_faceit_stats(self) -> dict:
        """Gets player statistics from FACEIT API by Steam user ID. Returns a dictionary with player statistics."""
        headers = {"Authorization": f"Bearer {self.faceit_api_key}"}
        stats = {
            "csgo": {},
            "cs2": {},
            "recentGameStats": {}
        }

        # Get FACEIT CS:GO statistics
        url = f"https://open.faceit.com/data/v4/players?game=csgo&game_player_id={self.steam_id}"
        response_csgo = r.get(url, headers=headers)
        if response_csgo.status_code != 200:
            return {
                "error": ERRORS["faceit"]["not_found"]
            }
        else:
            response_csgo = response_csgo.json()
            stats["csgo"] = {
                "createdAt": response_csgo["activated_at"],
                "avatar": response_csgo["avatar"],
                "country": response_csgo["country"],
                "statsCSGO": response_csgo["games"]["csgo"],
                "memberships": response_csgo["memberships"],
            }
            player_uuid = response_csgo["player_id"]

        # Get FACEIT CS2 statistics
        url = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={self.steam_id}"
        response_cs2 = r.get(url, headers=headers)
        if response_cs2.status_code != 200:
            stats["cs2"] = {"error": "FACEIT_CS2_NOT_FOUND"}
        else:
            response_cs2 = response_cs2.json()
            stats["cs2"] = {
                "createdAt": response_cs2["activated_at"],
                "avatar": response_cs2["avatar"],
                "country": response_cs2["country"],
                "statsCS2": response_cs2["games"]["cs2"],
                "statsCSGO": response_cs2["games"]["csgo"],
                "memberships": response_cs2["memberships"],
                "nickname": response_cs2["nickname"],
                "playerID": response_cs2["player_id"],
            }
            player_uuid = response_cs2["player_id"]

        if player_uuid is not None:
            # Get FACEIT statistics for the last 20 games
            url = f"https://open.faceit.com/data/v4/players/{player_uuid}/games/cs2/stats"
            response_recent = r.get(url, headers=headers)
            if response_recent.status_code != 200:
                return {"error": "FACEIT_RECENT_NOT_FOUND"}
            else:
                response_recent_json = response_recent.json()
                stats["recentGameStats"] = get_average_stats(response_recent_json["items"], response_recent_json["end"])
        else:
            return {"error": "FACEIT_NOT_FOUND"}

        return stats

    def get_esportal_stats(user_id: str) -> dict:
        pass

    def get_leetify_stats(self) -> dict:
        """Gets player statistics from Leetify API by Steam user ID. Returns a dictionary with player statistics."""

        url = f"https://api.cs-prod.leetify.com/api/profile/id/{self.steam_id}"
        response = r.get(url)

        if response.status_code != 200:
            return {
                "error": ERRORS["leetify"]["not_found"]
            }

        response_json = response.json()
        current_rating = response_json["games"][0]["skillLevel"]
        max_rating = max(game["skillLevel"]
                                        for game in response_json["games"] if game["skillLevel"] is not None)
        return {
            "recentGameRatings": response_json["recentGameRatings"],
            "currentPremiereRating": current_rating,
            "currentRatingTier": get_cs2_rating_tier(current_rating),
            "maxPremiereRating": max_rating,
            "maxRatingTier": get_cs2_rating_tier(max_rating)
        }

    def get_stats(self) -> dict:
        """Returns a formatted dictionary with player statistics to be presented to the end user."""
        logger.error(self.steam_api_key)
        logger.error(self.faceit_api_key)
        if self.is_vanity_name:
            self.steam_id = self.resolve_steam_id(self.steam_id)
            if not self.steam_id:
                return {
                    "steam": {
                        "error": ERRORS["steam"]["not_found"]
                    },
                    "leetify": {
                        "error": ERRORS["leetify"]["not_found"]
                    },
                    "faceit": {
                        "error": ERRORS["faceit"]["not_found"]
                    }
                }

        with concurrent.futures.ThreadPoolExecutor() as executor:
            steam_future = executor.submit(self.get_steam_stats)
            leetify_future = executor.submit(self.get_leetify_stats)
            faceit_future = executor.submit(self.get_faceit_stats)
            logger.error({
                "steam": steam_future.result(),
                "leetify": leetify_future.result(),
                "faceit": faceit_future.result()
            })
            return {
                "steam": steam_future.result(),
                "leetify": leetify_future.result(),
                "faceit": faceit_future.result()
            }

@app.route("/")
def home() -> str:
    file = open("tmp/stats.json", "r")
    user_stats = json.loads(file.read())
    return render_template("stats.html", user_stats=user_stats)

@app.route("/profiles/<steam_id>/")
def get_profile(steam_id: str) -> str:
    user_stats = Scraper(steam_id).get_stats()
    print(user_stats)
    return render_template("stats.html", user_stats=user_stats)

@app.route("/id/<vanity_name>/")
def get_id(vanity_name: str) -> str:
    user_stats = Scraper(vanity_name, True).get_stats()
    print(json.dumps(user_stats))
    get_cs2_rating_tier(18450)
    return render_template("stats.html", user_stats=user_stats)