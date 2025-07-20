from datetime import datetime 
from flask import Flask

def format_datetime(unix: int) -> str:
    if not unix:
        return ""
    else:
        return datetime.fromtimestamp(unix).strftime("%B %d, %Y")

def init_filters(app: Flask):
    app.add_template_filter(format_datetime, name="datetimeformat")