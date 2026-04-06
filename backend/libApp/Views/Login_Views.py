
import jwt
import uuid

from django.core.mail import send_mail
from django.core.cache import cache
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password ,make_password
from libApp.service import Login_service,Audit_service
from libApp.utils.jwt_utils import generate_access_token,generate_refresh_token ,decode_token

# from .middlewares.jwt_middleware import JWTAuthenticationMiddleware
from libApp.Serializer.Login_Serializer import UserSerializer,LoginSerializer ,ContactSerializer
from django.http import JsonResponse
from django.db import connection


def test_api(request):
    return JsonResponse({"massage":"You are allowed !"})
# ---------------------------------------Users Registration-------------------------------------------------------------
class getUsersListView(APIView):
    def get(self,request):
        data = Login_service.get_users()
        if not data :
            return Response({"error": "User not found"}, status=404)
        return Response(data,status=status.HTTP_200_OK)

class RegisterListView(APIView):
    def get(self ,request,id):
        data=Login_service.get_user(id)
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
        
        is_exist = Login_service.get_user_by_email(data["user_email"])
        if is_exist and is_exist["is_active"]:
            return Response({"error": "Email already registered"},status=400)
        
        if is_exist and not is_exist["is_active"]:
            user=Login_service.update_unverified_user(data["user_name"],data["user_email"],role,token)
            email = user["user_email"]

        if not is_exist:
            user=Login_service.post_user(data["user_name"],data["user_email"],hash_pass,role,token)
            email = user["email"]
            Login_service.insert_user_role(user["user_id"],2)
            Audit_service.insert_login_audit(data["user_email"],user["user_id"],"REGISTATION", "REGISTER SUCCESSFULLY")
        
        verify_link = f"http://127.0.0.1:8000/verify-email/{token}/"
        send_mail(
            subject="Verify Your Email",
            message=f"Click this link to verify your email:\n{verify_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"Detail":"Registration successfully!"},status=status.HTTP_200_OK)

    def put(self,request,id):
        serial = UserSerializer(data= request.data)
        serial.is_valid(raise_exception=True)
        data = serial.validated_data
        Login_service.edit_profilr(id,data["user_name"])
        return Response({"success":"Updated successfully"},status=status.HTTP_200_OK)


class VerifyEmailview(APIView):
    def get(self,request,token):
        user = Login_service.get_user_by_token(token)
        if not user:
            return Response({"error": "Invalid token"}, status=400)
        
        Login_service.verify_user_email(token)
        return Response({"message": "Email verified successfully"})
    
class CheckVerificationView(APIView):
    def post(self, request):
        email = request.data.get("email")

        user = Login_service.get_user_by_email(email)

        if not user:
            return Response({"error": "User not found"}, status=404)

        return Response({
            "is_active": user["is_active"]
        })

class ResendEmailView(APIView):
    def post(self,request):
        
        email = request.data.get("email")
        user = Login_service.get_user_by_email(email)
      
        if not user :
            return Response({"error": "User not found"}, status=404)
        if user["is_active"]:
            return Response({"message": "Already verified"}, status=400)
        token = str(uuid.uuid4())
        Login_service.update_unverified_user(user["user_name"],user["user_email"],user["role"],token)

        verify_link = f"http://127.0.0.1:8000/verify-email/{token}/"
        send_mail(
            subject="Verify Your Email",
            message=f"Click this link to verify your email:\n{verify_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Verification link resent"})

