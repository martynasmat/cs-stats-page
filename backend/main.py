from flask import Flask
import requests as r

app = Flask(__name__)


def get_steam_stats(user_id: str) -> dict:
    steam_url = f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=STEAM_API_KEY&steamids={user_id}"
    steam_response = r.get(steam_url)
    return steam_response.json()


def get_faceit_stats(user_id: str) -> dict:
    pass


def get_esportal_stats(user_id: str) -> dict:
    pass


def get_leetify_stats(user_id: str) -> dict:
    pass


@app.route("profiles/<user_id>/")
def get_profile(user_id: str) -> dict:
    user_stats = {
        "steam_stats": get_steam_stats(user_id),
        "faceit_stats": get_faceit_stats(user_id),
        "esportal_stats": get_esportal_stats(user_id),
        "leetify_stats": get_leetify_stats(user_id)
    }

    return user_stats