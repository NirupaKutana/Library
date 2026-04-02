from rest_framework import serializers



class UserSerializer(serializers.Serializer):
    user_id=serializers.IntegerField(required=False)
    # user_image=serializers.ImageField(required=False)
    user_name=serializers.CharField(max_length=200)
    user_email=serializers.EmailField(required=False)
    user_password=serializers.CharField(required=False)

class LoginSerializer(serializers.Serializer):
    user_email=serializers.EmailField()
    user_password=serializers.CharField(max_length=200)

class ContactSerializer(serializers.Serializer):
    contact_id = serializers.IntegerField(required=False)
    contact_name=serializers.CharField(max_length=100)
    contact_email=serializers.EmailField(max_length=100)
    contact_msg=serializers.CharField(max_length=400)