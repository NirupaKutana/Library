from django.http import JsonResponse
from libApp.utils.jwt_utils import decode_token
import jwt

class JWTAuthenticationMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response
    def __call__(self, request):
        open_url=['/login/','/SignUp/']
        if request.path in open_url:
            return self.get_response(request)
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return JsonResponse({"error":"Token Missing"},status=401)
        try:
           token =auth_header.split(" ")[1]
           payload=decode_token(token)
           request.user_id=payload["user_id"]
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token Expired"},status=401)
        
        except:
            return JsonResponse({"error":"invalid Token"},status=401)
        return self.get_response(request)