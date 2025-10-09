from flask import request, Blueprint, abort
import subprocess
from .helpers import verify_signature

redeploy_bp = Blueprint("redeploy", __name__)

@redeploy_bp.route("/redeploy/", methods=["POST"])
def redeploy() -> tuple[str, int]:
    header_signature = request.headers.get('X-Hub-Signature-256')
    payload = request.data
    if not verify_signature(payload, header_signature):
        abort(403, "Signature verification failed")

    subprocess.run(["/bin/bash", "/home/cs-stats-page/backend/deploy_script.sh"])
    return "Webhook received and verified", 200