# ---------------------------------------Librarian Registration-------------------------------------------------------------
class LibrarianRegisterView(APIView):
    def get(self,request,id=None):
        data = Login_service.get_librarian()
        if not data :
            return Response({"error":"Data not found"},status=status.HTTP_403_FORBIDDEN)
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serial = UserSerializer(data=request.data)
        if not serial.is_valid():
            return Response(serial.errors,status=400)
        data=serial.validated_data 
        role ='LIBRARIAN'
        
        pasw = "Libary@123"
        passw=make_password(pasw)
        token = str(uuid.uuid4())
        user=Login_service.post_Librarian(data["user_name"],data["user_email"],passw,role,token)
        # email = user["email"]
        Login_service.insert_user_role(user["user_id"],3)
        Audit_service.insert_login_audit(data["user_email"],user["user_id"],"REGISTATION", "LIBRARIAN REGISTER SUCCESSFULLY")
        return Response({
            "message": "Librarian registered successfully",
            "user_id": user["user_id"],
            "email": user["email"]
        }, status=201)

    def put(self,request,id):  
        serial = UserSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        Login_service.update_librarian(id,data["user_name"],data["user_email"])
        return Response({"success":"Updated sucessfully..!"},status=status.HTTP_201_CREATED)
    
    def delete(self,request,id):
        Login_service.delete_librarian(id)
        return Response({"message":"deleted successfully..!"},status=status.HTTP_200_OK)
 

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
        user = Login_service.custom_user_login(email,password) 
        count = user["count"]
        duration = user["duration"]
        if duration and timezone.is_naive(duration):
              duration = timezone.make_aware(duration, timezone.get_current_timezone())     
        

        if user["status"]  != 'success' :
            if user["o_flage"]==0:
                Audit_service.insert_login_audit("NA",None, "LOGIN", "FAILED_WRONG_EMAIL")
                return Response({"error":"Invalid Email..!"},status=status.HTTP_403_FORBIDDEN)
           
        if (count >=3 ) and (duration):
             if timezone.now() < duration + timedelta(minutes=2):
                return Response({"error": "Account locked. Try again after 2 minutes."},
                        status=status.HTTP_403_FORBIDDEN)
             else:
              Login_service.update_count(user["user_email"],0)
              Login_service.update_duration(user["user_email"],None)
              count = 0
              duration = None
        db_password =user["user_password"]
        if not check_password(password,db_password) :
             if count + 1 >= 3:
                Login_service.update_count(user["user_email"],3)
                Login_service.update_duration(user["user_email"],timezone.now())
                Audit_service.insert_login_audit(email,user["user_id"],"LOGIN", "FAILED_WRONG_PASSWORD")
                return Response({"error":"3 wrong attempt .Now Try again after 2 minutes'..!"},status=status.HTTP_403_FORBIDDEN)

             else :
                count +=1
                remaining = max(0, 3 - count)
                Login_service.update_count(user["user_email"],count)
                Audit_service.insert_login_audit(email,user["user_id"],"LOGIN", "FAILED_WRONG_PASSWORD")
                return Response({"error":f"Wrong Password you can try {remaining} more time"},status=status.HTTP_403_FORBIDDEN)
        
        access_token = generate_access_token(user["user_id"],user["user_email"],user["roles"],user["permissions"]) 
        refresh_token =generate_refresh_token(user["user_id"],user["user_email"],user["roles"],user["permissions"])
        Login_service.update_count(user["user_email"],0)
        Login_service.update_duration(user["user_email"],None)
        
        Audit_service.insert_login_audit(email,user["user_id"],"LOGIN", "LOGIN SUCCESSFULLY")
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
        
            new_access_token = generate_access_token(payload["user_id"],payload["user_email"],payload.get("roles",[]),payload.get("permissions",[]))
            return Response ({"access_token":new_access_token})
        except jwt.ExpiredSignatureError:
                return Response({"error": "Refresh token expired","code": "TOKEN_EXPIRED"}, status=401)
        except jwt.InvalidTokenError:
               return Response({"error": "Invalid refresh token"}, status=401)

# ---------------------------------------Forgot password-------------------------------------------------------------
class ForgotPasswordView(APIView):
    def post(self,request):
        email = request.data["user_email"]
        db_email = Login_service.check_mail(email)
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

# ---------------------------------------Reset password-------------------------------------------------------------
class ResetPasswordView(APIView):
    def post(self,request):
        token = request.data["token"]
        password = request.data["user_password"]
        email = cache.get(token) 
        if not email:
            return Response({"error":"Invalid Or Expired Link"},status=status.HTTP_400_BAD_REQUEST)
        hash_pass = make_password(password)
        try :
           Login_service.update_password(email,hash_pass)
        except:
            return Response({"error":"Password not updated"},status=status.HTTP_400_BAD_REQUEST)
        cache.clear()
        return Response({"message":"password Updated successfully"},status=status.HTTP_201_CREATED) 

# ---------------------------------------Session-------------------------------------------------------------
class VerifyPasswordView(APIView):
    def post(self,request):
        password = request.data.get("password")
        user_id = request.data.get("user_id")
        # print(user_id)
        
        with connection.cursor() as cursor :
           cursor.execute("select user_password from tbl_users where user_id = %s",[user_id])
           result = cursor.fetchone()
          
        
        if not result :
            return Response({"error":"User Not Found"},status=status.HTTP_403_FORBIDDEN)
        stored_hash = result[0]
        if not check_password(password,stored_hash):
            return Response({"error":"Wrong Password"},status=status.HTTP_403_FORBIDDEN)
        return Response({"success":"verification Done"},status=status.HTTP_200_OK)

# ---------------------------------------ContactUs-------------------------------------------------------------
class contactUsListView(APIView):
    def post(self,request):
        serial = ContactSerializer(data=request.data)
        serial.is_valid()
        data=serial.validated_data
        if not data :
            return Response({"error":"please..!feel the form "},status=status.HTTP_403_FORBIDDEN)
        Login_service.post_contactUs(data["contact_name"],data["contact_email"],data["contact_msg"])
        return Response({"success":"Thank you for your time..!"},status=status.HTTP_201_CREATED)