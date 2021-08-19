from django.contrib.auth.models import User
from django.db.models import fields
from rest_framework import serializers
from chat.models import Message, NewMessageNotification


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'id', 'first_name', 'last_name']


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(
        many=False, slug_field='id', queryset=User.objects.all())
    receiver = serializers.SlugRelatedField(
        many=False, slug_field='id', queryset=User.objects.all())

    timestamp = serializers.SerializerMethodField()

    def get_timestamp(self, obj):
        datetime = obj.timestamp.isoformat().split('.')[0]
        datetime = datetime.split('T')

        time = datetime[1]
        date = datetime[0].split('-')[::-1]
        date = "-".join(date)

        return time + ' ' + date

    class Meta:
        model = Message
        fields = ['sender', 'receiver', 'message', 'timestamp', 'id', 'like']


class NewMessageNotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(
        many=False, slug_field='username', queryset=User.objects.all())
    receiver = serializers.SlugRelatedField(
        many=False, slug_field='username', queryset=User.objects.all())

    class Meta:
        model = NewMessageNotification
        fields = ['sender', 'receiver', 'has_new_message']
