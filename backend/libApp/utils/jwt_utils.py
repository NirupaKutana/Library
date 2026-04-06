import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from datetime import datetime,timedelta,timezone
from django.conf import settings
from django.http import JsonResponse
from functools import wraps
from django.core.mail import send_mail


SECRET_KEY = settings.SECRET_KEY

def generate_access_token(user_id,email,roles,permissions):
    payload={
        "user_id":user_id,
        "user_email":email,
        "role":roles,
        "permissions":permissions,
        "type":"access",
        'exp' :datetime.now(timezone.utc) +timedelta(minutes=2),
        'iat' :datetime.now(timezone.utc)
    }
    return jwt.encode(payload,SECRET_KEY,algorithm='HS256')
def generate_refresh_token(user_id,email,roles,permissions):
    payload={
         "user_id":user_id,
         "user_email":email,
         "role":roles,
         "permissions":permissions,
         "type":"refresh",
         'exp' :datetime.now(timezone.utc) +timedelta(days=7),
         'iat' :datetime.now(timezone.utc)
    }
    return jwt.encode(payload,SECRET_KEY,algorithm='HS256')

def decode_token(token):
    return jwt.decode(token,SECRET_KEY,algorithms=['HS256'])


class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        # print("HEADERS:", auth_header)
        if (not auth_header):
            raise AuthenticationFailed( {"detail": "Token Expired"},code=401)
        # print("hiiiiiiii\n\n")
        parts  = auth_header.split(" ")
        # print("\n\n\n parts",parts)
        if len(parts) != 2 or parts[0] != "Bearer":
            raise AuthenticationFailed("Invalid Authorization header")

        token = parts[1]
        # print("token",token)
        try:
            
            payload = decode_token(token)
            # print("payload" ,payload)
            if payload.get("type") != "access":
                raise AuthenticationFailed("Invalid token type")

            request.user_id = payload["user_id"]

            return (payload["user_id"], token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token Expired")

        except Exception:
            raise AuthenticationFailed("Invalid Token")
        

# def JWT_Required(method):
#     def wrapper(self,request ,*args, **kwargs):
#         auth_header=request.headers.get("Authorization")

#         if not auth_header:
#             return JsonResponse({"error":"Token Missing"},status=401)
#         try :
#             token=auth_header.split(" ")[1]
#             payload = decode_token(token)
#             if payload.get("type") != "access":
#                 return JsonResponse({"error":"Invalid token type"},status=401)
#             request.user_id=payload["user_id"]
#         except jwt.ExpiredSignatureError:
#             return JsonResponse({"error": "Token Expired","code": "TOKEN_EXPIRED"}, status=401)
#         except Exception:
#             return JsonResponse({"error": "Invalid Token"}, status=401)
#         return method(self,request,*args, **kwargs)
#     return wrapper

def admin_reqired(method):
    @wraps(method)
    def wrapper(self,request,*args, **kwargs):
        auth_header=request.headers.get("Authorization")
        if not auth_header:
            return JsonResponse({"error":"Token Missing"},status=401)
        
        token=auth_header.split(" ")[1]
        payload = decode_token(token)
        if payload.get("role")!='ADMIN' :
            return JsonResponse({"error":"Admin access required"},status=403)
        request.user=payload
        return method(self,request,*args, **kwargs)
    return wrapper



def send_overdue_email(user_email, user_name, book_name, due_date, fine):
    
    subject = "📚 Book Overdue Notice - Library"
    
    message = f"""
Hello {user_name},

This is a reminder that the following book is overdue:

Book Name: {book_name}
Due Date: {due_date}
Current Fine: ₹{fine}

Please return the book as soon as possible to avoid additional charges.

Thank you,
Library Management
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
