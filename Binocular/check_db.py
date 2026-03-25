import pymysql

def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="binoculardb",
        cursorclass=pymysql.cursors.DictCursor
    )

try:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DESCRIBE results;")
    rows = cur.fetchall()
    print("--- Results Table Schema ---")
    for row in rows:
        print(row)
    
    cur.execute("SELECT COUNT(*) as count FROM results;")
    count = cur.fetchone()["count"]
    print(f"\nTotal rows in results: {count}")
    
    cur.execute("SELECT test_id FROM results ORDER BY test_id DESC LIMIT 5;")
    recent = cur.fetchall()
    print("\nRecent test_ids in results:")
    for r in recent:
        print(r)
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
