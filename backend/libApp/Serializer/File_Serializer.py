from rest_framework import serializers

class FileReadSerializer (serializers.Serializer):
    id = serializers.IntegerField(required=False)
    file_name = serializers.CharField(max_length=200)
    file_image = serializers.ImageField(required=False)
    file_pdf = serializers.FileField(required=False)
