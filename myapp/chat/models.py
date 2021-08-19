from django.contrib.auth.models import User
from django.db import models


class CustomDateTimeField(models.DateTimeField):
    def value_to_string(self, obj):
        val = self.value_from_object(obj)
        if val:
            val.replace(microsecond=0)
            return val.isoformat()
        return ''


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='receiver')
    message = models.CharField(max_length=1200)
    timestamp = CustomDateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    like = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.message

    class Meta:
        ordering = ('timestamp',)


class NewMessageNotification(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sender_notif')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='receiver_notif')
    has_new_message = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.has_new_message
