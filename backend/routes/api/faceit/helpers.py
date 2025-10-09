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

def get_faceit_level(elo: int) -> str:
    peak_lvl = ""
    if elo != 0:
        for key in FACEIT_LEVELS:
            if elo >= key:
                peak_lvl = FACEIT_LEVELS[key]
            else:
                break
    return peak_lvl

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
        "best_map": max(maps_winrate, key=maps_winrate.get), # type: ignore
        "best_map_winrate": round(maps_winrate[max(maps_winrate, key=maps_winrate.get)] * 100, 2), # type: ignore
        "worst_map": min(maps_winrate, key=maps_winrate.get), # type: ignore
        "worst_map_winrate": round(maps_winrate[min(maps_winrate, key=maps_winrate.get)] * 100, 2), # type: ignore
    }