from flask import Flask
import requests as r
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)


class Scraper:
    def __init__(self, steam_id) -> None:
        self.steam_id = steam_id
        self.steam_api_key = os.getenv("STEAM_API_KEY")
        self.faceit_api_key_name = os.getenv("FACEIT_API_KEY_NAME")
        self.faceit_api_key = os.getenv("FACEIT_API_KEY")

    def get_steam_stats(self) -> dict:
        """Gets player statistics from Steam API by Steam user ID. Returns a dictionary with player statistics."""
        url = (f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key="
               f"{self.steam_api_key}&steamid={self.steam_id}")
        response = r.get(url)
        return response.json()

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

@app.route("/profiles/<user_id>/")
def get_profile(user_id: str) -> dict:
    scraper = Scraper(user_id)
    user_stats = scraper.get_stats()
    return user_stats