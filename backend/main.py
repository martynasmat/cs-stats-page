from flask_cors import CORS
from flask import Flask
from dotenv import load_dotenv
from routes.api.steam.steam import steam_bp
from routes.api.leetify.leetify import leetify_bp
from routes.api.faceit.faceit import faceit_bp
from routes.api.match.match import match_bp
from routes.redeploy.redeploy import redeploy_bp

load_dotenv()
app = Flask(__name__)
app.register_blueprint(steam_bp, url_prefix="/api/steam")
app.register_blueprint(leetify_bp, url_prefix="/api/leetify")
app.register_blueprint(faceit_bp, url_prefix="/api/faceit")
app.register_blueprint(match_bp, url_prefix="/api/match")
app.register_blueprint(redeploy_bp, url_prefix="/")
CORS(app, origins=["http://localhost:5173", "https://www.steamcommunity.win", "https://steamcommunity.win"])

if __name__ == "__main__":
    app.run(debug=True)