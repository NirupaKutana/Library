from django.db import connection

def post_role(p_name,des):
    with connection.cursor() as cursor :
       cursor.execute("select * from post_role(%s,%s)",[p_name,des])

def get_role():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_role()")
        data = cursor.fetchall()
        return data

def post_rights(p_name,des):
    with connection.cursor() as cursor :
        cursor.execute("select * from post_rights(%s,%s)",[p_name,des])

def get_rights():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_rights()")
        result = cursor.fetchall()
        return result

def update_right(r_id,r_name,des):
    with connection.cursor() as cursor :
        cursor.execute("select * from update_right(%s,%s,%s)",[r_id,r_name,des])

def delete_right(id):
    with connection.cursor() as cursor:
        cursor.execute("select * from delete_right(%s)",[id]) 

def insert_role_rights(r_id,p_id):
    with connection.cursor() as cursor :
        cursor.execute("select  * from insert_role_permission(%s,%s)",[r_id,p_id])

def get_role_rights(id):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_role_rights(%s)",[id])
        data = cursor.fetchall()
        return data

def grant_remove_rights(id):
    with connection.cursor() as cursor:
        cursor.execute("select grant_remove_rights(%s)",[id])