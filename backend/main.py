from flask import Flask, abort
import requests as r
from dotenv import load_dotenv
from typing import Self
import os
import logging

load_dotenv()
app = Flask(__name__)
logger = logging.getLogger(__name__)


class Scraper:
    def __init__(self) -> None:
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
        except Exception as e:
            logger.error(str(e))

    def get_steam_stats(self, steam_id: str) -> dict:
        """Gets player statistics from Steam API by Steam user ID. Returns a dictionary with player statistics."""
        url = (f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key="
               f"{self.steam_api_key}&steamid={steam_id}")
        response = r.get(url)
        return response.json()

    def get_faceit_stats(self, steam_id: str) -> dict:
        """Gets player statistics from FACEIT API by Steam user ID. Returns a dictionary with player statistics."""
        stats = {}
        headers = {"Authorization": f"Bearer {self.faceit_api_key}"}

        # Get FACEIT statistics
        url_get_username = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={steam_id}"
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

    def get_leetify_stats(self, steam_id: str) -> dict:
        """Gets player statistics from Leetify API by Steam user ID. Returns a dictionary with player statistics."""
        stats = {}

        # Get Leetify statistics
        url = f"https://api.cs-prod.leetify.com/api/profile/id/{steam_id}"
        response = r.get(url).json()
        stats["recentGameRatings"] = response["recentGameRatings"]
        stats["currentPremiereRating"] = response["games"][0]["skillLevel"]
        stats["maxPremiereRating"] = max(
            game["skillLevel"] for game in response["games"] if game["skillLevel"] is not None)

        return stats

    def get_stats(self, steam_id: str) -> dict:
        """Returns a formatted dictionary with player statistics to be presented to the end user."""
        stats = {
            "steam": self.get_steam_stats(steam_id),
            "leetify": self.get_leetify_stats(steam_id),
            "faceit": self.get_faceit_stats(steam_id),
            "esportal": self.get_esportal_stats(),
        }

        return stats
        
scraper = Scraper()

@app.route("/profiles/<steam_id>/")
def get_profile(steam_id: str) -> dict:
    user_stats = scraper.get_stats(steam_id)
    return user_stats

@app.route("/id/<vanity_name>/")
def get_id(vanity_name: str) -> dict:
    steam_id = scraper.resolve_steam_id(vanity_name)

    if steam_id is None:
        abort(404, "Could not find profile with such id")

    stats = scraper.get_stats(steam_id)

    return stats