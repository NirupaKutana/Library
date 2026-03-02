from django.db import connection
# ---------------------------------------Categories-------------------------------------------------------------
def get_all_category():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_all_category_detail()" )
        data = cursor.fetchall()
        return data
    
def post_update_category(p_action,c_id,c_name):
     with connection.cursor() as cursor :
         cursor.execute("select * from post_update_category(%s,%s,%s)",[p_action,c_id,c_name])

def delete_category(c_id):
    with connection.cursor() as cursor :
        cursor.execute("select * from delete_category_detail(%s)",[c_id])

def cat_search(name):
    with connection.cursor() as cursor:
        cursor.execute("select * from search_cat(%s)",[name])
        data=cursor.fetchall()
        return data