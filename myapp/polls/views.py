from .models import Question
from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets
from .serializers import QuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('id')
    serializer_class = QuestionSerializer