# from rest_framework import serializers

# class BooksSerializer(serializers.Serializer):
#     book_id = serializers.IntegerField(required=False)
#     book_name= serializers.CharField(max_length=100)
#     category_id = serializers.IntegerField()
#     author_id = serializers.IntegerField()
#     book_page = serializers.IntegerField()
#     copies = serializers.IntegerField()
#     updated_by =serializers.IntegerField(required=False)
#     update_reason =serializers.CharField(max_length=100,required=False)


# class IssueBookSerializer(serializers.Serializer):
#     issue_id = serializers.IntegerField(required=False)
#     book_id = serializers.IntegerField(required=False)
#     user_id = serializers.IntegerField(required=False)
#     issue_date = serializers.DateTimeField(required=False)
#     dua_date = serializers.DateTimeField(required=False)
#     return_date = serializers.DateTimeField(required=False)
#     status = serializers.CharField(required=False)

# class CategorySerializer (serializers.Serializer):
#     category_id=serializers.IntegerField(required=False)
#     category_name=serializers.CharField(max_length =100)
    
# class AuthorSerializer(serializers.Serializer):
#     author_id=serializers.IntegerField(required=False)
#     author_name=serializers.CharField(max_length=100)


# class UserSerializer(serializers.Serializer):
#     user_id=serializers.IntegerField(required=False)
#     # user_image=serializers.ImageField(required=False)
#     user_name=serializers.CharField(max_length=200)
#     user_email=serializers.EmailField(required=False)
#     user_password=serializers.CharField(required=False)

# class LoginSerializer(serializers.Serializer):
#     user_email=serializers.EmailField()
#     user_password=serializers.CharField(max_length=200)


# class ImageSerializer(serializers.Serializer):
#     image_id = serializers.IntegerField(required=False)
#     image_file =serializers.ImageField()
#     image_name=serializers.CharField(max_length=200)
#     image_pdf = serializers.FileField()

# class RoleRightsSerializer(serializers.Serializer):
#       id = serializers.IntegerField(required=False)
#       role_id=serializers.IntegerField()
#       permission_id=serializers.IntegerField()

# class RoleSerializer(serializers.Serializer):
#      role_id =serializers.IntegerField(required=False)
#      role_name=serializers.CharField(max_length=250)
#      description=serializers.CharField(max_length=300)

# class RightSerializer(serializers.Serializer):
#      permission_id = serializers.IntegerField(required=False)
#      permission_name=serializers.CharField(max_length=250)
#      description=serializers.CharField(max_length=300)

# class ContactSerializer(serializers.Serializer):
#     contact_id = serializers.IntegerField(required=False)
#     contact_name=serializers.CharField(max_length=100)
#     contact_email=serializers.EmailField(max_length=100)
#     contact_msg=serializers.CharField(max_length=400)