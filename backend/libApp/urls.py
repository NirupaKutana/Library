from django.contrib import admin
from django.urls import path,include
from libApp import views
from libApp.Views import Book_Views,Category_Views,Author_Views,Image_Views 
from libApp.Views import Login_Views,Issue_View,Audit_Views,RoleRights_Views 
from libApp.Views import File_View ,membership_View
urlpatterns = [
    path("",Login_Views.test_api),
    path("getusers/",Login_Views.getUsersListView.as_view()),
    path("user/",Login_Views.RegisterListView.as_view()),
    path("register/librarian/",Login_Views.LibrarianRegisterView.as_view()),
    path("register/librarian/<int:id>/",Login_Views.LibrarianRegisterView.as_view()),

    path("user/<int:id>/",Login_Views.RegisterListView.as_view()),
    path("verify-email/<str:token>/",Login_Views.VerifyEmailview.as_view()),
    path("check-verification/", Login_Views.CheckVerificationView.as_view()),
    path("resend-verify/", Login_Views.ResendEmailView.as_view()),
    path("session/verify/",Login_Views.VerifyPasswordView.as_view()),

    path("login/",Login_Views.LoginListView.as_view()),
    path("token/refresh/",Login_Views.RefreshTokenView.as_view()),
  
    path("forgot/",Login_Views.ForgotPasswordView.as_view()),
    path("reset/",Login_Views.ResetPasswordView.as_view()),
  
    

    path("book/",Book_Views.bookListView.as_view()),
    path("book/delete/<int:id>/",Book_Views.bookListView.as_view()),
    path("book/update/<int:id>/",Book_Views.bookListView.as_view()),
    path("search/book/",Book_Views.bookSearchView.as_view()),

    path("issue/",Issue_View.IssueBookView.as_view()),
    path("issue/search/",Issue_View.IssueSearchView.as_view()),
    path("issue/user/<int:id>/",Issue_View.IssueUserViewList.as_view()),
    path("issue/overdue/",Issue_View.OverdueListView.as_view()),
    path("overdue/mail/",Issue_View.SendOverdueMailListView.as_view()),
    path("return/",Issue_View.ReturnBookView.as_view()),



    path("category/",Category_Views.categoryListView.as_view()),
    path("category/delete/<int:id>/",Category_Views.categoryListView.as_view()),
    path("category/update/<int:id>/",Category_Views.categoryListView.as_view()),
    path("cat/filter/",Category_Views.categorySearchView.as_view()),
   


    path("author/",Author_Views.authorListView.as_view()),
    path("author/delete/<int:id>/",Author_Views.authorListView.as_view()),
    path("author/update/<int:id>/",Author_Views.authorListView.as_view()),


    path("image/",Image_Views.imageListView.as_view()),
    path("image/<int:id>/",Image_Views.imageListView.as_view()),
    path("image/update/<int:id>/",Image_Views.imageListView.as_view()),
    path("image/pag/",Image_Views.imgPaginationView.as_view()),

    path("contactUs/",Login_Views.contactUsListView.as_view()),

    path("chart/",Audit_Views.ChartViewList.as_view()),
    path("user/report/<int:id>/",Audit_Views.UserReportView.as_view()),
    
    path("audit/",Audit_Views.AuditListView.as_view()),
    path("LoginAudit/",Audit_Views.LoginAuditListView.as_view()),
    path("search/LoginAudit/",Audit_Views.SearchUserLoginAuditView.as_view()),

    path("usAudit/",Audit_Views.UserAuditPDFView.as_view()),
    path("filter/Audit/",Audit_Views.FilterAuditView.as_view()),
    path("audit/pdf/",Audit_Views.FilterAuditPDFview.as_view()),

    path("role/",RoleRights_Views.RoleListView.as_view()),
    path("right/",RoleRights_Views.RightsListView.as_view()),
    path("right/<int:id>/",RoleRights_Views.RightsListView.as_view()),

    path("role/rights/",RoleRights_Views.RoleRightsListView.as_view()),
    path("role/rights/<int:id>/",RoleRights_Views.RoleRightsListView.as_view()),

    path('file/',File_View.FileListView.as_view()),
    path('file/<int:id>/',File_View.FileListView.as_view()),
    # path('file/del/<int:id>/',File_View.FileListView.as_view()),

     path('membership/plan/',membership_View.MembershipListView.as_view()),
     path('user/plan/',membership_View.CreateMembershipView.as_view()),
     path('user/plan/<int:id>/',membership_View.CreateMembershipView.as_view()),

    #  path('get/plan/',membership_View.UserMembershipView.as_view()),
     

]

