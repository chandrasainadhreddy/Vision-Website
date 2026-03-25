import requests
try:
    res = requests.get("http://127.0.0.1:5000/profile?user_id=1")
    print(res.status_code)
    print(res.json())
except Exception as e:
    print(e)
