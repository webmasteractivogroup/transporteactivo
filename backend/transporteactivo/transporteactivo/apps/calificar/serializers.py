# # -*- coding: utf-8 -*-
from rest_framework import serializers

from .models import Calificar


class CalificarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Calificar
        fields = ('id', 'approval_type', 'total_approve', 'total_neutral', 'total_disapprove', 'comment', 'object_id')
