from django.urls import path
from .views import *

urlpatterns = [
    #path('', index, name='index'),
    path('login', ManagerSigninView.as_view()),
    path('register', ManagerSignupView.as_view()),
    path('forgetPassword', ManagerForgetPassword.as_view()),
    path('resetPassword', ManagerResetPassword.as_view()),
    path('logout', ManagerLogoutView.as_view()),
    path('venues', ManagerVenueView.as_view()),
    path('venues/<str:venue>', ManagerSingleVenueView.as_view()),
    path('venues/<str:venue>/<str:paper>', ManagerResearchPaperView.as_view()),
    path('venues/<str:venue>/<str:paper>/all', ManagerVenuesResearchPaperView.as_view()),
    path('paper/<str:paper>/comments', ManagerCommentsView.as_view()),
    path("profile/<str:user>", ManagerUserView.as_view()),
    path('review/<int:comment>/<str:data>', ManagerCommentLikeView.as_view()),
    path('chat/<str:paper>/messages', ManagerChatView.as_view()),
    path('subscribe/<str:venue>', ManagerSubscribeView.as_view()),
    path('notifications', ManagerNotificationsView.as_view()),
]