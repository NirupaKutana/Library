import psycopg2

try:
    source_conn = psycopg2.connect(
        dbname = 'library_managment',
        user='postgres',
        password='Nirupa@123',
        host='localhost',
        port='5432'
    )
    target_conn = psycopg2.connect(
        dbname = 'migrate_db',
        user='postgres',
        password='Nirupa@123',
        host='localhost',
        port='5432'
    )

    source_cursor = source_conn.cursor()
    target_cursor = target_conn.cursor()
    print("connected both database")

    source_cursor.execute("""
      select user_name,user_email,user_password,is_active from tbl_users
      """)
    rows = source_cursor.fetchall()
    print(f"total record :{len(rows)}")

    for row in rows:
        user_name,user_email,user_password,is_active=row
        target_cursor.execute("""
         insert into tbl_users(name,email,password,is_active) values(%s,%s,%s,%s)
        """,(user_name,user_email,user_password,is_active))

    target_conn.commit()
    print("✅ Data migrated successfully!")

except Exception as e :
    print("error:",e)

finally:
    if source_cursor:
        source_cursor.close()
    if target_cursor:
        target_cursor.close()
    if source_conn:
        source_conn.close()
    if target_conn:
        target_conn.close()
    print("🔒 Connections closed")

