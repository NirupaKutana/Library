from django.contrib import admin
from django.urls import path,include
from libApp import views
urlpatterns = [
    path("login/",views.LoginListView.as_view()),
    path("token/refresh/",views.RefreshTokenView.as_view()),
  
    path("forgot/",views.ForgotPasswordView.as_view()),
    path("reset/",views.ResetPasswordView.as_view()),
    
    path("issue/",views.IssueBookView.as_view()),
    path("return/",views.ReturnBookView.as_view()),

    path("",views.test_api),
    path("user/",views.userListView.as_view()),
    path("user/<int:id>/",views.userListView.as_view()),
    

    path("book/",views.bookListView.as_view()),
    path("book/delete/<int:id>/",views.bookListView.as_view()),
    path("book/update/<int:id>/",views.bookListView.as_view()),
    path("search/book/",views.bookSearchView.as_view()),

    path("category/",views.categoryListView.as_view()),
    path("category/delete/<int:id>/",views.categoryListView.as_view()),
    path("category/update/<int:id>/",views.categoryListView.as_view()),
    path("cat/filter/",views.categorySearchView.as_view()),
    path("cat/",views.pageCategoryView.as_view()),


    path("author/",views.authorListView.as_view()),
    path("author/delete/<int:id>/",views.authorListView.as_view()),
    path("author/update/<int:id>/",views.authorListView.as_view()),


    path("image/",views.imageListView.as_view()),
    path("image/<int:id>/",views.imageListView.as_view()),
    path("image/update/<int:id>/",views.imageListView.as_view()),


]
