# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic


CHOICES = (
    ('a', _(u'Approve')),
    ('n', _(u'Neutral')),
    ('d', _(u'Disapproves'))
)


class Calificar(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(null=True)
    active = models.BooleanField(default=True)
    approval_type = models.CharField(max_length=1, choices=CHOICES)
    total_approve = models.PositiveIntegerField(default=0)
    total_neutral = models.PositiveIntegerField(default=0)
    total_disapprove = models.PositiveIntegerField(default=0)
    object_id = models.BigIntegerField()
    content_type = models.ForeignKey(ContentType)
    content_object = generic.GenericForeignKey('content_type', 'object_id')
