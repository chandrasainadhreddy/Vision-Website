import MySQLdb
import MySQLdb.cursors

try:
    db = MySQLdb.connect(
        host="localhost",
        user="root",
        passwd="",
        db="binoculardb",
        cursorclass=MySQLdb.cursors.DictCursor
    )
    cur = db.cursor()
    cur.execute("SELECT id, user_id, test_type, status FROM tests")
    rows = cur.fetchall()
    print("Tests in DB:")
    for row in rows:
        print(row)
    db.close()
except Exception as e:
    print(f"Error: {e}")
