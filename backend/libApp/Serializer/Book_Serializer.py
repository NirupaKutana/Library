from rest_framework import serializers

class BooksSerializer(serializers.Serializer):
    book_id = serializers.IntegerField(required=False)
    book_name= serializers.CharField(max_length=100)
    category_id = serializers.IntegerField()
    author_id = serializers.IntegerField()
    book_page = serializers.IntegerField()
    copies = serializers.IntegerField()
    updated_by =serializers.IntegerField(required=False)
    update_reason =serializers.CharField(max_length=100,required=False)

class BookCreateSerializer(serializers.Serializer):
    book_name = serializers.CharField(max_length=100,
                                      error_messages={
                                    "required": "Book name is required.",
                                    "blank": "Book name cannot be empty.",
                                    "max_length": "Book name too long."})
    category_id = serializers.IntegerField()
    author_id = serializers.IntegerField()
    book_page = serializers.IntegerField()
    copies = serializers.IntegerField()

class BookUpdateSerializer(serializers.Serializer):
    book_name = serializers.CharField(max_length=100, required=False)
    category_id = serializers.IntegerField(required=False)
    author_id = serializers.IntegerField(required=False)
    book_page = serializers.IntegerField(required=False)
    copies = serializers.IntegerField(required=False)
    updated_by = serializers.IntegerField()
    update_reason = serializers.CharField(max_length=100)

class BookResponseSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    book_name = serializers.CharField()
    category_name = serializers.CharField()
    author_name = serializers.CharField()
    book_page = serializers.IntegerField()
    copies = serializers.IntegerField()
    avl_qty = serializers.IntegerField()