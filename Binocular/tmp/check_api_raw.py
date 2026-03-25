import requests
import json

base_url = "http://127.0.0.1:5000"

def check_dash(uid):
    try:
        r = requests.get(f"{base_url}/home_dashboard?user_id={uid}")
        print(f"RAW User {uid}: {r.text}")
    except Exception as e:
        print(f"Error {uid}: {e}")

check_dash(26)
check_dash(28)
check_dash(34)
