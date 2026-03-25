import pymysql
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def get_db():
    return pymysql.connect(
        host="127.0.0.1", user="root", password="",
        database="binoculardb", cursorclass=pymysql.cursors.DictCursor
    )

print("=" * 60)
print("FULL TEST FLOW DIAGNOSTIC")
print("=" * 60)

# 1. Check DB tables
print("\n[1] DB TABLE CHECK")
try:
    conn = get_db()
    cur = conn.cursor()
    for table in ["users", "tests", "eye_data", "results"]:
        cur.execute(f"SELECT COUNT(*) as c FROM {table}")
        ct = cur.fetchone()["c"]
        print(f"  {table}: {ct} rows")
    
    # Find a user
    cur.execute("SELECT id, name, email FROM users LIMIT 1")
    user = cur.fetchone()
    print(f"\n  Sample user: {user}")
    
    # Find recent test
    cur.execute("SELECT * FROM tests ORDER BY id DESC LIMIT 3")
    tests = cur.fetchall()
    print(f"\n  Recent tests:")
    for t in tests:
        print(f"    {t}")
    
    conn.close()
except Exception as e:
    print(f"  DB ERROR: {e}")

# 2. Check Flask is running
print("\n[2] FLASK API CHECK")
try:
    r = requests.get(f"{BASE_URL}/", timeout=3)
    print(f"  Flask is running: {r.json()}")
except Exception as e:
    print(f"  Flask ERROR: {e}")

# 3. Test start_test
print("\n[3] START_TEST API CHECK")
try:
    # Get a valid user_id
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM users LIMIT 1")
    u = cur.fetchone()
    conn.close()
    
    if u:
        user_id = u["id"]
        print(f"  Using user_id: {user_id}")
        
        r = requests.post(f"{BASE_URL}/start_test", json={
            "user_id": user_id,
            "test_type": "RAN"
        }, timeout=5)
        data = r.json()
        print(f"  Response: {data}")
        
        test_id = data.get("test_id")
        
        if test_id:
            # 4. Test upload eye data
            print(f"\n[4] UPLOAD_EYE_DATA CHECK (test_id={test_id})")
            samples = [
                {"n": i, "x": 50 + i, "y": 50, "lx": 100+i, "ly": 200, "rx": 400+i, "ry": 200}
                for i in range(10)
            ]
            r2 = requests.post(f"{BASE_URL}/upload_eye_data", json={
                "test_id": test_id,
                "samples": samples
            }, timeout=5)
            print(f"  Response: {r2.json()}")
            
            # 5. Test run_ai
            print(f"\n[5] RUN_AI CHECK (test_id={test_id})")
            r3 = requests.post(f"{BASE_URL}/run_ai", json={"test_id": test_id}, timeout=15)
            print(f"  Status code: {r3.status_code}")
            print(f"  Response: {r3.json()}")
            
            # 6. Test get_result
            print(f"\n[6] GET_RESULT CHECK (test_id={test_id})")
            r4 = requests.get(f"{BASE_URL}/get_result?test_id={test_id}", timeout=5)
            print(f"  Status code: {r4.status_code}")
            print(f"  Response: {r4.json()}")
        else:
            print("  Could not get test_id to continue!")
except Exception as e:
    print(f"  API ERROR: {e}")

print("\n" + "=" * 60)
print("DIAGNOSTIC COMPLETE")
print("=" * 60)
