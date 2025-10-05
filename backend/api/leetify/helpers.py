CS2_RATINGS = {
    0: 1,
    5000: 2,
    10000: 3,
    15000: 4,
    20000: 5,
    25000: 6,
    30000: 7,
}

def get_cs2_rating_tier(rating: int) -> int:
    tier = 0

    for key in CS2_RATINGS:
        if rating >= key:
            tier = CS2_RATINGS[key]
        else:
            break

    return tier