import requests
try:
    res = requests.post("http://127.0.0.1:5000/upload_profile_image", data={"user_id": 1})
    print(res.status_code)
    print(res.text)
except Exception as e:
    print(e)
