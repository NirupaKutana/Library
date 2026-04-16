from django.db import connection

def read_file():
    with connection.cursor() as cursor :
        cursor.execute("select * from  sp_read_file()")
        data = cursor.fetchall()
        return data
    
def read_one_file(p_id):
    with connection.cursor() as cursor :
        cursor.execute("select * from sp_read_one_file(%s)",[p_id])   
        data = cursor.fetchone()
        return data 
     
def post_file(p_name,p_image,p_pdf):
    with connection.cursor() as cursor :
        cursor.execute("select * from sp_create_file(%s,%s,%s)",[p_name,p_image,p_pdf])
        data = cursor.fetchone()
        return data
        
def put_file(p_id,p_name,p_image,p_pdf):
    with connection.cursor() as cursor :
        cursor.execute("select * from sp_update_file(%s,%s,%s,%s)",[p_id,p_name,p_image,p_pdf])
        data = cursor.fetchone()
        return data
    
def del_file(p_id):
    with connection.cursor() as cursor :
        cursor.execute("select * from sp_delete_file(%s)",[p_id])
        data = cursor.fetchone()
        return data