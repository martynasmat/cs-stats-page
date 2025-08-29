CS2_RATINGS = {
    0: "tier1",
    5000: "tier2",
    10000: "tier3",
    15000: "tier4",
    20000: "tier5",
    25000: "tier6",
    30000: "tier7",
}

def get_cs2_rating_tier(rating: int) -> str:
    tier = ""

    for key in CS2_RATINGS:
        if rating >= key:
            tier = CS2_RATINGS[key]
        else:
            break

    return tier