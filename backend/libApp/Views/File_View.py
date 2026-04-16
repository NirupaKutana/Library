from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import File_service
from libApp.Serializer.File_Serializer import FileReadSerializer
from libApp.utils.file_handler import save_file
from libApp.utils.delete_file import delete_file
class FileListView(APIView):
    def get(self,request,id=None):
        data = File_service.read_file()
        # serial = FileReadSerializer(data=data)
        # print(serial)
        # if serial.is_valid(raise_exception=True):
        return Response(data,status=200)
       
    def post(self,request,id=None):
        serial = FileReadSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        name= serial.validated_data["file_name"]
        image= request.FILES.get("file_image")
        pdf = request.FILES.get("file_pdf")

        img_path = save_file(image,"images") if image else None
        pdf_path = save_file(pdf,"pdfs") if pdf else None

        File_service.post_file(name,img_path,pdf_path)
        return Response({"success":"Created"},status=status.HTTP_200_OK)
    

    def put (self,request,id):
        old = File_service.read_one_file(id)
        # print("old:",old)
        # print(old[1])
        serial =FileReadSerializer(data=request.data,partial=True)
        serial.is_valid(raise_exception=True)
        name= serial.validated_data.get("file_name",old[1])
       
        img_path = old[2]
        pdf_path = old[3]
        img = request.FILES.get("file_image")
        if img:
            delete_file(old[2])
            img_path = save_file(img,"images") if img else None

        pdf = request.FILES.get("file_pdf")
        if pdf :
           delete_file(old[3])
           pdf_path = save_file(pdf,"pdfs")if pdf else None

        res=File_service.put_file(id,name,img_path,pdf_path)
        return Response({"success":"Updated..!"},status=200)

    # def put (self,request,id=None):
    #     serial =FileReadSerializer(data=request.data)
    #     serial.is_valid(raise_exception=True)
    #     data= serial.validated_data
    #     res=File_service.put_file(data["id"],data["file_name"],data["file_image"],data["file_pdf"])
    #     return Response({"success":res},status=200)

    def delete(self,request,id):
        res = File_service.del_file(id)
        return Response({"success":res},status=200)
