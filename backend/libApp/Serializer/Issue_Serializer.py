from rest_framework import serializers
class IssueBookSerializer(serializers.Serializer):
    issue_id = serializers.IntegerField(required=False)
    book_id = serializers.IntegerField(required=False)
    user_id = serializers.IntegerField(required=False)
    issue_date = serializers.DateTimeField(required=False)
    dua_date = serializers.DateTimeField(required=False)
    return_date = serializers.DateTimeField(required=False)
    status = serializers.CharField(required=False)