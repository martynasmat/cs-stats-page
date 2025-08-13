import json
import os
import logging
import concurrent.futures
import time
from flask import Flask, render_template, request, abort
from dotenv import load_dotenv
import requests as r
from filters import init_filters
import hmac
import hashlib
import subprocess

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
    maps_played = dict()
    maps_won = dict()
    maps_winrate = dict()
    for item in items:
        adr += float(item["stats"].get("ADR", 0))
        kills += float(item["stats"]["Kills"])
        deaths += float(item["stats"]["Deaths"])
        assists += float(item["stats"]["Assists"])
        rounds_won += float(item["stats"]["Final Score"])
        games_won += float(item["stats"]["Result"])
        kd += float(item["stats"]["K/D Ratio"])
        headshot_percentage += float(item["stats"]["Headshots %"])
        maps_played[item["stats"]["Map"]] = maps_played.get(item["stats"]["Map"], 0) + 1
        if int(item["stats"]["Result"]) == 1:
            maps_won[item["stats"]["Map"]] = maps_won.get(item["stats"]["Map"], 0) + 1

    for key in maps_played:
        maps_winrate[key] = maps_won.get(key, 0) / maps_played[key]

    return {
        "adr": "%0.2f" % (adr / count),
        "kills": "%0.2f" % (kills / count),
        "deaths": "%0.2f" % (deaths / count),
        "assists": "%0.2f" % (assists / count),
        "kd_ratio": "%0.2f" % (kd / count),
        "rounds_won":"%0.2f" % (rounds_won / count),
        "win_percentage": "%0.2f" % (games_won / count * 100),
        "headshot_percentage": "%0.2f" % (headshot_percentage / count),
        "best_map": max(maps_winrate, key=maps_winrate.get),
        "best_map_winrate": round(maps_winrate[max(maps_winrate, key=maps_winrate.get)] * 100, 2),
        "worst_map": min(maps_winrate, key=maps_winrate.get),
        "worst_map_winrate": round(maps_winrate[min(maps_winrate, key=maps_winrate.get)] * 100, 2),
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

        url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="
               f"{self.steam_api_key}&steamids={self.steam_id}")
        response_general = r.get(url)
        if response_general.status_code != 200:
            return {
                "error": ERRORS["steam"]["not_found"]
            }

        general_json = response_general.json()["response"]
        print(general_json)
        return {
            "general": general_json["players"][0],
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
        url = f"https://open.faceit.com/data/v4/players/{player_uuid}/stats/cs2"
        response_lifetime = r.get(url, headers=headers)
        if response_cs2.status_code != 200 or response_lifetime.status_code != 200:
            stats["cs2"] = {"error": "FACEIT_CS2_NOT_FOUND"}
        else:
            response_cs2 = response_cs2.json()
            lifetime = response_lifetime.json()["lifetime"]

            stats["cs2"] = {
                "createdAt": response_cs2["activated_at"],
                "profileURL": str(response_cs2["faceit_url"]).replace('{lang}', 'en'),
                "avatar": response_cs2["avatar"],
                "country": response_cs2["country"],
                "language": response_cs2["settings"]["language"],
                "statsCS2": response_cs2["games"]["cs2"],
                "statsCSGO": response_cs2["games"]["csgo"],
                "memberships": response_cs2["memberships"],
                "nickname": response_cs2["nickname"],
                "playerID": response_cs2["player_id"],
                "hs_percentage": lifetime["Average Headshots %"],
                "clutch_1v1": round(float(lifetime["1v1 Win Rate"]) * 100),
                "clutch_1v2": round(float(lifetime["1v2 Win Rate"]) * 100),
                "winrate": lifetime["Win Rate %"],
                "kd": lifetime["Average K/D Ratio"],
                "matches": lifetime["Matches"],
                "adr": lifetime["ADR"],
                "utility_damage": lifetime["Utility Damage per Round"],
                "recent": list(map(lambda x: "W" if x == "1" else "L", lifetime["Recent Results"]))
            }
            player_uuid = response_cs2["player_id"]


        if player_uuid is not None:
            # Get FACEIT statistics for the last 50 games
            url = f"https://open.faceit.com/data/v4/players/{player_uuid}/games/cs2/stats?limit=50"
            response_recent = r.get(url, headers=headers)
            if response_recent.status_code != 200:
                return {"error": "FACEIT_RECENT_NOT_FOUND"}
            else:
                response_recent_json = response_recent.json()
                stats["recentGameStats"] = get_average_stats(response_recent_json["items"], response_recent_json["end"])
                stats["cs2"]["last_game"] = response_recent_json["items"][0]["stats"]["Created At"]
        else:
            return {"error": "FACEIT_NOT_FOUND"}

        return stats

    def get_esportal_stats(user_id: str) -> dict:
        pass

    def get_leetify_stats(self) -> dict:
        """Gets player statistics from Leetify API by Steam user ID. Returns a dictionary with player statistics."""

        url = f"https://api.cs-prod.leetify.com/api/profile/id/{self.steam_id}"
        response_not_public = r.get(url)
        url = f"https://api-public.cs-prod.leetify.com/v3/profile?steam64_id={self.steam_id}"
        response = r.get(url)

        if response.status_code != 200 or response_not_public.status_code != 200:
            return {
                "error": ERRORS["leetify"]["not_found"]
            }

        response_json = response.json()
        response_not_public_json = response_not_public.json()
        max_rating = max(game["skillLevel"]
                                        for game in response_not_public_json["games"] if game["skillLevel"] is not None
                         and game['dataSource'] == 'matchmaking')
        banned_mates = list(filter(lambda x: x["isBanned"], response_not_public_json["teammates"]))
        return {
            "aim": round(response_json["rating"]["aim"], 2),
            "preaim": round(response_json["stats"]["preaim"]),
            "matches": response_json["total_matches"],
            "kd": 0,
            "opening": round(response_json["rating"]["opening"] * 100, 2),
            "avg_he": round(response_json["stats"]["he_foes_damage_avg"], 2),
            "rating": round(response_json["ranks"]["leetify"], 2),
            "position": round(response_json["rating"]["positioning"], 2),
            "banned_mates": round(len(banned_mates) / len(response_not_public_json["teammates"]) * 100, 2),
            "party": round(response_not_public_json["club"]["ratings"]["leetifyRating"], 2)
                if response_not_public_json["club"] is not None else 0,
            "reaction_time": round(response_json["stats"]["reaction_time_ms"]),
            "winrate": round(response_json["winrate"] * 100),
            "utility": round(response_json["rating"]["utility"], 2),
            "clutch": round(response_json["rating"]["clutch"] * 100, 2),
            "max_rating": max_rating,
            "nickname": response_json["name"],
            "leetify_url": f"https://leetify.com/app/profile/{self.steam_id}",
        }

    def get_stats(self) -> dict:
        """Returns a formatted dictionary with player statistics to be presented to the end user."""
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
            # print({
            #     "steam": steam_future.result(),
            #     "leetify": leetify_future.result(),
            #     "faceit": faceit_future.result()
            # })
            return {
                "steam": steam_future.result(),
                "leetify": leetify_future.result(),
                "faceit": faceit_future.result()
            }

@app.route("/", methods=["GET"])
def home() -> str:
    file = open("tmp/stats.json", "r")
    user_stats = json.loads(file.read())
    return render_template("stats_design.html", user_stats=user_stats)

@app.route("/profiles/<steam_id>/", methods=["GET"])
def get_profile(steam_id: str) -> str:
    user_stats = Scraper(steam_id).get_stats()
    return render_template("stats_design.html", user_stats=user_stats)

@app.route("/id/<vanity_name>/", methods=["GET"])
def get_id(vanity_name: str) -> str:
    user_stats = Scraper(vanity_name, True).get_stats()
    get_cs2_rating_tier(18450)
    return render_template("stats_design.html", user_stats=user_stats)

@app.route("/redeploy/", methods=["POST"])
def redeploy() -> tuple[str, int]:
    header_signature = request.headers.get('X-Hub-Signature-256')
    payload = request.data
    if not verify_signature(payload, header_signature):
        abort(403, "Signature verification failed")

    subprocess.run(["/bin/bash", "/home/cs-stats-page/backend/deploy_script.sh"])
    return "Webhook received and verified", 200


def verify_signature(payload, header_signature):
    if header_signature is None:
        return False

    sha_name, signature = header_signature.split('=')
    if sha_name != 'sha256':
        return False

    mac = hmac.new(os.getenv("REDEPLOY_WEBHOOK_SECRET").encode(), msg=payload, digestmod=hashlib.sha256)
    expected_signature = mac.hexdigest()

    return hmac.compare_digest(expected_signature, signature)


if __name__ == "__main__":
    app.run(debug=True)

