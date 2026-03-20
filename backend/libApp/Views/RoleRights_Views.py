from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import RoleRights_service
from libApp.serialize import RoleSerializer,RightSerializer,RoleRightsSerializer
class RoleListView(APIView):
    def post(self,request):
        role = request.data.get("role_name")
        des = request.data.get("description")
        RoleRights_service.post_role(role,des)
        return Response({"success":"Role Addedd Successfully"},status=status.HTTP_201_CREATED)
    
    def get(self,request):
        data=RoleRights_service.get_role()
        if not data :
            return Response({"error":"Data not found"},status=status.HTTP_403_FORBIDDEN)
        return Response(data,status=status.HTTP_200_OK)
    
class RightsListView(APIView):
    def post(self, request):
        right = request.data.get("permission_name")
        des = request.data.get("description")
        RoleRights_service.post_rights(right,des)
        return Response({"success":"Permission Addedd Successfully"},status=status.HTTP_201_CREATED)

    def get(self,requesr,id=None):
        data=RoleRights_service.get_rights()
        if not data :
            return Response({"error":"data not found"},status=status.HTTP_403_FORBIDDEN)
        return Response(data,status=status.HTTP_200_OK)
    
    def put(self,request,id):
        serial = RightSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data = serial.validated_data
        RoleRights_service.update_right(id,data["permission_name"],data["description"])
        return Response({"success":"Updated sucessfully..!"},status=status.HTTP_201_CREATED)
    
    def delete(self,request,id):
         RoleRights_service.delete_right(id)
         return Response({"message":"Right Deleted"},status=status.HTTP_200_OK)
 


class RoleRightsListView(APIView):
    def get(self,request,id):
        data = RoleRights_service.get_role_rights(id)
        if not data:
            return Response({"error":"data not found"},status=status.HTTP_403_FORBIDDEN)
        return Response(data,status=status.HTTP_200_OK)
        
    def post(self,request,id=None):
        r_id = request.data.get("role_id")
        p_ids = request.data.get("permission_ids",[])
        for p_id in p_ids:
          RoleRights_service.insert_role_rights(r_id,p_id)
        return Response({"success":"Role & Rights Addedd Successfully"},status=status.HTTP_201_CREATED)

    def put(self,request,id):
        RoleRights_service.grant_remove_rights(id)
        return Response({"success":"Right Updated"},status=status.HTTP_200_OK)