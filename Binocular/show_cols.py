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
    
    for table in ["tests", "eye_data", "results"]:
        print(f"\n--- {table} Table Columns ---")
        try:
            cur.execute(f"SHOW COLUMNS FROM {table};")
            cols = cur.fetchall()
            for col in cols:
                print(f"{col['Field']} ({col['Type']})")
        except Exception as e:
            print(f"Error checking {table}: {e}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")

