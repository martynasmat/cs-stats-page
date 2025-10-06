from flask import Blueprint
import os
import json
import requests as r

FACEIT_API_KEY_NAME = os.getenv("FACEIT_API_KEY_NAME")
FACEIT_API_KEY = os.getenv("FACEIT_API_KEY")

match_bp = Blueprint("match", __name__)

@match_bp.route("/<match_id>/", methods=["GET"])
def get_match_info(match_id: str) -> tuple[dict, int]:
    url = f"https://open.faceit.com/data/v4/matches/{match_id}"
    resp = r.get(url, headers={"Authorization": f"Bearer {FACEIT_API_KEY}"})
    print(json.dumps(resp.json(), indent=4))
    return resp.json(), 200