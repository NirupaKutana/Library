from rest_framework import serializers
class CategorySerializer (serializers.Serializer):
    category_id=serializers.IntegerField(required=False)
    category_name=serializers.CharField(max_length =100)

class CategoryCreateSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=100)

class CategoryUpdateSerializer(serializers.Serializer):
    category_name = serializers.CharField(max_length=100,required=False)