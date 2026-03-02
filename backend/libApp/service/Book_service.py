from django.db import connection
# ---------------------------------------Books-------------------------------------------------------------
def get_all_books():
    with connection.cursor() as cursor :
        cursor.execute( "select * from get_all_books_detail()" )
        data=cursor.fetchall()
        return data
    
def post_update_book(p_action,b_id,b_name,c_id,a_id,page,copy,up_by,up_r):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_update_book(%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                       [p_action,b_id,b_name,c_id,a_id,page,copy,up_by,up_r])
        data =cursor.fetchone()
        return data

def delete_book(b_id):
    with connection.cursor() as cursor:
        cursor.execute("select * from delete_book_detail(%s)",[b_id])

def search_book(b_name):
    with connection.cursor() as cursor:
        cursor.execute("select * from search_book(%s)",[b_name])
        data=cursor.fetchall()
    return data