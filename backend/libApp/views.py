import os
import jwt
import uuid
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.core.mail import send_mail
from django.core.cache import cache
from django.shortcuts import redirect
from datetime import datetime
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from openpyxl import Workbook
from datetime import datetime
from django.http import HttpResponse
from django.contrib.auth.hashers import check_password ,make_password
from libApp.utils import jwt_utils
from libApp import db_model
from libApp.utils.jwt_utils import generate_access_token,generate_refresh_token ,JWT_Required ,decode_token
from libApp.utils.jwt_utils import admin_reqired
# from .middlewares.jwt_middleware import JWTAuthenticationMiddleware
from .serialize import BooksSerializer,CategorySerializer,AuthorSerializer
from .serialize import UserSerializer,ImageSerializer ,LoginSerializer ,ContactSerializer
from django.http import JsonResponse
from reportlab.platypus import SimpleDocTemplate , Table,TableStyle,Paragraph ,Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from rest_framework.permissions import AllowAny
from reportlab.lib.units import inch


def test_api(request):
    return JsonResponse({"massage":"You are allowed !"})
# ---------------------------------------Users-------------------------------------------------------------
class getUsersListView(APIView):
    def get(self,request):
        data = db_model.get_users()
        if not data :
            return Response({"error": "User not found"}, status=404)
        return Response(data,status=status.HTTP_200_OK)

class RegisterListView(APIView):
    def get(self ,request,id):
        data=db_model.get_user(id)
        if not data:
            return Response({"error": "User not found"}, status=404)
        return Response({
            "user_id":data[0],
            "user_name":data[1],
            "user_email":data[2]
        })
    
    def post(self,request,id =None) :
        serial=UserSerializer(data=request.data)
        if not serial.is_valid():
            return Response(serial.errors, status=400)
        
        role ='USER'
        passw = serial.validated_data["user_password"]
        hash_pass = make_password(passw)
        data=serial.validated_data 
        token = str(uuid.uuid4())  
        if not data["user_name"] or not data["user_email"] or not passw:
            return Response({"error": "All fields required"})
        
        is_exist = db_model.get_user_by_email(data["user_email"])
        if is_exist and is_exist["is_active"]:
            return Response({"error": "Email already registered"},status=400)
        
        if is_exist and not is_exist["is_active"]:
            user=db_model.update_unverified_user(data["user_name"],data["user_email"],role,token)
            email = user["user_email"]

        if not is_exist:
            user=db_model.post_user(data["user_name"],data["user_email"],hash_pass,role,token)
            email = user["email"]
            db_model.insert_login_audit(data["user_email"],user["user_id"],"REGISTATION", "REGISTER SUCCESSFULLY")
        
        verify_link = f"http://127.0.0.1:8000/verify-email/{token}/"
        send_mail(
            subject="Verify Your Email",
            message=f"Click this link to verify your email:\n{verify_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"Detail":"Registration successfully!"},status=status.HTTP_200_OK)

class VerifyEmailview(APIView):
    def get(self,request,token):
        user = db_model.get_user_by_token(token)
        if not user:
            return Response({"error": "Invalid token"}, status=400)
        
        db_model.verify_user_email(token)
        return Response({"message": "Email verified successfully"})
    
class CheckVerificationView(APIView):
    def post(self, request):
        email = request.data.get("email")

        user = db_model.get_user_by_email(email)

        if not user:
            return Response({"error": "User not found"}, status=404)

        return Response({
            "is_active": user["is_active"]
        })

class ResendEmailView(APIView):
    def post(self,request):
        
        email = request.data.get("email")
        user = db_model.get_user_by_email(email)
      
        if not user :
            return Response({"error": "User not found"}, status=404)
        if user["is_active"]:
            return Response({"message": "Already verified"}, status=400)
        token = str(uuid.uuid4())
        db_model.update_unverified_user(user["user_name"],user["user_email"],user["role"],token)

        verify_link = f"http://127.0.0.1:8000/verify-email/{token}/"
        send_mail(
            subject="Verify Your Email",
            message=f"Click this link to verify your email:\n{verify_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Verification link resent"})

