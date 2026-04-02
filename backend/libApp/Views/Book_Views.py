from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.response import Response
from libApp.service import Book_service,Audit_service
from libApp.Serializer import Book_Serializer
from libApp.utils.jwt_utils import admin_reqired
# ---------------------------------------Books-------------------------------------------------------------
class bookListView(APIView):
    # permission_classes = [IsJWTAuthenticated]
    # @admin_reqired
    def get(self,request):
        data = Book_service.get_all_books()
        # serial = Book_Serializer.BookResponseSerializer(data,many=True)
        return Response(data,status=status.HTTP_200_OK)
   
    def post(self,request):
        serial = Book_Serializer.BookCreateSerializer(data = request.data)
        serial.is_valid(raise_exception=True)
        data = serial.validated_data
        msg = Book_service.post_update_book('post',None,data["book_name"],data["category_id"],data["author_id"],data["book_page"],data["copies"],None,None)
        Audit_service.insert_audit_log(2,"create","BOOK","Create new book")
        return Response({"success":"Book added sucessfully..!"},status=status.HTTP_201_CREATED)
       
    def put(self,request,id):
        serial =Book_Serializer.BookUpdateSerializer(data=request.data)
        serial.is_valid(raise_exception=True)
        data=serial.validated_data
        Book_service.post_update_book('update',id,data["book_name"],data["category_id"],
                    data["author_id"],data["book_page"],data["copies"],data["updated_by"],data["update_reason"])
      
        Audit_service.insert_audit_log(2,"update","BOOK","updated book.")
        return Response({"success":"Data Updated sucessfully..!"},status=status.HTTP_202_ACCEPTED)
       
    def delete(self,request,id):
        Book_service.delete_book(id)
        Audit_service.insert_audit_log(2,"deleted","BOOK",f"book deleted")
        return Response({"Detail":"book Deleted.!"},status=status.HTTP_200_OK)
    
class bookSearchView(APIView):
      def get(self,request):
        #   serial = BooksSerializer(data=request.data)
        #   serial.is_valid()
        #   data = serial.validated_data
          name=request.GET.get("name","")
          data=Book_service.search_book(name)
          return Response(data,status=status.HTTP_200_OK)