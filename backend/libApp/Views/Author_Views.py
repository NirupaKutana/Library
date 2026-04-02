from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import Author_service ,Audit_service
from libApp.Serializer import Author_Serializer

# ---------------------------------------authors-------------------------------------------------------------
class authorListView(APIView):
    # authentication_classes = [JWTAuthenticationMiddleware]
    def get(self,request,id=None):
        data=Author_service.get_all_author()
        # serial = Author_Serializer.AuthorResponseSerializer(data)
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        serial= Author_Serializer.AuthorCreateSerializer(data= request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        if not data["author_name"]:
            return Response({"error":"Author name required"})
        Author_service.post_update_author('post',None,data["author_name"])
        Audit_service.insert_audit_log(2,"create","AUTHOR","Create new Author")
        return Response({"success":"Author Inserted Sucessfully"},status=status.HTTP_201_CREATED)
    
    def put(self,request,id):
        serial=Author_Serializer.AuthorUpdateSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        if not data["author_name"]:
            return Response({"error":"Author name required"},status=status.HTTP_403_FORBIDDEN)
        Author_service.post_update_author('update',id,data["author_name"])
        Audit_service.insert_audit_log(2,"update","AUTHOR","Author Updated")
        return Response({"success":"Author Updated Sucssecfully"},status=status.HTTP_202_ACCEPTED)
 
    def delete(self,request,id):
        Author_service.delete_author(id)
        Audit_service.insert_audit_log(2,"deleted","AUTHOR","Author Deleted")
        return Response({"message":"Author Deleted.!"},status=status.HTTP_200_OK)