from django.db import connection
# ---------------------------------------ISSUE BOOK-------------------------------------------------------------
def get_user_active_book_count(user_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COUNT(*) FROM tbl_book_issue
            WHERE user_id = %s AND return_date IS NULL
        """, [user_id])
        return cursor.fetchone()[0]
    
def get_all_issue_book_detail():
    with connection.cursor() as cursor:
        cursor.execute("select * from get_issue_book_detail()")
        data = cursor.fetchall()
        return data
    
def check_overdue (p_id):
     with connection.cursor() as cursor :
        cursor.execute("SELECT * from check_user_overdue(%s)", [p_id])
        result = cursor.fetchone()
        return result[0] if result else False 
    
def get_available_qty(b_id):
    with connection.cursor() as cursor:
        cursor.execute("select avl_qty from tbl_books where book_id =(%s)",[b_id])
        qty = cursor.fetchone()
        return qty
    
def update_qty(b_id):
    with connection.cursor() as cursor :
        cursor.execute("UPDATE tbl_books SET avl_qty = avl_qty - 1 WHERE book_id =(%s)",[b_id]) 

def post_book_issue(user_id,book_id,issuedate,due_date):
    with connection.cursor() as cursor:
        cursor.execute("INSERT INTO tbl_book_issue (user_id, book_id,issue_date,due_date)VALUES (%s, %s, %s,%s)",
                       [user_id,book_id,issuedate ,due_date])
        
def get_issue_user_detail(id):
    with connection.cursor() as cursor:
        cursor.execute("select * from get_issue_user_detail(%s)",[id])
        data = cursor.fetchall()
        return data
    
def get_issue_search(u_name):
    with connection.cursor() as cursor:
        cursor.execute("select * from get_serach_issue_book(%s)",[u_name])
        data=cursor.fetchall()
        return data

def get_overdue_list():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_overdue_list()")
        data = cursor.fetchall()
        return data
    
def send_overdue_mail():
    with connection.cursor() as cursor :
        cursor.execute("select * from send_overdue_mail()")
        data = cursor.fetchall()
        return data
    
# ---------------------------------------RETERN BOOK-------------------------------------------------------------

def get_book_id_to_return(issue_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT book_id FROM tbl_book_issue WHERE issue_id = (%s) AND status='ISSUED'", [issue_id])
        id = cursor.fetchone()
        return id

def update_book_issue(issue_id):
    with connection.cursor() as cursor:
        cursor.execute("UPDATE tbl_book_issue SET status='RETURNED', return_date=NOW() WHERE issue_id= (%s)", [issue_id])

def update_book_return(book_id):
    with connection.cursor() as cursor:
        cursor.execute("UPDATE tbl_books SET avl_qty = avl_qty + 1 WHERE book_id=(%s)", [book_id])