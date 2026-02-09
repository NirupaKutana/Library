import os
import jwt
import uuid
from django.core.mail import send_mail
from django.core.cache import cache
from datetime import datetime
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password ,make_password
from libApp import db_model
from .db_model import get_all_books,post_update_book,delete_book,search_book
from .db_model import get_all_category,post_update_category,delete_category
from .db_model import get_all_author,post_update_author,delete_author
from .db_model import post_user ,custom_user_login,get_user,update_count,update_duration,check_mail ,update_password
from .db_model import get_available_qty,post_book_issue,update_qty
from .db_model import get_book_id_to_return,update_book_issue,update_book_return
from .db_model import cat_page ,cat_search
from .db_model import get_image,post_image,delete_image
from libApp.utils.jwt_utils import generate_access_token,generate_refresh_token ,JWT_Required ,decode_token
from libApp.utils.jwt_utils import admin_reqired
# from .middlewares.jwt_middleware import JWTAuthenticationMiddleware

from .serialize import BooksSerializer,CategorySerializer,AuthorSerializer
from .serialize import UserSerializer,ImageSerializer ,LoginSerializer
from django.http import JsonResponse
def test_api(request):
    return JsonResponse({"massage":"You are allowed !"})
# ---------------------------------------Users-------------------------------------------------------------
class userListView(APIView):
    def get(self ,request,id):
        data=get_user(id)
        if not data:
            return Response({"error": "User not found"}, status=404)
        return Response({
            "user_id":data[0],
            "user_name":data[1],
            "user_email":data[2]
        })
    def post(self,request):
        serial=UserSerializer(data=request.data)
        if serial.is_valid():
           role ='USER'
           passw = serial.validated_data["user_password"]
           hash_pass = make_password(passw)
           data=serial.validated_data   
        post_user(data["user_name"],data["user_email"],hash_pass,role)
        return Response({"Detail":"User Created..!"},status=status.HTTP_200_OK)
    
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
        user = custom_user_login(email,password) 
        count = user["count"]
        
        duration = user["duration"]
        if duration and timezone.is_naive(duration):
              duration = timezone.make_aware(duration, timezone.get_current_timezone())     
        
        
        if (count ==3 ) and (duration != None) and (timezone.now() >= duration + timedelta(minutes=1)):
             update_count(user["user_email"],0)
             update_duration(user["user_email"],None)
             user["count"] = 0
             user["duration"] = None
        if user["status"]  != 'success' :
            if user["o_flage"]==0:
                return Response({"error":"Invalid Email..!"},status=status.HTTP_403_FORBIDDEN)
            # if user["o_flage"]==1:
            #     return Response({"error":"pleas wait 2min .you can not login now ..!"},status=status.HTTP_403_FORBIDDEN)
        
        db_password =user["user_password"]
        if not check_password(password,db_password) :
             if count==2 :
                update_count(user["user_email"],3)
                update_duration(user["user_email"],timezone.now())
                return Response({"error":"3 wrong attempt .Now Try again after 2 minutes'..!"},status=status.HTTP_403_FORBIDDEN)

             else :
                count +=1
                update_count(user["user_email"],count)
                return Response({"error":f"Wrong Password you can try {3-count} more time"},status=status.HTTP_403_FORBIDDEN)
        
        access_token = generate_access_token(user["user_id"],user["user_email"],user["role"]) 
        refresh_token =generate_refresh_token(user["user_id"],user["user_email"],user["role"])
        update_count(user["user_email"],0)
        update_duration(user["user_email"],None)
        
        return Response(
            {
                "message": "Login successful",
                "access_token":access_token,
                "refresh_token":refresh_token,
                "user": user
            },
            status=status.HTTP_200_OK
        )

    # if not check_password(password,user["user_password"]) :
        #     count+=1
        #     remain = (3-count)
        #     if count == 2 :
        #         update_count(user["user_email"],3)
        #         update_duration(user["user_email"],datetime.now())
        #         return Response({"error":"3 wrong attempt .Now Try again after 2 minutes'..!"},status=status.HTTP_403_FORBIDDEN)
        #     else :
        #        update_count(user["user_email"],count)
        #        return Response({"error":f"Wrong password..!Now you can try only {remain} time"},status=status.HTTP_403_FORBIDDEN)
        
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
        db_email = check_mail(email)
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
        print(token)
        print(password)
        email = cache.get(token)
        print(email)
        if not email:
            return Response({"error":"Invalid Or Expired Link"},status=status.HTTP_400_BAD_REQUEST)
        hash_pass = make_password(password)
        try :
            update_password(email,hash_pass)
        except:
            return Response({"error":"Password not updated"},status=status.HTTP_400_BAD_REQUEST)
        cache.clear()
        return Response({"message":"password Updated successfully"},status=status.HTTP_201_CREATED)     

