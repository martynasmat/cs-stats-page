import requests as r
from flask import Blueprint
from .helpers import get_cs2_rating_tier

leetify_bp = Blueprint("leetify", __name__)

@leetify_bp.route("/profile/<steam_id>/", methods=["GET"])
def get_leetify_stats(steam_id: str) -> tuple[dict, int]:
    url = f"https://api.cs-prod.leetify.com/api/profile/id/{steam_id}"
    response_not_public = r.get(url)
    url = f"https://api-public.cs-prod.leetify.com/v3/profile?steam64_id={steam_id}"
    response = r.get(url)

    if response.status_code != 200 or response_not_public.status_code != 200:
        return {"message": "Profile not found"}, 404

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
            if response_not_public_json["teammates"] is not False else None,
        "party": round(response_not_public_json["club"]["ratings"]["leetifyRating"], 2)
            if response_not_public_json["club"] is not None else 0,
        "reaction_time": round(response_json["stats"]["reaction_time_ms"]),
        "winrate": round(response_json["winrate"] * 100),
        "utility": round(response_json["rating"]["utility"], 2),
        "clutch": round(response_json["rating"]["clutch"] * 100, 2),
        "max_rating": max_rating,
        "nickname": response_json["name"],
        "leetify_url": f"https://leetify.com/app/profile/{steam_id}",
        "rating_tier": get_cs2_rating_tier(max_rating) if max_rating is not None else None
    }, 200