import os
import logging
import concurrent.futures
import time
from xml.etree.ElementTree import indent

from flask import Flask, render_template, request, abort, redirect
from dotenv import load_dotenv
import requests as r
import json
from filters import init_filters
from urllib.parse import urlsplit
import hmac
import hashlib
import subprocess

load_dotenv()
app = Flask(__name__)
init_filters(app)
logger = logging.getLogger(__name__)

STEAM_API_KEY = os.getenv("STEAM_API_KEY")
FACEIT_API_KEY_NAME = os.getenv("FACEIT_API_KEY_NAME")
FACEIT_API_KEY = os.getenv("FACEIT_API_KEY")

ERRORS = {
    "steam": {
        "not_found": "STEAM_NOT_FOUND",
        "playtime_not_found": "STEAM_PLAYTIME_NOT_FOUND",
        "friends_not_found": "STEAM_FRIENDS_NOT_FOUND",
    },
    "faceit": {
        "not_found": "FACEIT_NOT_FOUND",
        "no_recent_games": "FACEIT_RECENT_NOT_FOUND",
        "no_csgo": "FACEIT_CSGO_NOT_FOUND",
        "no_cs2": "FACEIT_CS2_NOT_FOUND",
        "csgo": {
            "no_lifetime": "FACEIT_CSGO_LIFETIME_NOT_FOUND",
        },
        "cs2": {
            "no_lifetime": "FACEIT_CS2_LIFETIME_NOT_FOUND",
        },
        "no_active_match": "FACEIT_PLAYER_NOT_IN_GAME",
        "peak": "FACEIT_PEAK_NOT_FOUND",
    },
    "leetify": {
        "not_found": "LEETIFY_NOT_FOUND"
    }
}


CS2_RATINGS = {
    0: "tier1",
    5000: "tier2",
    10000: "tier3",
    15000: "tier4",
    20000: "tier5",
    25000: "tier6",
    30000: "tier7",
}

FACEIT_LEVELS = {
    100: "1",
    501: "2",
    751: "3",
    901: "4",
    1051: "5",
    1201: "6",
    1351: "7",
    1531: "8",
    1751: "9",
    2001: "10",
}

STEAM_TIERS = [
    "circles",
    "hexagons",
    "shields",
    "books",
    "chevrons",
    "circle2",
    "angle",
    "flag",
    "wings",
    "arrows",
    "crystals",
    "space",
    "waterelement",
    "fireelement",
    "earthelement",
    "airelement_1-2",
    "airelement_3-4",
    "airelement_5-6",
    "airelement_7-8",
    "airelement_9-10",
    "geo_1-2",
    "geo_3-4",
    "geo_5-6",
    "geo_7-8",
    "geo_9-10",
    "mandala_1-2",
    "mandala_3-4",
    "mandala_5-6",
    "mandala_7-8",
    "mandala_9-10",
    "spiro_1-2",
    "spiro_3-4",
    "spiro_5-6",
    "spiro_7-8",
    "spiro_9-10",
    "patterns_1-2",
    "patterns_3-4",
    "patterns_5-6",
    "patterns_7-8",
    "patterns_9-10",
    "shapes_1",
    "shapes_2",
    "shapes_3",
    "shapes_4",
    "shapes_5",
    "grunge_1",
    "grunge_2",
    "grunge_3",
    "grunge_4",
    "grunge_5",
    "halftone_1",
    "halftone_2",
    "halftone_3",
    "5300_dashes",
    "5400_crosshatch",
    "5500_spiral",
    "5600_leaves",
    "5700_mountain",
    "5800_rain",
    "5900_tornado",
    "6000_snowflake",
    "6100_crown",
]

def get_steam_path(url: str) -> str:
    split = urlsplit(url)
    host = split.hostname
    path = split.path

    if host != "steamcommunity.com" and host != "www.steamcommunity.com":
        raise ValueError("Invalid host")

    _, segment_1, segment_2 = path.split("/")

    if segment_1 != "id" and segment_1 != "profiles" or segment_2 == "":
        raise ValueError("Invalid segment")

    return f"/{segment_1}/{segment_2}/"

def get_cs2_rating_tier(rating: int) -> str:
    tier = ""

    for key in CS2_RATINGS:
        if rating >= key:
            tier = CS2_RATINGS[key]
        else:
            break

    return tier

