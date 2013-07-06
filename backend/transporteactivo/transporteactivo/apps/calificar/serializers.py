# -*- coding: utf-8 -*-
from rest_framework import serializers
from rest_framework import mixins

from .models import Calificar



class CalificaViewSet(mixins.CreateModelMixin, mixins.ListModelMixin,)