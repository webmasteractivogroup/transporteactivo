# # -*- coding: utf-8 -*-
from rest_framework import serializers

from .models import Calificar
from sgco.models import Stops, Lines


class ApprovalTypeField(serializers.Field):

    def to_native(self, obj):
        if obj == 'a':
            return 'positivo'
        elif obj == 'n':
            return 'comentario'
        elif obj == 'd':
            return 'negativo'


class ObjectName(serializers.Field):
    def to_native(self, obj):
        if isinstance(obj, Stops):
            return '%s' % obj.LONGNAME
        elif isinstance(obj, Lines):
            return '%s' % obj.SHORTNAME


class CalificarSerializer(serializers.ModelSerializer):
    id = serializers.Field(source='object_id')
    tipo = ApprovalTypeField(source='approval_type')
    total_positivos = serializers.Field(source='total_approve')
    total_comentarios = serializers.Field(source='total_neutral')
    total_negativos = serializers.Field(source='total_disapprove')
    comentario = serializers.Field(source='comment')
    nombre = ObjectName(source='content_object')

    class Meta:
        model = Calificar
        fields = ('id', 'tipo', 'total_positivos', 'total_comentarios', 'total_negativos', 'comentario', 'nombre')
