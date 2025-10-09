import os
import hmac
import hashlib

REDEPLOY_WEBHOOK_SECRET = os.getenv("REDEPLOY_WEBHOOK_SECRET")

def verify_signature(payload, header_signature):
    if header_signature is None:
        return False

    sha_name, signature = header_signature.split('=')
    if sha_name != 'sha256' or REDEPLOY_WEBHOOK_SECRET == None:
        return False

    mac = hmac.new(REDEPLOY_WEBHOOK_SECRET.encode(), msg=payload, digestmod=hashlib.sha256)
    expected_signature = mac.hexdigest()

    return hmac.compare_digest(expected_signature, signature)