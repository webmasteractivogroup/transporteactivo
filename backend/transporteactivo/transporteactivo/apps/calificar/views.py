# -*- coding: utf-8 -*-
from django.contrib.contenttypes.models import ContentType

from rest_framework import viewsets
from rest_framework import mixins

from .models import Calificar
from .serializers import CalificarSerializer


class CalificarViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    model = Calificar
    serializer_class = CalificarSerializer

    def get_queryset(self):
        queryset = self.model.objects.all()
        object_id = self.request.QUERY_PARAMS.get('id', None)
        approval_type = self.request.QUERY_PARAMS.get('tipo', None)
        if object_id is not None:
            queryset = queryset.filter(object_id=object_id)
        if approval_type:
            queryset = queryset.filter(approval_type=approval_type)
        return queryset

    def pre_save(self, obj):
        model_name = self.request.DATA.get('model')
        object_id = self.request.DATA.get('object_id')
        model = ContentType.objects.get(model=model_name)
        content_object = model.get_object_for_this_type(pk=object_id)
        obj.content_object = content_object

    def post_save(self, obj, created=True):
        obj.total_approve = self.model.objects.filter(approval_type='a').count()
        obj.total_neutral = self.model.objects.filter(approval_type='n').count()
        obj.total_disapprove = self.model.objects.filter(approval_type='d').count()
        obj.save()
