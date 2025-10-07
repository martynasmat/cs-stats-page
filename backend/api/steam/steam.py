import os
import requests as r
from flask import request, Blueprint
from .helpers import resolve_steam_id, resolve_steam_id_from_url, get_steam_level_shape_link

STEAM_API_KEY = os.getenv("STEAM_API_KEY")

steam_bp = Blueprint("steam", __name__)

@steam_bp.route("/resolve-url/", methods=["POST"])
def resolve_url() -> tuple[dict, int]:
    data = request.json

    if data == None:
        return {"message": "Request is empty"}, 400

    profile_link = data["profileLink"]
    steam_id = resolve_steam_id_from_url(profile_link, STEAM_API_KEY)

    if steam_id == None:
        return {"message": "Steam profile not found"}, 404

    return {"id": steam_id}, 200

@steam_bp.route("/resolve-id/<vanity_name>/", methods=["GET"])
def resolve_id(vanity_name: str) -> tuple[dict, int]:
    id = resolve_steam_id(vanity_name, STEAM_API_KEY)

    if id == None:
        return {"message": "Profile not found"}, 404 

    return {"id": id}, 200

@steam_bp.route("/profile/<steam_id>/", methods=["GET"])
def get_steam_stats(steam_id: str) -> tuple[dict, int]:
    stats = dict()
    print('asdasdasdasd')
    url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="
            f"{STEAM_API_KEY}&steamids={steam_id}")
    response_general = r.get(url)

    if response_general.status_code != 200:
        return {"message": "Steam profile not found"}, 404

    url = f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={STEAM_API_KEY}&steamid={steam_id}"
    response_playtime = r.get(url)
    if response_playtime.status_code != 200 or response_playtime.json()["response"] == {}:
        stats["playtime"] = None
    else:
        playtime_json = response_playtime.json()
        games = playtime_json["response"].get("games", [])
        cs = next((i for i in games if i.get("appid") == 730), None)
        if cs is None:
            stats["playtime"] = None
        else:
            stats["playtime"] = {
                "games_played": playtime_json["response"]["game_count"],
                "playtime_total": cs["playtime_forever"],
                "playtime_2weeks": cs["playtime_2weeks"] if cs.get("playtime_2weeks") is not None else 0,
            }

    url = f"https://api.steampowered.com/IPlayerService/GetBadges/v1/?key={STEAM_API_KEY}&steamid={steam_id}"
    response_xp = r.get(url)
    xp_json = response_xp.json()
    general_json = response_general.json()["response"]["players"][0]
    steam_level = xp_json["response"].get("player_level", 0) if response_xp.status_code == 200 else 0
    general_json["steam_level"] = steam_level
    general_json["steam_level_bg"] = get_steam_level_shape_link(steam_level) if steam_level > 99 else ""
    general_json["steam_xp"] = xp_json["response"].get("player_xp", 0) if response_xp.status_code == 200 else 0
    stats["general"] = general_json

    url = f"https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key={STEAM_API_KEY}&steamid={steam_id}"
    friends_response = r.get(url)

    if friends_response.status_code != 200:
        stats["friends"] = None
    else:
        friends_json = friends_response.json()
        stats["friends"] = {"count": len(friends_json["friendslist"]["friends"])}

    url = f"https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key={STEAM_API_KEY}&steamids={steam_id}"
    bans_response = r.get(url)
    bans_json = bans_response.json()["players"][0]
    stats["banned"] = any(((v not in ['none', 0, False]) for v in list(bans_json.values())[1:]))
    return stats, 200