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
                abort(404, "Steam user ID not found")

        url = (f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key="
               f"{self.steam_api_key}&steamid={self.steam_id}")
        response_cs2 = r.get(url)

        url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="
               f"{self.steam_api_key}&steamids={self.steam_id}")
        response_general = r.get(url)

        return {
            "general": response_general.json()["response"]["players"][0],
            "cs2": response_cs2.json()
        }

    def get_faceit_stats(self) -> dict:
        """Gets player statistics from FACEIT API by Steam user ID. Returns a dictionary with player statistics."""
        stats = {}
        headers = {"Authorization": f"Bearer {self.faceit_api_key}"}

        # Get FACEIT statistics
        url_get_username = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={self.steam_id}"
        response = r.get(url_get_username, headers=headers).json()
        stats["createdAt"] = response["activated_at"]
        stats["avatar"] = response["avatar"]
        stats["country"] = response["country"]
        stats["statsCS2"] = response["games"]["cs2"]
        stats["statsCSGO"] = response["games"]["csgo"]
        stats["memberships"] = response["memberships"]
        stats["nickname"] = response["nickname"]
        return stats

    def get_esportal_stats(user_id: str) -> dict:
        pass

    def get_leetify_stats(self) -> dict:
        """Gets player statistics from Leetify API by Steam user ID. Returns a dictionary with player statistics."""
        stats = {}

        # Get Leetify statistics
        url = f"https://api.cs-prod.leetify.com/api/profile/id/{self.steam_id}"
        response = r.get(url).json()
        stats["recentGameRatings"] = response["recentGameRatings"]
        stats["currentPremiereRating"] = response["games"][0]["skillLevel"]
        stats["maxPremiereRating"] = max(
            game["skillLevel"] for game in response["games"] if game["skillLevel"] is not None)

        return stats

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
    return render_template("stats.html", user_stats=user_stats)

@app.route("/id/<vanity_name>/")
def get_id(vanity_name: str) -> str:
    user_stats = Scraper(vanity_name, True).get_stats()
    return render_template("stats.html", user_stats=user_stats)