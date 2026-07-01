from django.urls import path
from .views import RegisterView, UserListView, GoogleLoginView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('list/', UserListView.as_view()),
    path('google-login/', GoogleLoginView.as_view()),
    path('profile/', UserProfileView.as_view()),
]
