import pymysql

try:
    conn = pymysql.connect(
        host='localhost', 
        user='root', 
        password='', 
        database='binoculardb'
    )
    cur = conn.cursor(pymysql.cursors.DictCursor)
    
    # Check total users
    cur.execute("SELECT id, name, email FROM users")
    users = cur.fetchall()
    print("--- USERS ---")
    for u in users:
        print(f"ID: {u['id']} | Name: {u['name']} | Email: {u['email']}")
    
    # Check tests for each user
    print("\n--- TEST COUNTS ---")
    for u in users:
        cur.execute("SELECT status, COUNT(*) as count FROM tests WHERE user_id=%s GROUP BY status", (u['id'],))
        counts = cur.fetchall()
        print(f"User {u['id']} ({u['name']}): {counts}")

    # Check eye data samples
    cur.execute("SELECT test_id, COUNT(*) as samples FROM eye_data GROUP BY test_id LIMIT 10")
    samples = cur.fetchall()
    print("\n--- EYE DATA SAMPLES (First 10) ---")
    print(samples)

    conn.close()
except Exception as e:
    print(f"Error: {e}")
