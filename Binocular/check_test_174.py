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
    
    test_id = 174
    print(f"--- Investigating Test #{test_id} ---")
    
    cur.execute("SELECT * FROM tests WHERE id=%s", (test_id,))
    test = cur.fetchone()
    print(f"Test Status: {test}")
    
    cur.execute("SELECT COUNT(*) as data_count FROM eye_data WHERE test_id=%s", (test_id,))
    data_count = cur.fetchone()["data_count"]
    print(f"Eye Data Points: {data_count}")
    
    cur.execute("SELECT * FROM results WHERE test_id=%s", (test_id,))
    result = cur.fetchone()
    print(f"Result Entry: {result}")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
