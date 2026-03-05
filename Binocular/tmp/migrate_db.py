import pymysql

try:
    conn = pymysql.connect(
        host='localhost', 
        user='root', 
        password='', 
        database='binoculardb'
    )
    cur = conn.cursor()
    
    # 1. Add completed_at to tests
    try:
        cur.execute("ALTER TABLE tests ADD COLUMN completed_at DATETIME AFTER total_samples")
        print("✅ Added completed_at to tests")
    except Exception as e:
        print(f"ℹ️  completed_at check: {e}")
        
    # 2. Add columns to results
    cols = [
        ("percentage", "DOUBLE AFTER score"),
        ("stability", "DOUBLE DEFAULT 0 AFTER percentage"),
        ("tracking", "DOUBLE DEFAULT 0 AFTER stability"),
        ("reaction", "DOUBLE DEFAULT 0 AFTER tracking"),
        ("accuracy", "DOUBLE DEFAULT 0 AFTER reaction")
    ]
    
    for col, spec in cols:
        try:
            cur.execute(f"ALTER TABLE results ADD COLUMN {col} {spec}")
            print(f"✅ Added {col} to results")
        except Exception as e:
            print(f"ℹ️  {col} check: {e}")

    conn.commit()
    conn.close()
    print("🚀 Migration Complete")
except Exception as global_e:
    print(f"❌ Global Error: {global_e}")
