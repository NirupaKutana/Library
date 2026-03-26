import os
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import Image_service ,Audit_service
from libApp.serialize import ImageSerializer
from libApp.utils.jwt_utils import JWT_Required

# ---------------------------------------ImageView-------------------------------------------------------------

class imageListView(APIView):
    @JWT_Required
    def get(self,request,id=None):
        data=Image_service.get_image()
        return Response(data,status=status.HTTP_200_OK)

    @JWT_Required
    def post(self,request):
        serial=ImageSerializer(data=request.data)
        if serial.is_valid() :
            data=serial.validated_data
            
            image_path='' 
            pdf_path = ''

            image = request.FILES.get("image_file")
            if image :
                image_path = 'demo/'+image.name
                full_path = os.path.join(settings.MEDIA_ROOT,image_path)
                os.makedirs(os.path.dirname(full_path),exist_ok=True)

                with open(full_path, 'wb+') as destination:
                    for chunk in image.chunks():
                        destination.write(chunk)

            pdf = request.FILES.get("image_pdf")
            
            if pdf :
                pdf_path='demo/' + pdf.name
                full_pdf_path = os.path.join(settings.MEDIA_ROOT,pdf_path)
                os.makedirs(os.path.dirname(full_pdf_path),exist_ok=True)

                with open(full_pdf_path,'wb+') as destination:
                    for chunk in pdf.chunks():
                        destination.write(chunk)

            Image_service.post_image(image_path,data["image_name"],pdf_path)
            Audit_service.insert_audit_log(2,"create","Image","Image Upload")
            return Response({"success":"Image posted..!"},status=status.HTTP_200_OK)
        return Response(serial.errors, status=400)

   
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