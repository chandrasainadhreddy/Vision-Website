import pymysql
import requests

BASE_URL = "http://127.0.0.1:5000"

def get_db():
    return pymysql.connect(
        host="127.0.0.1", user="root", password="",
        database="binoculardb", cursorclass=pymysql.cursors.DictCursor
    )

print("STEP 1 - DB CHECK")
conn = get_db()
cur = conn.cursor()
for table in ["users", "tests", "eye_data", "results"]:
    cur.execute(f"SELECT COUNT(*) as c FROM {table}")
    print(f"  {table}: {cur.fetchone()['c']} rows")
cur.execute("SELECT id FROM users LIMIT 1")
user = cur.fetchone()
user_id = user["id"]
print(f"  user_id={user_id}")
conn.close()

print("\nSTEP 2 - FLASK ROOT")
r = requests.get(BASE_URL, timeout=3)
print(r.status_code, r.json())

print("\nSTEP 3 - START TEST")
r = requests.post(f"{BASE_URL}/start_test", json={"user_id": user_id, "test_type": "RAN"}, timeout=5)
print(r.status_code, r.json())
test_id = r.json().get("test_id")

print(f"\nSTEP 4 - UPLOAD EYE DATA (test_id={test_id})")
samples = [{"n": i, "x": 50.0+i, "y": 50.0, "lx": 100.0+i, "ly": 200.0, "rx": 400.0+i, "ry": 200.0} for i in range(30)]
r = requests.post(f"{BASE_URL}/upload_eye_data", json={"test_id": test_id, "samples": samples}, timeout=5)
print(r.status_code, r.json())

print(f"\nSTEP 5 - RUN AI (test_id={test_id})")
r = requests.post(f"{BASE_URL}/run_ai", json={"test_id": test_id}, timeout=15)
print(r.status_code, r.json())

print(f"\nSTEP 6 - GET RESULT (test_id={test_id})")
r = requests.get(f"{BASE_URL}/get_result?test_id={test_id}", timeout=5)
print(r.status_code, r.json())
