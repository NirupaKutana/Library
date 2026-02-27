from django.db import connection

# ---------------------------------------Users-------------------------------------------------------------
def post_user(u_name,u_email,u_pass,u_role,p_token):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_user_detail(%s,%s,%s,%s,%s)",[u_name,u_email,u_pass,u_role,p_token])
        data = cursor.fetchone()
        return {
            "user_id":data[0],
            "email":data[1]
        }

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
  
def verify_user_email(token):
    with connection.cursor() as cursor:
        cursor.execute("SELECT verify_user_email(%s)",[token])  

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
     
     

    # with connection.cursor() as cursor :
    #     cursor.execute("select * from get_user_data(%s)",[u_id])
    #     data=cursor.fetchall()
    #     return data

# ------------------------------------forgot-----------------------------
def check_mail(email):
    with connection.cursor() as cursor :
        cursor.execute("select user_email from tbl_users where user_email = %s",[email])
        email = cursor.fetchone()
        return email

def update_password(email,passw):
    with connection.cursor() as cursor:
        cursor.execute("update tbl_users set user_password = (%s) where user_email = (%s)",[passw,email])
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
            "duration":user[8]

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
# ---------------------------------------ISSUE BOOK-------------------------------------------------------------
def get_available_qty(b_id):
    with connection.cursor() as cursor:
        cursor.execute("select avl_qty from tbl_books where book_id =(%s)",[b_id])
        qty = cursor.fetchone()
        return qty

def post_book_issue(user_id,book_id,issuedate,due_date):
    with connection.cursor() as cursor:
        cursor.execute("INSERT INTO tbl_book_issue (user_id, book_id,issue_date,due_date)VALUES (%s, %s, %s,%s)",
                       [user_id,book_id,issuedate ,due_date])

def update_qty(b_id):
    with connection.cursor() as cursor :
        cursor.execute("UPDATE tbl_books SET avl_qty = avl_qty - 1 WHERE book_id =(%s)",[b_id])        

def check_overdue (p_id):
     with connection.cursor() as cursor :
        cursor.execute("SELECT * from check_user_overdue(%s)", [p_id])
        result = cursor.fetchone()
        return result[0] if result else False    

def get_all_issue_book_detail():
    with connection.cursor() as cursor:
        cursor.execute("select * from get_issue_book_detail()")
        data = cursor.fetchall()
        return data

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

# ---------------------------------------Images-------------------------------------------------------------
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

# ---------------------------------------Contact Us-------------------------------------------------------------
def post_contactUs(cname,cemail,cmsg):
    with connection.cursor() as cursor:
        cursor.execute("select * from post_contact_us(%s,%s,%s)",[cname,cemail,cmsg])

# ---------------------------------------CHartss-------------------------------------------------------------
def get_datafor_chart ():
    with connection.cursor() as cursor :
        cursor.execute("select * from send_copy_available_qty_count()")
        copy_avl = cursor.fetchone()
  
        cursor.execute("select * from send_isuue_return_book_count()")
        issue_return = cursor.fetchone()

        return{
            "copy":copy_avl[0],
            "avl_qty":copy_avl[1],
            "issue" :issue_return[0],
            "return":issue_return[1]
        }

# ---------------------------------------XLSX Report-------------------------------------------------------------
def get_user_report(id):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_user_report(%s)",[id])
        data = cursor.fetchall()
        return data

# ---------------------------------------AUDIT LOGS-------------------------------------------------------------
def get_audit_log():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_audit_log()")
        data = cursor.fetchall()
        return data
    
def insert_audit_log(user_id,action,module,description):
    with connection.cursor() as cursor:
        cursor.execute("select * from insert_audit_log(%s,%s,%s,%s)",[user_id,action,module,description])

def get_login_audit():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_login_audit()")
        data= cursor.fetchall()
        return data
    
def get_user_audit(email):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_user_audit(%s)",[email])
        data= cursor.fetchall()
        return data

def get_Search_user_audit(name):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_search_user_audit(%s)",[name])
        data= cursor.fetchall()
        return data

def insert_login_audit(email,user_id,activity_type,status):
    with connection.cursor() as cursor :
        cursor.execute("select * from insert_login_audit(%s,%s,%s,%s)",[email,user_id,activity_type,status])

def get_filter_audit(sdate,edate,user,act):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_filter_audit(%s,%s,%s,%s)",[sdate,edate,user,act])
        data = cursor.fetchall()
    return data