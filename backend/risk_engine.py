def calculate_risk(score):
    if score > 80:
        return "HIGH"
    elif score > 40:
        return "MEDIUM"
    else:
        return "LOW"
