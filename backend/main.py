from flask import Flask
import requests as r
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)


def get_steam_stats(user_id: str) -> dict:
    api_key = os.getenv("STEAM_API_KEY")
    steam_url = f"https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key={api_key}&steamid={user_id}"
    steam_response = r.get(steam_url)
    return steam_response.json()


def get_faceit_stats(user_id: str) -> dict:
    pass


def get_esportal_stats(user_id: str) -> dict:
    pass


def get_leetify_stats(user_id: str) -> dict:
    stats = {}
    url = f"https://api.cs-prod.leetify.com/api/profile/id/{user_id}"
    response = r.get(url).json()
    stats["recentGameRatings"] = response["recentGameRatings"]
    stats["currentPremiereRating"] = response["games"][0]["skillLevel"]
    stats["maxPremiereRating"] = max(game["skillLevel"] for game in response["games"] if game["skillLevel"] is not None)
    return stats

@app.route("/profiles/<user_id>/")
def get_profile(user_id: str) -> dict:
    user_stats = {
        "steam_stats": get_steam_stats(user_id),
        "faceit_stats": get_faceit_stats(user_id),
        "esportal_stats": get_esportal_stats(user_id),
        "leetify_stats": get_leetify_stats(user_id)
    }

    return user_stats