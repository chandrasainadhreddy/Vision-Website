import mysql.connector

try:
    conn = mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='binoculardb'
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, profile_image FROM users")
    users = cursor.fetchall()
    for user in users:
        print(user)
except Exception as e:
    print(e)
