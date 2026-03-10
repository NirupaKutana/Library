from django.db import connection

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

def get_filter_audit(sdate,edate,user,act):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_filter_audit(%s,%s,%s,%s)",[sdate,edate,user,act])
        data = cursor.fetchall()
    return data

def get_user_audit(email):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_user_audit(%s)",[email])
        data= cursor.fetchall()
        return data


# ---------------------------------------LOGIN AUDIT-------------------------------------------------------------

def get_login_audit():
    with connection.cursor() as cursor :
        cursor.execute("select * from get_login_audit()")
        data= cursor.fetchall()
        return data
    
def insert_login_audit(email,user_id,activity_type,status):
    with connection.cursor() as cursor :
        cursor.execute("select * from insert_login_audit(%s,%s,%s,%s)",[email,user_id,activity_type,status])

def get_Search_user_audit(name):
    with connection.cursor() as cursor :
        cursor.execute("select * from get_search_user_audit(%s)",[name])
        data= cursor.fetchall()
        return data