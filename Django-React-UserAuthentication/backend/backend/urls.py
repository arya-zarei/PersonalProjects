from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView ##pre-built reviews for access and refresh tokens for login

## url  paths for admin, registration, token and refresh
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name = "refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")), ## forward urls to api
]

