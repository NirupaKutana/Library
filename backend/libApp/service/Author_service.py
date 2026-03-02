from django.db import connection
# ---------------------------------------Authors-------------------------------------------------------------
def get_all_author():
    with connection.cursor() as cursor :
        cursor.execute( "select * from get_all_author_detail()" )
        data = cursor.fetchall()
        return data
    
def post_update_author(p_action,a_id,a_name):
    with connection.cursor() as cursor :
        cursor.execute("select * from post_update_author(%s,%s,%s)",[p_action,a_id,a_name])

def delete_author(a_id):
    with connection.cursor() as cursor:
        cursor.execute("select * from delete_author_detail(%s)",[a_id])