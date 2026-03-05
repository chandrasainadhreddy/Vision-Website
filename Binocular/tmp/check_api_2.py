import requests
import json

base_url = "http://127.0.0.1:5000"

def check_dash(uid):
    try:
        r = requests.get(f"{base_url}/home_dashboard?user_id={uid}")
        data = r.json()
        print(f"User {uid} Total: {data.get('total_tests')} Tests: {len(data.get('recent_tests', []))}")
    except Exception as e:
        print(f"Error {uid}: {e}")

check_dash(26)
check_dash(28)
check_dash(34)
