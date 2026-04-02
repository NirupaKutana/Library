from rest_framework import serializers
class RoleRightsSerializer(serializers.Serializer):
      id = serializers.IntegerField(required=False)
      role_id=serializers.IntegerField()
      permission_id=serializers.IntegerField()

class RoleSerializer(serializers.Serializer):
     role_id =serializers.IntegerField(required=False)
     role_name=serializers.CharField(max_length=250)
     description=serializers.CharField(max_length=300)

class RightSerializer(serializers.Serializer):
     permission_id = serializers.IntegerField(required=False)
     permission_name=serializers.CharField(max_length=250)
     description=serializers.CharField(max_length=300)