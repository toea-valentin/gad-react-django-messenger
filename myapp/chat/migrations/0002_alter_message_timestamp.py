# Generated by Django 3.2.6 on 2021-08-17 10:49

import chat.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='timestamp',
            field=chat.models.CustomDateTimeField(auto_now_add=True),
        ),
    ]
