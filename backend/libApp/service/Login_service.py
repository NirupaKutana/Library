from django.db import connection
# ---------------------------------------Users-------------------------------------------------------------
def edit_profilr(id,name):
    with connection.cursor() as cursor :
        cursor.execute("select * from edit_profile_detail(%s,%s)",[id,name])
        return cursor.fetchone()

def post_user(u_name,u_email,u_pass,u_role,p_token):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_user_detail(%s,%s,%s,%s,%s)",[u_name,u_email,u_pass,u_role,p_token])
        data = cursor.fetchone()
        return {
            "user_id":data[0],
            "email":data[1]
        }
    
def post_Librarian(u_name,u_email,u_pass,u_role,p_token):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_librarian_detail(%s,%s,%s,%s,%s)",[u_name,u_email,u_pass,u_role,p_token])
        data = cursor.fetchone()
        return {
            "user_id":data[0],
            "email":data[1]
        }

def get_librarian():
    with connection.cursor() as cursor:
        cursor.execute("select * from get_librarian()")
        result = cursor.fetchall()
        return result

def update_librarian(id,u_name,u_email):
    with connection.cursor() as cursor:
        cursor.execute("select * from update_librarian_detail(%s,%s,%s)",[id,u_name,u_email])

def delete_librarian(id):
    with connection.cursor() as cursor :
        cursor.execute("select * from delete_librarian(%s)",[id])

def insert_user_role(u_id,r_id):
    with connection.cursor() as cursor :
        cursor.execute("select * from insert_user_role(%s,%s)",[u_id,r_id])

def get_users():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_users_detail()")
        data = cursor.fetchall()
        return data

def get_user(id):
     with connection.cursor() as cursor :
        cursor.execute( "SELECT * FROM tbl_users where user_id = (%s)",[id])
        data = cursor.fetchone()
        return data

def get_user_by_token(p_token):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_user_by_token(%s)",[p_token])
        data = cursor.fetchone()
        return {
            "user_name" :data[0],
             "is_active":data[1]
        }

def get_user_by_email(email):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * from get_user_by_email(%s)",[email])
        data = cursor.fetchone()
        if data:
            return {
                "user_id": data[0],
                "user_name": data[1],
                "user_email": data[2],
                "role": data[3],
                "is_active": data[4],
            }
        return None

def verify_user_email(token):
    with connection.cursor() as cursor:
        cursor.execute("SELECT verify_user_email(%s)",[token]) 

def update_unverified_user(p_name,p_email,role,p_token):
     with connection.cursor() as cursor:
        cursor.execute("SELECT * from update_unverified_user(%s,%s,%s,%s)",[p_name,p_email,role,p_token])
        data= cursor.fetchone()
        if not data:
            return None 
        return {
            "user_id": data[0],
            "user_name": data[1],
            "user_email": data[2]
            }
     
# ---------------------------------------Login-------------------------------------------------------------
def custom_user_login(email,passw):
    with connection.cursor() as cursor :
        # cursor.execute("select * from user_login_sp(%s,%s)",[email,passw])
        cursor.execute("select * from custom_login(%s,%s)",[email,passw])
        user =cursor.fetchone()
        
        if not user:
            return None
        return {
            "status":user[0],
            "o_flage":user[1],
            "user_id":user[2],
            "user_name":user[3],
            "user_email":user[4],
            "user_password":user[5],
            "role":user[6],
            "count":user[7],
            "duration":user[8],
            "roles":user[9],
            "permissions":user[10]

        }

def user_login(email):
    with connection.cursor() as cursor :
        cursor.execute("select * from login_user(%s)",[email])
        user = cursor.fetchone()
        if not user:
            return None
        
        return {
                "user_id":user[0],
                "user_name":user[1],
                "user_email":user[2],
                "user_password":user[3],
                "count":user[4],
                "duration":user[5]
              }

def update_count(email,count):
    with connection.cursor() as cursor:
        cursor.execute("select * from update_count(%s,%s)",[email,count])

def update_duration(email,duration):
    with connection.cursor() as cursor :
        cursor.execute("select *  from update_duration(%s,%s)",[email,duration])

# ------------------------------------forgot-----------------------------
def check_mail(email):
    with connection.cursor() as cursor :
        cursor.execute("select user_email from tbl_users where user_email = %s",[email])
        email = cursor.fetchone()
        return email

def update_password(email,passw):
    with connection.cursor() as cursor:
        cursor.execute("update tbl_users set user_password = (%s) where user_email = (%s)",[passw,email])


# ---------------------------------------Contact Us-------------------------------------------------------------
def post_contactUs(cname,cemail,cmsg):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_contact_us(%s,%s,%s)",[cname,cemail,cmsg])