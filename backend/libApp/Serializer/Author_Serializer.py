from rest_framework import serializers

class AuthorResponseSerializer(serializers.Serializer):
    author_id = serializers.IntegerField(required=False)
    author_name = serializers.CharField(max_length=100)

class AuthorCreateSerializer(serializers.Serializer):
    author_name=serializers.CharField(max_length=100)

class AuthorUpdateSerializer(serializers.Serializer):
    author_name = serializers.CharField(required = False)
     