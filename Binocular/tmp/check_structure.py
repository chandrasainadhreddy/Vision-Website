import pymysql

try:
    conn = pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="binoculardb",
        cursorclass=pymysql.cursors.DictCursor
    )
    cur = conn.cursor()
    
    print("Listing all tables:")
    cur.execute("SHOW TABLES")
    tables = cur.fetchall()
    print(tables)
    
    for table_dict in tables:
        table_name = list(table_dict.values())[0]
        print(f"\nStructure of {table_name}:")
        cur.execute(f"DESCRIBE {table_name}")
        print(cur.fetchall())
        
    print("\nChecking for tables containing 'upload'...")
    cur.execute("SHOW TABLES LIKE '%upload%'")
    print(cur.fetchall())
    
    try:
        print("\nChecking if 'upload' table exists...")
        cur.execute("DESCRIBE upload")
        print("Structure of upload:")
        print(cur.fetchall())
    except Exception as e:
        print(f"Error checking 'upload' table: {e}")

    conn.close()
except Exception as e:
    print(f"Main Error: {e}")