# ---------------------------------------Books-------------------------------------------------------------
class bookListView(APIView):
    # permission_classes = [IsJWTAuthenticated]
    def get(self,request,id=None):
        data = get_all_books()
        return Response(data,status=status.HTTP_200_OK)
    @admin_reqired
    def post(self,request):
        serial = BooksSerializer(data = request.data)
        serial.is_valid(raise_exception=True)
        data = serial.validated_data
        post_update_book('post',None,data["book_name"],data["category_id"],data["author_id"],data["book_page"],data["copies"],None,None)
        return Response({"success": "Data Added Successfully"},status=status.HTTP_201_CREATED)
       
 
    def put(self,request,id):
        serial =BooksSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        post_update_book('update',id,data["book_name"],data["category_id"],
                    data["author_id"],data["book_page"],data["copies"],data["updated_by"],data["update_reason"])
        return Response({"success":"Data Updated sucessfully..!"},status=status.HTTP_202_ACCEPTED)
       
    def delete(self,request,id):
        # serial=BooksSerializer(data=request.data)
        # serial.is_valid()
        # data = serial.validated_data
        delete_book(id)
        return Response({"Detail":"book Deleted.!"},status=status.HTTP_200_OK)
    
class bookSearchView(APIView):
      def get(self,request):
        #   serial = BooksSerializer(data=request.data)
        #   serial.is_valid()
        #   data = serial.validated_data
          name=request.GET.get("name","")
          data=search_book(name)
          return Response(data,status=status.HTTP_200_OK)
# ---------------------------------------ISSUE BOOK-------------------------------------------------------------
class IssueBookView(APIView):
    def post(self,request):
        book_id = request.data.get("user_id")
        user_id = request.data.get("book_id")
        qty = get_available_qty(book_id)
        if not qty and qty[0] <= 0:
            return Response({"error" : "Book is not available right now"},status=status.HTTP_404_NOT_FOUND)
        due_date = datetime.now() + timedelta(days=7)
        post_book_issue(user_id,book_id,due_date)
        update_qty(book_id)
        return Response({"message":"Book issued successfully"})

# ---------------------------------------RETERN BOOK-------------------------------------------------------------
class ReturnBookView(APIView):
    def post(self,request):
        issue_id = request.data.get("issue_id")
        data = get_book_id_to_return(issue_id)
        if not data:
            return Response({"error":"Invalid issue record"},status=400)
        book_id = data[0]
        update_book_issue(issue_id)
        update_book_return(book_id)
        return Response({"message": "Book returned successfully"})
# ---------------------------------------Category-------------------------------------------------------------
class categoryListView(APIView):
    def get(self,request,id=None) :
        data =get_all_category()
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self,request) :
        serial = CategorySerializer(data = request.data)
        serial.is_valid()
        data = serial.validated_data
       
        post_update_category('post',None,data["category_name"])
        return Response({"Detail":"Data inserted sucessfully"}, status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=CategorySerializer(data=request.data)
        serial.is_valid()
        data = serial.validated_data
        post_update_category('update',id,data["category_name"])
        return Response({"Detail":"Category Update sucessfully"},status=status.HTTP_202_ACCEPTED)
    
    def delete(self,request,id):
        delete_category(id)
        return Response({"Detail":"Category deletd.!"},status=status.HTTP_200_OK)

class pageCategoryView (APIView):
    def get(self,request):
        p_page = int(request.query_params.get('page',1)) 
        page_size=int(request.query_params.get('page_size',4))
        data=cat_page(p_page,page_size)
        return Response(data,status=status.HTTP_200_OK)
    
class categorySearchView(APIView):
    def get(self,request):
        name = request.GET.get("name","")
        data= cat_search(name)
        return Response(data,status=status.HTTP_200_OK)
# ---------------------------------------authors-------------------------------------------------------------
class authorListView(APIView):
    # authentication_classes = [JWTAuthenticationMiddleware]
    def get(self,request,id=None):
        data=get_all_author()
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serial= AuthorSerializer(data= request.data)
        serial.is_valid()
        data=serial.validated_data
        post_update_author('post',None,data["author_name"])
        return Response({"success":"Author Inserted Sucessfully"},status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=AuthorSerializer(data=request.data)
        serial.is_valid()
        data=serial.validated_data
        post_update_author('update',id,data["author_name"])
        return Response({"success":"Author Updated Sucssecfully"},status=status.HTTP_202_ACCEPTED)
 
    def delete(self,request,id):
        delete_author(id)
        return Response({"message":"Author Deleted.!"},status=status.HTTP_200_OK)

class imageListView(APIView):
    @JWT_Required
    def get(self,request,id=None):
        data=get_image()
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
        post_image(image_path,data["image_name"])
        return Response({"success":"Image posted..!"},status=status.HTTP_103_EARLY_HINTS)
    
    # def put(self,request,id):
    #     serial = ImageSerializer(data=request.data)
    #     serial.is_valid()
    #     data=serial.validated_data
    #     # image_file = data.get("image_file")
    #     # image_name=data.get("image_name")
    #     update_image(id,data.get("image_file"),data.get("image_name"))
    #     return Response({"Detail":"Updated Succsessfully..!"},status=status.HTTP_202_ACCEPTED)


    def delete(self,request,id):
        delete_image(id)
        return Response({"detail":"image Delated..!"},status=status.HTTP_200_OK)
    

 #    image=request.FILES.get('user_image')
                        #    image_path =''
                        
                        #    if image:
                        #         image_path = 'users/' + image.name
                        #         full_path = os.path.join(settings.MEDIA_ROOT, image_path)
                        #         os.makedirs(os.path.dirname(full_path), exist_ok=True)

                        #         with open(full_path, 'wb+') as destination:
                        #             for chunk in image.chunks():
                        #                 destination.write(chunk)