def get_steam_level_shape_link(xp: int) -> str:
    base_url = 'https://community.fastly.steamstatic.com/public/shared/images/community/levels_'
    tier = min(xp // 100, len(STEAM_TIERS) - 1)

    return f"{base_url}{STEAM_TIERS[tier]}.png"

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
        self.player_uuid = None

    def resolve_steam_id(self, vanity_name: str) -> str | None:
        url = (f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key="
               f"{STEAM_API_KEY}&vanityurl={vanity_name}")

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

        stats = dict()
        url = (f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key="
               f"{STEAM_API_KEY}&steamids={self.steam_id}")
        response_general = r.get(url)

        if response_general.status_code != 200:
            return {
                "error": ERRORS["steam"]["not_found"]
            }

        url = f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={STEAM_API_KEY}&steamid={self.steam_id}"
        response_playtime = r.get(url)
        if response_playtime.status_code != 200 or response_playtime.json()["response"] == {}:
            stats["playtime"] = {"error": ERRORS["steam"]["playtime_not_found"]}
        else:
            playtime_json = response_playtime.json()
            games = playtime_json["response"]["games"]
            cs = next((i for i in games if i.get("appid") == 730), None)
            if cs is None:
                stats["playtime"] = {"error": ERRORS["steam"]["playtime_not_found"]}
            else:
                stats["playtime"] = {
                    "games_played": playtime_json["response"]["game_count"],
                    "playtime_total": cs["playtime_forever"],
                    "playtime_2weeks": cs["playtime_2weeks"] if cs.get("playtime_2weeks") is not None else 0,
                }

        url = f"https://api.steampowered.com/IPlayerService/GetBadges/v1/?key={STEAM_API_KEY}&steamid={self.steam_id}"
        response_xp = r.get(url)
        xp_json = response_xp.json()
        general_json = response_general.json()["response"]["players"][0]
        steam_level = xp_json["response"]["player_level"] if response_xp.status_code == 200 else 0
        general_json["steam_level"] = steam_level
        general_json["steam_level_bg"] = get_steam_level_shape_link(steam_level) if steam_level > 99 else ""
        general_json["steam_xp"] = xp_json["response"]["player_xp"] if response_xp.status_code == 200 else 0
        stats["general"] = general_json

        url = f"https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key={STEAM_API_KEY}&steamid={self.steam_id}"
        friends_response = r.get(url)

        if friends_response.status_code != 200:
            stats["friends"] = {"error": ERRORS["steam"]["friends_not_found"]}
        else:
            friends_json = friends_response.json()
            stats["friends"] = {"count": len(friends_json["friendslist"]["friends"])}

        url = f"https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key={STEAM_API_KEY}&steamids={self.steam_id}"
        bans_response = r.get(url)
        bans_json = bans_response.json()["players"][0]
        stats["banned"] = any(((v not in ['none', 0, False]) for v in list(bans_json.values())[1:]))
        return stats

    def get_faceit_stats(self) -> dict:
        """Gets player statistics from FACEIT API by Steam user ID. Returns a dictionary with player statistics."""
        headers = {"Authorization": f"Bearer {FACEIT_API_KEY}"}
        stats = {
            "csgo": {},
            "cs2": {},
            "recentGameStats": {}
        }
        has_cs2 = False
        has_csgo = False

        # Get FACEIT CS2 statistics
        url = f"https://open.faceit.com/data/v4/players?game=cs2&game_player_id={self.steam_id}"
        response_cs2 = r.get(url, headers=headers)

        if response_cs2.status_code != 200:
            stats["cs2"] = {"error": "FACEIT_CS2_NOT_FOUND"}
        else:
            has_cs2 = True
            response_cs2 = response_cs2.json()
            self.player_uuid = response_cs2["player_id"]
            url = f"https://open.faceit.com/data/v4/players/{self.player_uuid}/stats/cs2"
            response_lifetime = r.get(url, headers=headers)
            if response_lifetime.status_code == 200:
                lifetime = response_lifetime.json()["lifetime"]
                lifetime_dict = {
                    "hs_percentage": lifetime["Average Headshots %"],
                    "clutch_1v1": round(
                        float(lifetime["1v1 Win Rate"]) * 100) if "1v1 Win Rate" in lifetime is not None else "NaN",
                    "clutch_1v2": round(
                        float(lifetime["1v2 Win Rate"]) * 100) if "1v2 Win Rate" in lifetime is not None else "NaN",
                    "winrate": lifetime["Win Rate %"],
                    "kd": lifetime["Average K/D Ratio"],
                    "matches": lifetime["Matches"],
                    "adr": lifetime["ADR"] if "ADR" in lifetime is not None else "NaN",
                    "utility_damage": lifetime[
                        "Utility Damage per Round"] if "Utility Damage per Round" in lifetime is not None else "NaN",
                    "recent": list(map(lambda x: "W" if x == "1" else "L", lifetime["Recent Results"]))
                }
            else:
                lifetime_dict = {"error": ERRORS["faceit"]["cs2"]["no_lifetime"]}

            stats["cs2"] = {
                "createdAt": response_cs2["activated_at"],
                "profileURL": str(response_cs2["faceit_url"]).replace('{lang}', 'en'),
                "avatar": response_cs2["avatar"],
                "country": response_cs2["country"],
                "language": response_cs2["settings"]["language"],
                "statsCS2": response_cs2["games"]["cs2"],
                "statsCSGO": response_cs2["games"]["csgo"] if "csgp" in response_cs2["games"] else ERRORS["faceit"]["no_csgo"],
                "memberships": response_cs2["memberships"],
                "nickname": response_cs2["nickname"],
                "playerID": response_cs2["player_id"],
                "lifetime": lifetime_dict,
            }

        # Get FACEIT CS:GO statistics
        url = f"https://open.faceit.com/data/v4/players?game=csgo&game_player_id={self.steam_id}"
        response_csgo = r.get(url, headers=headers)
        if response_csgo.status_code != 200:
            stats["csgo"] = {
                "error": ERRORS["faceit"]["not_found"]
            }
        else:
            has_csgo = True
            response_csgo = response_csgo.json()
            url = f"https://open.faceit.com/data/v4/players/{self.player_uuid}/stats/csgo"
            response_lifetime = r.get(url, headers=headers)
            if response_lifetime.status_code == 200:
                lifetime = response_lifetime.json()["lifetime"]
                lifetime_dict = {
                    "hs_percentage": lifetime["Average Headshots %"],
                    "winrate": lifetime["Win Rate %"],
                    "kd": lifetime["Average K/D Ratio"],
                    "matches": lifetime["Matches"],
                    "recent": list(map(lambda x: "W" if x == "1" else "L", lifetime["Recent Results"]))
                }
            else:
                lifetime_dict = {"error": ERRORS["faceit"]["cs2"]["no_lifetime"]}

            stats["csgo"] = {
                "createdAt": response_csgo["activated_at"],
                "nickname": response_csgo["nickname"],
                "profileURL": str(response_csgo["faceit_url"]).replace('{lang}', 'en'),
                "avatar": response_csgo["avatar"],
                "country": response_csgo["country"],
                "statsCSGO": response_csgo["games"]["csgo"],
                "memberships": response_csgo["memberships"],
                "lifetime": lifetime_dict,
            }

        if not has_cs2 and not has_csgo:
            return {
                "error": ERRORS["faceit"]["not_found"]
            }

        if has_cs2 and self.player_uuid is not None:
            # Get FACEIT statistics for the last 50 games
            url = f"https://open.faceit.com/data/v4/players/{self.player_uuid}/games/cs2/stats?limit=50"
            response_recent = r.get(url, headers=headers)
            if response_recent.status_code != 200 or response_recent.json()["items"] == []:
                stats["recentGameStats"] = {"error": ERRORS["faceit"]["no_recent_games"]}
            else:
                response_recent_json = response_recent.json()
                stats["recentGameStats"] = get_average_stats(response_recent_json["items"], response_recent_json["end"])
                stats["cs2"]["last_game"] = response_recent_json["items"][0]["stats"]["Created At"]

            # Get FACEIT bans
            faceit_bans = r.get(f"https://open.faceit.com/data/v4/players/{self.player_uuid}/bans", headers=headers).json()
            if faceit_bans["items"]:
                stats["cs2"]["bans"] = faceit_bans["items"]

        # Get Faceit bans
        url = f"https://open.faceit.com/data/v4/players/{self.player_uuid}/bans"
        response_bans = r.get(url, headers=headers)
        bans_json = response_bans.json()
        stats["banned"] = bans_json["items"] != []

        stats["peak"] = self.get_peak_faceit_elo()

        url = f"https://www.faceit.com/api/match/v1/matches/groupByState?userId={self.player_uuid}"
        response_match = r.get(url)

        if response_match.status_code != 200:
            stats["active_match"] = {"error": ERRORS["faceit"]["no_active_match"]}
        else:
            response_match_json = response_match.json()

            if response_match_json["payload"] == {}:
                stats["active_match"] = {"error": ERRORS["faceit"]["no_active_match"]}
            else:
                stats["active_match"] = {"id": response_match_json["payload"]["ONGOING"][0]["id"]}

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

        skill_levels = [game["skillLevel"]
                                        for game in response_not_public_json["games"] if game["skillLevel"] is not None
                         and game['dataSource'] == 'matchmaking']
        max_rating = max(skill_levels) if len(skill_levels) > 0 else None

        if response_not_public_json["teammates"] is not False:
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
            "banned_mates": round(len(banned_mates) / len(response_not_public_json["teammates"]) * 100, 2)
                if response_not_public_json["teammates"] is not False else 'NaN',
            "party": round(response_not_public_json["club"]["ratings"]["leetifyRating"], 2)
                if response_not_public_json["club"] is not None else 0,
            "reaction_time": round(response_json["stats"]["reaction_time_ms"]),
            "winrate": round(response_json["winrate"] * 100),
            "utility": round(response_json["rating"]["utility"], 2),
            "clutch": round(response_json["rating"]["clutch"] * 100, 2),
            "max_rating": max_rating,
            "nickname": response_json["name"],
            "leetify_url": f"https://leetify.com/app/profile/{self.steam_id}",
            "rating_tier": get_cs2_rating_tier(max_rating) if max_rating is not None else None
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
            return {
                "steam": steam_future.result(),
                "leetify": leetify_future.result(),
                "faceit": faceit_future.result()
            }

    def get_peak_faceit_elo(self) -> dict:
        """Gets peak Faceit ELO. Returns an integer."""
        # 2235828605000 = Nov 06 2040
        url = (f"https://api.faceit.com/stats/v1/stats/time/users/{self.player_uuid}/games/cs2?size=1000&page=0&"
               f"from={round((time.time() * 1000) - (6 * 30 * 24 * 60 * 60 * 1000))}&to=2235828605000")
        response = r.get(url)
        peak = 0
        for item in response.json():
            try:
                if int(item["elo"]) > peak:
                    peak = int(item["elo"])
            except KeyError:
                break

        peak_lvl = ""
        if peak != 0:
            for key in FACEIT_LEVELS:
                if peak >= key:
                    peak_lvl = FACEIT_LEVELS[key]
                else:
                    break

        if peak == 0 and peak_lvl == "":
            return {
                "error": ERRORS["faceit"]["peak"]
            }
        else:
            return {
                "peak_elo": peak,
                "peak_level": peak_lvl,
            }


def get_faceit_match_stats(match_id: str) -> str:
    url = f"https://open.faceit.com/data/v4/matches/{match_id}"
    resp = r.get(url, headers={"Authorization": f"Bearer {FACEIT_API_KEY}"})
    # print(json.dumps(resp.json(), indent=4))
    return resp.json()


@app.route("/", methods=["GET"])
def home() -> str:
    return render_template("index.html")

@app.route("/profiles/<steam_id>/", methods=["GET"])
def get_profile(steam_id: str) -> str:
    user_stats = Scraper(steam_id).get_stats()
    return render_template("stats_design.html", user_stats=user_stats)

@app.route("/id/<vanity_name>/", methods=["GET"])
def get_id(vanity_name: str) -> str:
    user_stats = Scraper(vanity_name, True).get_stats()
    return render_template("stats_design.html", user_stats=user_stats)

@app.route("/match/<match_id>", methods=["GET"])
def get_match_id(match_id: str) -> str:
    match_stats = get_faceit_match_stats(match_id)
    return match_stats

@app.route("/check-link/", methods=["POST"])
def check_link():
    link = request.form.get("profile-input")

    try:
        if link is None:
            return redirect("/")

        path = get_steam_path(link)
        return redirect(path)
    except:
        return redirect("/")

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

