# ---------------------------------------Images-------------------------------------------------------------
from django.db import connection
def get_image():
    with connection.cursor() as cursor:
        cursor.execute("select* from get_image()")
        data=cursor.fetchall()
        return data

def post_image(file,name):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_image(%s,%s)",[file,name])

def delete_image(id):
    with connection.cursor() as cursor:
        cursor.execute("select * from delete_image(%s)",[id])

def image_pagination(p_page,p_page_size):
       with connection.cursor() as cursor :
           cursor.execute("select * from get_image_pagination(%s,%s)",[p_page,p_page_size])
           data = cursor.fetchall()
       return(data)