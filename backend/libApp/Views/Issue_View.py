from datetime import datetime
from datetime import timedelta
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from datetime import datetime
from libApp.utils import jwt_utils
from libApp.service import Issue_service ,Audit_service ,Membership_service
from libApp.Serializer.Issue_Serializer import IssueBookSerializer 
from django.db import connection
# ---------------------------------------ISSUE BOOK-------------------------------------------------------------
class IssueBookView(APIView):
    def get(self,request):
        data = Issue_service.get_all_issue_book_detail()
        if not data:
            return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)
    
    def post(self,request):
        user_id = request.data.get("user_id")
        book_ids = request.data.get("book_ids", [])
        issue_date =request.data.get("issue_date")
        max_books = 3
        issue_days = 7
        fine_discount = 0
        #id=request.GET.get("id","")
        membership = Membership_service.get_user_membership(user_id)
        print("user_id",user_id)
        print("membership",membership)
        if membership:
            membership = membership[0] 
            max_books = membership[1] if membership[1] != -1 else 9999  # unlimited
            issue_days = membership[2]
            fine_discount = membership[3]
        else:
            print("No membership found, using default")
        due_date = datetime.now() + timedelta(days=issue_days)
        is_overdue =Issue_service.check_overdue(user_id)
        if is_overdue:
          return Response({"error": "User has overdue book. Cannot issue new book."},status=status.HTTP_403_FORBIDDEN)
        
        if not user_id :
             return Response({"error": "Not user selected"},status=status.HTTP_403_FORBIDDEN)
        
        if not book_ids :
             return Response({"error": "Not book selected"},status=status.HTTP_403_FORBIDDEN)
        
        if not issue_date :
             return Response({"error": "Issue Date id required"},status=status.HTTP_403_FORBIDDEN)
       
        
        current_books = Issue_service.get_user_active_book_count(user_id)
        print(current_books)
        if (current_books + len(book_ids)) > max_books:
            return Response({"error": f"Limit exceeded. You already have {current_books} books.Max allowed is {max_books}"}, 
                             status=403)
       
        for book_id in book_ids :
          qty = Issue_service.get_available_qty(book_id)
          if not qty or qty[0] <= 0:
            return Response({"error": f"Book ID {book_id} is not available"},status=status.HTTP_403_FORBIDDEN)

        for book_id in book_ids: 
          Issue_service.update_qty(book_id)
          Issue_service.post_book_issue(user_id,book_id,issue_date,due_date)  
          Audit_service.insert_audit_log(2,"create","Issue",f"Issued book")
        return Response({"success":"Book issued successfully"})

class IssueUserViewList(APIView):
    def get(self,request,id):
        data=Issue_service.get_issue_user_detail(id)
        if not data:
            return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)
    
class IssueSearchView(APIView):
    def get(self,Request):
        u_name = Request.GET.get("name","")
        data = Issue_service.get_issue_search(u_name)
        # if not data:
        #     return Response([], status=status.HTTP_200_OK)
        return Response(data,status=status.HTTP_200_OK)

class OverdueListView(APIView):
    def get(self,request):   
       data = Issue_service.get_overdue_list()
       return Response(data,status=status.HTTP_200_OK)

class SendOverdueMailListView(APIView):
    def get(self,request):
        data =Issue_service.send_overdue_mail()
        overdue_book = data
        for book in overdue_book:
          jwt_utils.send_overdue_email(
            book[1],
            book[2],
            book[3],
            book[5],
            book[8]
        )
        return Response({"message": "Emails sent"})
    
# ---------------------------------------RETERN BOOK-------------------------------------------------------------
class ReturnBookView(APIView):
    def post(self,request):
        issue_id = request.data.get("issue_id")
        data = Issue_service.get_book_id_to_return(issue_id)
        if not data:
            return Response({"error":"Invalid issue record"},status=400)
        book_id = data[0]
        Issue_service.update_book_issue(issue_id)
        Issue_service.update_book_return(book_id)
        Audit_service.insert_audit_log(2,"return","Book Return",f"Book returned")
        return Response({"message": "Book returned successfully"})