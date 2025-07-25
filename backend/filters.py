from datetime import datetime 
from flask import Flask

def format_datetime(unix: int) -> str:
    if not unix:
        return ""
    else:
        return datetime.fromtimestamp(unix).strftime("%B %d, %Y")

def format_iso_datetime(iso_string: str) -> str:
    if not iso_string:
        return ""

    try:
        cleaned = iso_string.replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        return dt.strftime("%B %d, %Y")
    except (ValueError, TypeError):
        return ""

def init_filters(app: Flask):
    app.add_template_filter(format_datetime, name="datetimeformat")
    app.add_template_filter(format_iso_datetime, name="formatisodate")