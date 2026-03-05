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
    print(f"--- Investigating results for Test #{test_id} ---")
    
    cur.execute("SELECT * FROM results WHERE test_id=%s", (test_id,))
    row = cur.fetchone()
    if row:
        print("FOUND RESULT:")
        print(row)
    else:
        print("NOT FOUND IN RESULTS TABLE")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
