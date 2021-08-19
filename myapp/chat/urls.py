from django.urls import path
from . import views

urlpatterns = [
    # LOGIN
    path('api/login', views.login, name='login'),

    path('api/register', views.register, name='register'),


    # MESSAGES
    path('api/latest-messages/<int:logged_user>/<int:selected_user>',
         views.latest_messages, name='latest-messages'),

    path('api/messages/<int:sender>/<int:receiver>',
         views.message_list, name='message-detail'),

    path('api/messages/', views.message_list, name='message-list'),

    path('api/delete-message/<int:message_id>/<int:sender>/<int:receiver>',
         views.delete_message, name='delete-message'),

    # LIKE
    path('api/messages/like', views.like_action, name='message-list'),

    # NOTIFICATIONS
    path('api/notification/<int:logged_user>/<int:selected_user>',
         views.get_notification_status, name='notification-status'),


    # USERS
    path('api/newusers/<int:pk>', views.new_users, name='new-users'),

    path('api/users/<int:logged_user_id>/<int:pk>',
         views.user_list, name='user-detail'),

    path('api/users/<int:logged_user_id>',
         views.user_list, name='user-list-logged'),

    path('api/users/', views.user_list, name='user-list'),

    path('api/search-users/<str:query>',
         views.search_users, name='search-users'),
]