# ---------------------------------------Login-------------------------------------------------------------
class LoginListView(APIView):
    # def post(self,request):
        # serial= LoginSerializer(data=request.data)
        # if not serial.is_valid():
        #     return Response(serial.errors, status=status.HTTP_400_BAD_REQUEST)
        # email=serial.validated_data["user_email"]
        # password = serial.validated_data["user_password"]
       
        # user = user_login(email,password)
        # if not user:
        #     return Response({"error": "Login failed"}, status=status.HTTP_400_BAD_REQUEST)
        
        # count =user.get("count") 

        # if user["status"]  != 'success' :
        #         if user["o_flage"]==0:
        #              return Response({"error":"Invalid Email..!"},status=status.HTTP_403_FORBIDDEN)
        #         elif user["o_flage"]==1:
        #             return Response({"error":"pleas wait 2min .you can not login now ..!"},status=status.HTTP_403_FORBIDDEN)
        #         elif user["o_flage"]==2:
        #             return Response({"error":"3 wrong attempt .Now Try again after 2 minutes'..!"},status=status.HTTP_403_FORBIDDEN)
        #         elif user["o_flage"]==3:
        #              remain = (3-count)
        #              return Response({"error":f"Wrong password..!Now you can try only {remain} time"},status=status.HTTP_403_FORBIDDEN)

        # access_token = generate_access_token(user["user_id"],user["user_email"]) 
        # refresh_token =generate_refresh_token(user["user_id"],user["user_email"])
        # return Response(
        #     {
        #        "message": "Login successful",
        #         "access_token":access_token,
        #         "refresh_token":refresh_token,
        #         "user": {
        #         "user_id":user["user_id"],
        #         "user_name":user["user_name"],
        #          "user_email" :user["user_email"]
        #                 }
        #     },status=status.HTTP_200_OK
        # )


    def post(self, request):
        serial = LoginSerializer(data=request.data)
        if not serial.is_valid():
            return Response(serial.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serial.validated_data["user_email"]
        password = serial.validated_data["user_password"]
        user = db_model.custom_user_login(email,password) 
        count = user["count"]
        duration = user["duration"]
        if duration and timezone.is_naive(duration):
              duration = timezone.make_aware(duration, timezone.get_current_timezone())     
        

        if user["status"]  != 'success' :
            if user["o_flage"]==0:
                db_model.insert_login_audit("NA",None, "LOGIN", "FAILED_WRONG_EMAIL")
                return Response({"error":"Invalid Email..!"},status=status.HTTP_403_FORBIDDEN)
           
        if (count >=3 ) and (duration):
             if timezone.now() < duration + timedelta(minutes=2):
                return Response({"error": "Account locked. Try again after 2 minutes."},
                        status=status.HTTP_403_FORBIDDEN)
             else:
              db_model.update_count(user["user_email"],0)
              db_model.update_duration(user["user_email"],None)
              count = 0
              duration = None
        db_password =user["user_password"]
        if not check_password(password,db_password) :
             if count + 1 >= 3:
                db_model.update_count(user["user_email"],3)
                db_model.update_duration(user["user_email"],timezone.now())
                db_model.insert_login_audit(email,user["user_id"],"LOGIN", "FAILED_WRONG_PASSWORD")
                return Response({"error":"3 wrong attempt .Now Try again after 2 minutes'..!"},status=status.HTTP_403_FORBIDDEN)

             else :
                count +=1
                remaining = max(0, 3 - count)
                db_model.update_count(user["user_email"],count)
                db_model.insert_login_audit(email,user["user_id"],"LOGIN", "FAILED_WRONG_PASSWORD")
                return Response({"error":f"Wrong Password you can try {remaining} more time"},status=status.HTTP_403_FORBIDDEN)
        
        access_token = generate_access_token(user["user_id"],user["user_email"],user["role"]) 
        refresh_token =generate_refresh_token(user["user_id"],user["user_email"],user["role"])
        db_model.update_count(user["user_email"],0)
        db_model.update_duration(user["user_email"],None)
        
        db_model.insert_login_audit(email,user["user_id"],"LOGIN", "LOGIN SUCCESSFULLY")
        return Response(
            {
                "message": "Login successfully",
                "access_token":access_token,
                "refresh_token":refresh_token,
                "user": user
            },
            status=status.HTTP_200_OK
        )
   
# ---------------------------------------Refresh Token-------------------------------------------------------------
class RefreshTokenView(APIView):
    def post(self,request):
        refresh_token=request.data.get("refresh_token")
        if not refresh_token :
            return Response({"error":"Refresh token missing"},status=400)
        try:
            payload=decode_token(refresh_token)
            if payload.get("type") != "refresh":
                return Response({"error":"Invalid Token Type"},status=401)
        
            new_access_token = generate_access_token(payload["user_id"],payload["user_email"],payload["role"])
            return Response ({"access_token":new_access_token})
        except jwt.ExpiredSignatureError:
                return Response({"error": "Refresh token expired","code": "TOKEN_EXPIRED"}, status=401)
        except jwt.InvalidTokenError:
               return Response({"error": "Invalid refresh token"}, status=401)

# ---------------------------------------Forgot password-------------------------------------------------------------
class ForgotPasswordView(APIView):
    def post(self,request):
        email = request.data["user_email"]
        db_email = db_model.check_mail(email)
        if not db_email :
            return Response({"error":"Invalid Email..!"},status=status.HTTP_404_NOT_FOUND)
        
        token = str(uuid.uuid4())
        # print(token)
        cache.set(token,email,timeout=600)
        reset_link =f"http://localhost:3000/reset/{token}"
        send_mail(
            subject="Reset Your Password",
            message=f"Click The Link to Reset Your Password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({"message":"Password reset link sent"},status=status.HTTP_200_OK)

# ---------------------------------------Forgot password-------------------------------------------------------------
class ResetPasswordView(APIView):
    def post(self,request):
        token = request.data["token"]
        password = request.data["user_password"]
        email = cache.get(token) 
        if not email:
            return Response({"error":"Invalid Or Expired Link"},status=status.HTTP_400_BAD_REQUEST)
        hash_pass = make_password(password)
        try :
            db_model.update_password(email,hash_pass)
        except:
            return Response({"error":"Password not updated"},status=status.HTTP_400_BAD_REQUEST)
        cache.clear()
        return Response({"message":"password Updated successfully"},status=status.HTTP_201_CREATED)     

# ---------------------------------------Books-------------------------------------------------------------
class bookListView(APIView):
    # permission_classes = [IsJWTAuthenticated]
    def get(self,request,id=None):
        data = db_model.get_all_books()
        return Response(data,status=status.HTTP_200_OK)
    # @admin_reqired
    
    def post(self,request):
        # user_id = request.data.get("created_by")
        serial = BooksSerializer(data = request.data)
        serial.is_valid(raise_exception=True)
        data = serial.validated_data
        # if not data["book_name"] and not data["category_id"]and not data["author_id"] and not data["book_page"] and not data["copies"] :
        #     return Response({"error":"All Fieds Are Required"})
        msg = db_model.post_update_book('post',None,data["book_name"],data["category_id"],data["author_id"],data["book_page"],data["copies"],None,None)
        db_model.insert_audit_log(2,"create","BOOK","Create new book")
        return Response({"success":"Data Updated sucessfully..!"},status=status.HTTP_201_CREATED)
       
 
    def put(self,request,id):
        serial =BooksSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        db_model.post_update_book('update',id,data["book_name"],data["category_id"],
                    data["author_id"],data["book_page"],data["copies"],data["updated_by"],data["update_reason"])
      
        db_model.insert_audit_log(2,"update","BOOK","updated book.")
        return Response({"success":"Data Updated sucessfully..!"},status=status.HTTP_202_ACCEPTED)
       
    def delete(self,request,id):
        # serial=BooksSerializer(data=request.data)
        # serial.is_valid()
        # data = serial.validated_data
        db_model.delete_book(id)
        db_model.insert_audit_log(2,"deleted","BOOK",f"book deleted")
        return Response({"Detail":"book Deleted.!"},status=status.HTTP_200_OK)
    
class bookSearchView(APIView):
      def get(self,request):
        #   serial = BooksSerializer(data=request.data)
        #   serial.is_valid()
        #   data = serial.validated_data
          name=request.GET.get("name","")
          data=db_model.search_book(name)
          return Response(data,status=status.HTTP_200_OK)
# ---------------------------------------ISSUE BOOK-------------------------------------------------------------
class IssueBookView(APIView):
    def get(self,request):
        data = db_model.get_all_issue_book_detail()
        if not data:
            return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        user_id = request.data.get("user_id")
        book_ids = request.data.get("book_ids", [])
        issue_date =request.data.get("issue_date")
        is_overdue =db_model.check_overdue(user_id)

        if is_overdue:
          return Response({"error": "User has overdue book. Cannot issue new book."},status=status.HTTP_403_FORBIDDEN)
        
        if not user_id :
             return Response({"error": "Not user selected"},status=status.HTTP_403_FORBIDDEN)
        
        if not book_ids :
             return Response({"error": "Not book selected"},status=status.HTTP_403_FORBIDDEN)
        
        if not issue_date :
             return Response({"error": "Issue Date id required"},status=status.HTTP_403_FORBIDDEN)
    
        due_date = datetime.now() + timedelta(days=7)
        if len(book_ids) >3:
            return Response({"error": "you can not take more then 3 books at a time"},status=status.HTTP_403_FORBIDDEN)
       
        for book_id in book_ids :
          qty = db_model.get_available_qty(book_id)
          if not qty or qty[0] <= 0:
            return Response({"error": f"Book ID {book_id} is not available"},status=status.HTTP_403_FORBIDDEN)

        for book_id in book_ids: 
          db_model.update_qty(book_id)
          db_model.post_book_issue(user_id,book_id,issue_date,due_date)  
          db_model.insert_audit_log(2,"create","Issue",f"Issued book")
        return Response({"success":"Book issued successfully"})

class IssueUserViewList(APIView):
    def get(self,request,id):
        data=db_model.get_issue_user_detail(id)
        if not data:
            return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)
    
class IssueSearchView(APIView):
    def get(self,Request):
        u_name = Request.GET.get("name","")
        data = db_model.get_issue_search(u_name)
        # if not data:
        #     return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)

class OverdueListView(APIView):
    def get(self,request):   
       data = db_model.get_overdue_list()
       return Response(data,status=status.HTTP_200_OK)

class SendOverdueMailListView(APIView):
    def get(self,request):
        data =db_model.send_overdue_mail()
        overdue_book = data
        for book in overdue_book:
          jwt_utils.send_overdue_email(
            book[1],
            book[2],
            book[3],
            book[5],
            book[8]
        )
        return Response({"message": "Emails sent"})
    
# ---------------------------------------RETERN BOOK-------------------------------------------------------------
class ReturnBookView(APIView):
    def post(self,request):
        issue_id = request.data.get("issue_id")
        data = db_model.get_book_id_to_return(issue_id)
        if not data:
            return Response({"error":"Invalid issue record"},status=400)
        book_id = data[0]
        db_model.update_book_issue(issue_id)
        db_model.update_book_return(book_id)
        db_model.insert_audit_log(2,"return","Book Return",f"Book returned")
        return Response({"message": "Book returned successfully"})
# ---------------------------------------Category-------------------------------------------------------------
class categoryListView(APIView):
    def get(self,request,id=None) :
        data =db_model.get_all_category()
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self,request) :
        serial = CategorySerializer(data = request.data)
        serial.is_valid()
        data = serial.validated_data
        if not data["category_name"]:
            return Response({"error":"categoy name required"})
        db_model.post_update_category('post',None,data["category_name"])
        db_model.insert_audit_log(2,"create","CATEGORY","Create new Category")
        return Response({"Detail":"Data inserted sucessfully"}, status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=CategorySerializer(data=request.data)
        serial.is_valid()
        data = serial.validated_data
        if not data["category_name"]:
            return Response({"error":"categoy name required"})
        db_model.post_update_category('update',id,data["category_name"])
        db_model.insert_audit_log(2,"Update","CATEGORY","Updated Category")
        return Response({"Detail":"Category Update sucessfully"},status=status.HTTP_202_ACCEPTED)
    
    def delete(self,request,id):
        db_model.delete_category(id)
        db_model.insert_audit_log(2,"deleted","CATEGORY","deleted Category")
        return Response({"Detail":"Category deletd.!"},status=status.HTTP_200_OK)
    
class categorySearchView(APIView):
    def get(self,request):
        name = request.GET.get("name","")
        data= db_model.cat_search(name)
        return Response(data,status=status.HTTP_200_OK)
# ---------------------------------------authors-------------------------------------------------------------
class authorListView(APIView):
    # authentication_classes = [JWTAuthenticationMiddleware]
    def get(self,request,id=None):
        data=db_model.get_all_author()
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serial= AuthorSerializer(data= request.data)
        serial.is_valid()
        data=serial.validated_data
        if not data["author_name"]:
            return Response({"error":"Author name required"})
        db_model.post_update_author('post',None,data["author_name"])
        db_model.insert_audit_log(2,"create","AUTHOR","Create new Author")
        return Response({"success":"Author Inserted Sucessfully"},status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=AuthorSerializer(data=request.data)
        serial.is_valid()
        data=serial.validated_data
        if not data["author_name"]:
            return Response({"error":"Author name required"},status=status.HTTP_403_FORBIDDEN)
        db_model.post_update_author('update',id,data["author_name"])
        db_model.insert_audit_log(2,"update","AUTHOR","Author Updated")
        return Response({"success":"Author Updated Sucssecfully"},status=status.HTTP_202_ACCEPTED)
 
    def delete(self,request,id):
        db_model.delete_author(id)
        db_model.insert_audit_log(2,"deleted","AUTHOR","Author Deleted")
        return Response({"message":"Author Deleted.!"},status=status.HTTP_200_OK)

# ---------------------------------------ImageView-------------------------------------------------------------

class imageListView(APIView):
    # @JWT_Required
    def get(self,request,id=None):
        data=db_model.get_image()
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serial=ImageSerializer(data=request.data)
        if serial.is_valid() :
            data=serial.validated_data
            image = request.FILES.get("image_file")
            image_path='' 
            if image :
                image_path = 'demo/'+image.name
                full_path = os.path.join(settings.MEDIA_ROOT,image_path)
                os.makedirs(os.path.dirname(full_path),exist_ok=True)

                with open(full_path, 'wb+') as destination:
                    for chunk in image.chunks():
                        destination.write(chunk)
        db_model.post_image(image_path,data["image_name"])
        db_model.insert_audit_log(2,"create","Image","Image Upload")
        return Response({"success":"Image posted..!"},status=status.HTTP_103_EARLY_HINTS)

    def delete(self,request,id):
        db_model.delete_image(id)
        db_model.insert_audit_log(2,"delete","Image","Image Deleted")
        return Response({"detail":"image Delated..!"},status=status.HTTP_200_OK)
    

class imgPaginationView(APIView):
    def get(self,request):
        p_page=int(request.query_params.get('page',1))
        page_size=int(request.query_params.get('page_size',4))
        data=db_model.image_pagination(p_page,page_size)
        return Response(data,status=status.HTTP_200_OK)

# ---------------------------------------ContactUs-------------------------------------------------------------
class contactUsListView(APIView):
    def post(self,request):
        serial = ContactSerializer(data=request.data)
        serial.is_valid()
        data=serial.validated_data
        if not data :
            return Response({"error":"please..!feel the form "},status=status.HTTP_403_FORBIDDEN)
        db_model.post_contactUs(data["contact_name"],data["contact_email"],data["contact_msg"])
        return Response({"success":"Thank you for your time..!"},status=status.HTTP_201_CREATED)
    
# ---------------------------------------ChartView-------------------------------------------------------------

class ChartViewList(APIView):
    def get(self,request):
        data = db_model.get_datafor_chart()
        return Response(data,status=status.HTTP_200_OK)
    
# ---------------------------------------XLSX ReportView-------------------------------------------------------------

class UserReportView(APIView):
    def get(self,request,id):
        
        wb = Workbook()
        ws = wb.active
        ws.title = "User Reposrt"
        headers =[
            "issue_id",
            "user name",
            "book name",
            "issue_date",
            "duedate",
            "return date",
            "status"
        ]
        ws.append(headers)
        rows=db_model.get_user_report(id)
        for row in rows :
            ws.append([
                row[0],
                row[1],
                row[2],
                row[3].strftime('%Y-%m-%d') if row[3] else "",
                row[4].strftime('%Y-%m-%d') if row[4] else "",
                row[5].strftime('%Y-%m-%d') if row[5] else "",
                row[6]
                ])
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=User_Report.xlsx'
        wb.save(response)
        
        return response

# ---------------------------------------Audit tView-------------------------------------------------------------

class AuditListView(APIView):
    def get(self,request):
        data = db_model.get_audit_log()
        return Response(data,status=status.HTTP_200_OK)
    
class LoginAuditListView(APIView):
    def get(self,request):
        data = db_model.get_login_audit()     
        return Response(data,status=status.HTTP_200_OK)
    
class SearchUserLoginAuditView(APIView):
    def get(self,request):
        name = request.GET.get("name","")
        data=db_model.get_Search_user_audit(name)
        return Response(data,status=status.HTTP_200_OK)

class UserAuditPDFView(APIView):
    
    permission_classes = [AllowAny]
    def get(self,request):
        email = request.GET.get("email","")
       
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="User_Login_Audit_{email}.pdf"'
        # response['Content-Disposition']=f'inline;filename="user_audit.pdf"'

        doc = SimpleDocTemplate(response,pagesize=A4,rightMargin=30,leftMargin=30,
            topMargin=40, bottomMargin=30)
        elements = []

        style = getSampleStyleSheet()
        # ===== Custom Styles =====
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=style['Heading1'],
            fontSize=18,
            spaceAfter=6,
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=style['Normal'],
            fontSize=10,
        )
        # ===== Header Section =====
        elements.append(Paragraph("Library Management System", title_style))
        elements.append(Paragraph("User Login Audit Report", style['Heading3']))
        elements.append(Spacer(1, 12))

        elements.append(Paragraph(f"<b>User Email:</b> {email}", normal_style))
        elements.append(Paragraph(
            f"<b>Generated On:</b> {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            normal_style
        ))
        elements.append(Spacer(1, 20))


        data = db_model.get_user_audit(email)
        table_data =[["id" ,"Email", "User name", "Activity", "Status", "Date"]]

        

        for d in data :
            date_formate = d[5].strftime("%d %b %Y") if d[5] else ""
            table_data.append([
                str(d[0]),
                d[1],d[2] if d[2] else "",
                d[3],d[4],
                date_formate
            ])
        table = Table(table_data,repeatRows=1)
        # ===== Professional Table Styling =====
        table.setStyle(TableStyle([

            # Header Styling
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#34495E")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Times-Bold'),

            # Body Styling
            ('FONTNAME', (0, 1), (-1, -1), 'Times-Roman'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),

            # Alternating Row Colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1),
             [colors.whitesmoke, colors.lightgrey]),

            # Grid
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),

            # Alignment
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),

            # Padding
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),

        ]))

        elements.append(table)
        # ===== Footer with Page Number =====
        def add_page_number(canvas, doc):
            page_num_text = f"Page {doc.page}"
            canvas.setFont("Helvetica", 9)
            canvas.drawRightString(550, 20, page_num_text)

        doc.build(elements,
                  onFirstPage=add_page_number,
                  onLaterPages=add_page_number)
        return response
    
