import json
import os
import logging
from flask import Flask, abort, render_template
from dotenv import load_dotenv
import requests as r
from filters import init_filters

load_dotenv()
app = Flask(__name__)
init_filters(app)
logger = logging.getLogger(__name__)


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
        adr += float(item["stats"]["ADR"])
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
        if self.is_vanity_name:
            self.steam_id = self.resolve_steam_id(self.steam_id)
            if not self.steam_id:
                return {
                    "error": "STEAM_NOT_FOUND"
                }

        # CS2 app ID is 730
        url = (f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key="
               f"{self.steam_api_key}&steamid={self.steam_id}&appid=730")
        response_cs2 = r.get(url)

        url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="
               f"{self.steam_api_key}&steamids={self.steam_id}")
        response_general = r.get(url)

        return {
            "general": response_general.json()["response"]["players"][0] if response_general.status_code == 200
                                                                            and response_general.json()["response"]["players"] else {"error": "STEAM_NOT_FOUND"},
            "cs2": response_cs2.json() if response_cs2.status_code == 200 else {"error": "STEAM_NOT_FOUND"}
        }

    def get_faceit_stats(self) -> dict:
        """Gets player statistics from FACEIT API by Steam user ID. Returns a dictionary with player statistics."""
        headers = {"Authorization": f"Bearer {self.faceit_api_key}"}

        # Get FACEIT statistics
        url = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={self.steam_id}"
        response_general = r.get(url, headers=headers)
        if response_general.status_code != 200:
            return {"error": "FACEIT_NOT_FOUND"}

        response_general_json = response_general.json()

        # Get FACEIT statistics for the last 20 games
        url = f"https://open.faceit.com/data/v4/players/{response_general_json["player_id"]}/games/cs2/stats"
        response_recent = r.get(url, headers=headers)
        if response_general.status_code != 200:
            return {"error": "FACEIT_RECENT_NOT_FOUND"}

        response_recent_json = response_recent.json()

        stats = {
            "createdAt": response_general_json["activated_at"],
            "avatar": response_general_json["avatar"],
            "country": response_general_json["country"],
            "statsCS2": response_general_json["games"]["cs2"],
            "statsCSGO": response_general_json["games"]["csgo"],
            "memberships": response_general_json["memberships"],
            "nickname": response_general_json["nickname"],
            "playerID": response_general_json["player_id"],
            "recentGameStats": get_average_stats(response_recent_json["items"], response_recent_json["end"]),
        }
        return stats

    def get_esportal_stats(user_id: str) -> dict:
        pass

    def get_leetify_stats(self) -> dict:
        """Gets player statistics from Leetify API by Steam user ID. Returns a dictionary with player statistics."""
        # Get Leetify statistics
        url = f"https://api.cs-prod.leetify.com/api/profile/id/{self.steam_id}"
        response = r.get(url)
        if response.status_code == 200:
            response_json = response.json()
            return {
                "recentGameRatings": response_json["recentGameRatings"],
                "currentPremiereRating": response_json["games"][0]["skillLevel"],
                "maxPremiereRating": max(game["skillLevel"]
                                         for game in response_json["games"] if game["skillLevel"] is not None)
            }
        else:
            return {
                "error": "LEETIFY_NOT_FOUND"
            }

    def get_stats(self) -> dict:
        """Returns a formatted dictionary with player statistics to be presented to the end user."""
        stats = {
            "steam": self.get_steam_stats(),
            "leetify": self.get_leetify_stats(),
            "faceit": self.get_faceit_stats(),
            "esportal": self.get_esportal_stats(),
        }

        return stats

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
    return render_template("stats.html", user_stats=user_stats)