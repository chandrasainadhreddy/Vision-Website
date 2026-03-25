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
    
    cur.execute("SELECT id, status, completed_at FROM tests ORDER BY id DESC LIMIT 5;")
    rows = cur.fetchall()
    print("--- Recent Tests ---")
    for row in rows:
        print(row)
        
    cur.execute("SELECT test_id FROM eye_data ORDER BY test_id DESC LIMIT 1;")
    last_eye = cur.fetchone()
    print(f"\nLast test_id with eye data: {last_eye}")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
