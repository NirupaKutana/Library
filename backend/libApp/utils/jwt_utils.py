import jwt
from rest_framework.permissions import BasePermission
from datetime import datetime,timedelta,timezone
from django.conf import settings
from django.http import JsonResponse
from functools import wraps

SECRET_KEY = settings.SECRET_KEY

def generate_access_token(user_id,email,role):
    payload={
        "user_id":user_id,
        "user_email":email,
        "role":role,
        "type":"access",
        'exp' :datetime.now(timezone.utc) +timedelta(minutes=1),
        'iat' :datetime.now(timezone.utc)
    }
    return jwt.encode(payload,SECRET_KEY,algorithm='HS256')
def generate_refresh_token(user_id,email,role):
    payload={
         "user_id":user_id,
         "user_email":email,
         "role":role,
         "type":"refresh",
         'exp' :datetime.now(timezone.utc) +timedelta(days=7),
         'iat' :datetime.now(timezone.utc)
    }
    return jwt.encode(payload,SECRET_KEY,algorithm='HS256')

def decode_token(token):
    return jwt.decode(token,SECRET_KEY,algorithms=['HS256'])

def JWT_Required(method):
    def wrapper(self,request):
        auth_header=request.headers.get("Authorization")

        if not auth_header:
            return JsonResponse({"error":"Token Missing"},status=401)
        try :
            token=auth_header.split(" ")[1]
            payload = decode_token(token)
            if payload.get("type") != "access":
                return JsonResponse({"error":"Invalid token type"},status=401)
            request.user_id=payload["user_id"]
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token Expired","code": "TOKEN_EXPIRED"}, status=401)
        except Exception:
            return JsonResponse({"error": "Invalid Token"}, status=401)
        return method(self,request)
    return wrapper

def admin_reqired(method):
    @wraps(method)
    def wrapper(self,request):
        auth_header=request.headers.get("Authorization")
        if not auth_header:
            return JsonResponse({"error":"Token Missing"},status=401)
        
        token=auth_header.split(" ")[1]
        payload = decode_token(token)
        if payload.get("role")!='ADMIN' :
            return JsonResponse({"error":"Admin access required"},status=403)
        request.user=payload
        return method(self,request)
    return wrapper
