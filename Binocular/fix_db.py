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
    
    print("Checking results table Primary Key...")
    cur.execute("DESCRIBE results;")
    schema = cur.fetchall()
    
    needs_auto = True
    for col in schema:
        if col['Field'] == 'result_id' and 'auto_increment' in col['Extra'].lower():
            needs_auto = False
            break
            
    if needs_auto:
        print("Alterting results table to make result_id AUTO_INCREMENT...")
        # Note: We need to be careful with existing data
        cur.execute("ALTER TABLE results MODIFY COLUMN result_id INT AUTO_INCREMENT;")
        conn.commit()
        print("Success!")
    else:
        print("result_id is already AUTO_INCREMENT.")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
