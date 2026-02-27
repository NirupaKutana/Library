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
    path("issue/search/",views.IssueSearchView.as_view()),
    path("issue/user/<int:id>/",views.IssueUserViewList.as_view()),
    path("issue/overdue/",views.OverdueListView.as_view()),
    path("overdue/mail/",views.SendOverdueMailListView.as_view()),


    path("",views.test_api),
    path("user/",views.RegisterListView.as_view()),
    path("verify-email/<str:token>/",views.VerifyEmailview.as_view()),
    path("check-verification/", views.CheckVerificationView.as_view()),
    path("resend-verify/", views.ResendEmailView.as_view()),
    path("user/<int:id>/",views.RegisterListView.as_view()),
    path("getusers/",views.getUsersListView.as_view()),

    path("book/",views.bookListView.as_view()),
    path("book/delete/<int:id>/",views.bookListView.as_view()),
    path("book/update/<int:id>/",views.bookListView.as_view()),
    path("search/book/",views.bookSearchView.as_view()),

    path("category/",views.categoryListView.as_view()),
    path("category/delete/<int:id>/",views.categoryListView.as_view()),
    path("category/update/<int:id>/",views.categoryListView.as_view()),
    path("cat/filter/",views.categorySearchView.as_view()),
   


    path("author/",views.authorListView.as_view()),
    path("author/delete/<int:id>/",views.authorListView.as_view()),
    path("author/update/<int:id>/",views.authorListView.as_view()),


    path("image/",views.imageListView.as_view()),
    path("image/<int:id>/",views.imageListView.as_view()),
    path("image/update/<int:id>/",views.imageListView.as_view()),
    path("image/pag/",views.imgPaginationView.as_view()),

    path("contactUs/",views.contactUsListView.as_view()),

    path("chart/",views.ChartViewList.as_view()),
    path("user/report/<int:id>/",views.UserReportView.as_view()),

    path("audit/",views.AuditListView.as_view()),
    path("LoginAudit/",views.LoginAuditListView.as_view()),
    path("search/LoginAudit/",views.SearchUserLoginAuditView.as_view()),

    path("usAudit/",views.UserAuditPDFView.as_view()),
    path("filter/Audit/",views.FilterAuditView.as_view()),
    path("audit/pdf/", views.FilterAuditPDFview.as_view()),


]