class FilterAuditView(APIView):
     def get(self,request):
         sdate=request.GET.get('sdate')
         edate=request.GET.get('edate')
         user=request.GET.get('user')
         act=request.GET.get('act')
         sdate = sdate if sdate else None
         edate = edate if edate else None
         user = user if user else None
         act = act if act else None
         
         data=db_model.get_filter_audit(sdate,edate,user,act)
         return Response(data)

class FilterAuditPDFview(APIView):
    def get(self,request):
        sdate = request.GET.get('sdate')
        edate = request.GET.get('edate')
        user = request.GET.get('user')
        act = request.GET.get('act')

        sdate = sdate if sdate else None
        edate = edate if edate else None
        user = int(user) if user else None
        act = act if act else None

        data = db_model.get_filter_audit(sdate, edate, user, act)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="Audit_Report.pdf"'

        doc = SimpleDocTemplate(response, pagesizev=A4)
        elements = []

        styles = getSampleStyleSheet()
        title = Paragraph("<b>Audit Report</b>",styles["Title"])
        elements.append(title)
        elements.append(Spacer(1,0.3*inch))
        table_data =[ ["ID", "User", "Action", "Module", "Description", "Date"]]
        for row in data:
            table_data.append([
                row[0],
                row[1],
                row[2].upper(),
                row[3],
                row[4],
                row[5].strftime("%d %b %Y %H:%M")
            ])

        table = Table(table_data, repeatRows=1)

        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ]))

        elements.append(table)
        def add_page_number(canvas, doc):
            page_num_text = f"Page {doc.page}"
            canvas.setFont("Helvetica", 9)
            canvas.drawRightString(550, 20, page_num_text)

        doc.build(elements ,onFirstPage=add_page_number,
                  onLaterPages=add_page_number)

        return response