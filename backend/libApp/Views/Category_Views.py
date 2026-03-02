from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import Category_service ,Audit_service 
from libApp.serialize import CategorySerializer

# ---------------------------------------Category-------------------------------------------------------------
class categoryListView(APIView):
    def get(self,request,id=None) :
        data =Category_service.get_all_category()
        return Response(data, status=status.HTTP_200_OK)
    
    def post(self,request) :
        serial = CategorySerializer(data = request.data)
        serial.is_valid()
        data = serial.validated_data
        if not data["category_name"]:
            return Response({"error":"categoy name required"})
        Category_service.post_update_category('post',None,data["category_name"])
        Audit_service.insert_audit_log(2,"create","CATEGORY","Create new Category")
        return Response({"Detail":"Data inserted sucessfully"}, status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=CategorySerializer(data=request.data)
        serial.is_valid()
        data = serial.validated_data
        if not data["category_name"]:
            return Response({"error":"categoy name required"})
        Category_service.post_update_category('update',id,data["category_name"])
        Audit_service.insert_audit_log(2,"Update","CATEGORY","Updated Category")
        return Response({"Detail":"Category Update sucessfully"},status=status.HTTP_202_ACCEPTED)
    
    def delete(self,request,id):
        Category_service.delete_category(id)
        Audit_service.insert_audit_log(2,"deleted","CATEGORY","deleted Category")
        return Response({"Detail":"Category deletd.!"},status=status.HTTP_200_OK)
    
class categorySearchView(APIView):
    def get(self,request):
        name = request.GET.get("name","")
        data= Category_service.cat_search(name)
        return Response(data,status=status.HTTP_200_OK)