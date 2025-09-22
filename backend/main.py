import os
from flask_cors import CORS

from flask import Flask,  request, abort
from dotenv import load_dotenv
import requests as r
import hmac
import hashlib
import subprocess
from api.steam.steam import steam_bp
from api.leetify.leetify import leetify_bp
from api.faceit.faceit import faceit_bp

load_dotenv()
app = Flask(__name__)
app.register_blueprint(steam_bp, url_prefix="/api/steam")
app.register_blueprint(leetify_bp, url_prefix="/api/leetify")
app.register_blueprint(faceit_bp, url_prefix="/api/faceit")
CORS(app, origins=["http://localhost:5174"])

FACEIT_API_KEY_NAME = os.getenv("FACEIT_API_KEY_NAME")
FACEIT_API_KEY = os.getenv("FACEIT_API_KEY")


def get_faceit_match_stats(match_id: str) -> str:
    url = f"https://open.faceit.com/data/v4/matches/{match_id}"
    resp = r.get(url, headers={"Authorization": f"Bearer {FACEIT_API_KEY}"})
    # print(json.dumps(resp.json(), indent=4))
    return resp.json()


@app.route("/match/<match_id>", methods=["GET"])
def get_match_id(match_id: str) -> str:
    match_stats = get_faceit_match_stats(match_id)
    return match_stats


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