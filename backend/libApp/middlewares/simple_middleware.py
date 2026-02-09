from django.http import JsonResponse
from datetime import datetime
import logging
import time
logger =logging.getLogger('django')


class workingHoursMiddleware :
    def __init__(self,get_response):
        self.get_response= get_response
    def __call__(self, request):
        current_hr=datetime.now().hour

        if current_hr<9 or current_hr>=20:
            return JsonResponse (
                {"error":"Service is only avilable between 9 AM to 10PM"},status=403
                )
        respons = self.get_response(request)
        return respons

class RequestLoggingMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response
    def __call__(self, request):
        logger.info(f"Request :{request.method}{request.path}")
        respons=self.get_response(request)
        logger.info(f"Response:{respons.status_code}{request.path}")
        return respons

class MethodRestrictionMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response
    def __call__(self, request):
        allowed_method=['GET','POST','PUT','DELETE']
        if request.method not in allowed_method:
            return JsonResponse({'error':'method not allowed'},status=405)
        return self.get_response(request)
        
class  PerformanceMiddleware:
    def __init__(self,get_response):
        self.get_response=get_response
    def __call__(self, request):
        start = time.time()
        response =self.get_response(request)
        duration = time.time() - start
        logger.info(f"PERFORMANCE -> {request.path} took {duration :.2f}s")
        return response
          
