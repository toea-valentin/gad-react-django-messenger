from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from rest_framework.parsers import JSONParser
from chat.models import Message, NewMessageNotification
from chat.serializers import MessageSerializer, UserSerializer, NewMessageNotificationSerializer
from django.db.models import Q, F

# User Views
@csrf_exempt
def login(request):
    '''
    POST: Creates a new user object and saves it to DB
    '''
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user_object = authenticate(
            username=data['username'], password=data["password"])

        user = User.objects.filter(id=user_object.id)
        serializer = UserSerializer(
            user, many=True, context={'request': request})

        print(serializer.data)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def register(request):
    '''
    POST: Creates a new user object and saves it to DB
    '''
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user = User.objects.create_user(
            username=data['username'], email='', password=data['password'], last_name=data['last_name'], first_name=data['first_name'])
        user.save()

        serializer = UserSerializer(
            user, context={'request': request})

        print(serializer.data)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def search_users(request, query):
    '''
    GET: Returns users whose first names, last names and usernames contain the query string
    '''
    if request.method == 'GET':
        users = User.objects.filter(Q(first_name__icontains=query) |
                                    Q(last_name__icontains=query) | Q(username__icontains=query))

        serializer = UserSerializer(
            users, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def user_list(request, logged_user_id=None, pk=None):
    '''
    GET: Lists all users or a certain user
    POST: Creates a new user
    '''
    if request.method == 'GET':
        if pk:
            users = User.objects.filter(id=pk)
        elif logged_user_id:
            # Remove the logged user from list
            users = User.objects.filter(~Q(id=logged_user_id))
        else:
            # Get all users regardless anything
            users = User.objects.all()

        serializer = UserSerializer(
            users, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def new_users(request, pk=None):
    '''
    GET: Returns all new users based on the value of the id
    '''
    if request.method == 'GET':
        if pk:
            users = User.objects.filter(id__gt=pk)
        else:
            users = User.objects.all()

        serializer = UserSerializer(
            users, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

# End - User Views


# Notification Views
@csrf_exempt
def get_notification_status(request, logged_user, selected_user):
    '''
    GET: Notification for new messages (a notification is set to true 
                                        if a user has new messages from other user)
    '''
    if request.method == 'GET':
        notifications = NewMessageNotification.objects.filter(
            sender_id=logged_user, receiver_id=selected_user)

        serializer = NewMessageNotificationSerializer(
            notifications, many=True, context={'request': request})

        return JsonResponse(serializer.data, safe=False)


def set_notification_status(logged_user, selected_user, status):
    notification = NewMessageNotification.objects.filter(
        sender_id=selected_user, receiver_id=logged_user)

    obj, created = NewMessageNotification.objects.update_or_create(
        sender_id=selected_user, receiver_id=logged_user,
        defaults={'sender_id': selected_user, 
                'receiver_id': logged_user,
                'has_new_message': status}
    )

    '''
    if not len(notification):
        # Create new notification bond
        sender_user = User.objects.get(id=logged_user)
        receiver_user = User.objects.get(id=selected_user)
        NewMessageNotification.objects.create(
            sender=sender_user, receiver=receiver_user, has_new_message=status)
    elif len(notification):
        # Update the state of the notification
        notification.update(has_new_message=status)
    '''

# End - Notification Views


# Message Views
def update_seen_messages(sender, receiver):
    messages = Message.objects.filter(Q(sender_id=sender),
                                      Q(receiver_id=receiver))
    messages.update(is_read=True)


@csrf_exempt
def message_list(request, sender=None, receiver=None):
    '''
    GET: Lists all required messages between 2 users
    POST: Creates a new message
    '''
    if request.method == 'GET':
        if sender is not None and receiver is not None:
            messages = Message.objects.filter(Q(sender_id=sender) | Q(sender_id=receiver),
                                              Q(receiver_id=sender) | Q(
                                                  receiver_id=receiver),
                                              ~Q(receiver_id=F('sender_id')))

        elif sender is None and receiver is None:
            messages = Message.objects.all()

        serializer = MessageSerializer(
            messages, many=True, context={'request': request})

        set_notification_status(receiver, sender, False)

        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = MessageSerializer(data=data)

        if serializer.is_valid():
            # When a message is sent it gets saved, and then a notification is added
            serializer.save()
            set_notification_status(data['sender'], data['receiver'], True)

            return JsonResponse(serializer.data, status=201)

        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def delete_message(request, message_id, sender, receiver):
    '''
    DELETE: removes a message and sets notification for the other user
    '''
    if request.method == 'DELETE':
        try:
            message = Message.objects.get(Q(id=message_id))
            print(message)
            message.delete()
            set_notification_status(sender, receiver, True)
            return JsonResponse({'response': 'success'}, status=201)
        except:
            return JsonResponse({'response': 'error'}, status=400)


@csrf_exempt
def latest_messages(request, logged_user=None, selected_user=None):
    '''
    GET: gets all the latest messages from a user that are unread
    '''
    if request.method == 'GET':
        messages = Message.objects.filter(Q(receiver_id=logged_user),
                                          Q(sender_id=selected_user)).filter(is_read=False)

        serializer = MessageSerializer(
            messages, many=True, context={'request': request})

        return JsonResponse(serializer.data, safe=False)
# End - Message Views


# Like Views
@csrf_exempt
def like_action(request):
    '''
    POST: Add like to a message and notify the receiver
    '''
    if request.method == 'POST':
        data = JSONParser().parse(request)
        sender = data['sender']
        receiver = data['receiver']
        message_id = data['message_id']
        like_value = data['like_value']

        messages = Message.objects.filter(Q(id=message_id))

        messages.update(like=like_value)

        set_notification_status(receiver, sender, True)

        return JsonResponse({'response': 'success'}, safe=False, status=201)


# End - Like Views