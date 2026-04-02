from rest_framework import serializers
class ImageSerializer(serializers.Serializer):
    image_id = serializers.IntegerField(required=False)
    image_file =serializers.ImageField()
    image_name=serializers.CharField(max_length=200)
    image_pdf = serializers.FileField()