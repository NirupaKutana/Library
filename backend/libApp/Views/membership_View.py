from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from libApp.service import Membership_service
from libApp.Serializer import Book_Serializer

class MembershipListView(APIView) :
    def get(self,request):
        data = Membership_service.get_membership_plans()
        return Response(data,status=status.HTTP_200_OK)

    def post(self,request):
        data = Membership_service.expire_plan()
        return Response(data,status=status.HTTP_200_OK)

class CreateMembershipView(APIView):
    def get(self,request,id):
        # user_id=request.data.get("user_id")
        data= Membership_service.get_user_membership(id)
        return Response(data,status=200)
    
    def post(self,request,id=None):
        user_id = request.data.get('user_id')
        plan_id = request.data.get('plan_id')
        data =Membership_service.buy_membership(user_id,plan_id)
        return Response({"success":data})
    

    
    