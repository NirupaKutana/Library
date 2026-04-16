from django.db import connection


def get_membership_plans():  
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM tbl_membership_plans WHERE is_active = true")
        data = cursor.fetchall()
        return data 
    
# def post_membership_pans():  
#     with connection.cursor() as cursor:
#         cursor.execute("SELECT * FROM tbl_membership_plans WHERE is_active = true")
#         data = cursor.fetchall()
#         return data 

def expire_plan():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM sp_expire_memberships()")
        data = cursor.fetchall()
        return data 

def buy_membership(user_id,plan_id):
    with connection.cursor() as cursor :
        cursor.execute("SELECT sp_create_membership(%s, %s)", [user_id, plan_id])
        result = cursor.fetchone()
        return result
    
def get_user_membership(user_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM sp_get_active_membership(%s)", [user_id])
        data = cursor.fetchall()
        return data
