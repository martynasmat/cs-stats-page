def get_cs2_rating_tier(rating: int) -> int:
    return min((rating // 5000) + 1, 7)