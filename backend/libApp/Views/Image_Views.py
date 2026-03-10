import os
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import Image_service ,Audit_service
from libApp.serialize import ImageSerializer


# ---------------------------------------ImageView-------------------------------------------------------------

class imageListView(APIView):
    # @JWT_Required
    def get(self,request,id=None):
        data=Image_service.get_image()
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
        Image_service.post_image(image_path,data["image_name"])
        Audit_service.insert_audit_log(2,"create","Image","Image Upload")
        return Response({"success":"Image posted..!"},status=status.HTTP_103_EARLY_HINTS)

    def delete(self,request,id):
        Image_service.delete_image(id)
        Audit_service.insert_audit_log(2,"delete","Image","Image Deleted")
        return Response({"detail":"image Delated..!"},status=status.HTTP_200_OK)
    

class imgPaginationView(APIView):
    def get(self,request):
        p_page=int(request.query_params.get('page',1))
        page_size=int(request.query_params.get('page_size',4))
        data=Image_service.image_pagination(p_page,page_size)
        return Response(data,status=status.HTTP_200_OK)