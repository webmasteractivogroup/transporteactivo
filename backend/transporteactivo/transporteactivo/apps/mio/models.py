# -*- coding: utf-8 -*-
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

from sgco.models import Stops


class MioStops(Stops):
    location = models.PointField(null=True)
    tipo_parada = models.IntegerField(null=True)
    objects = models.GeoManager()

    def __unicode__(self):
        return u'%s, %s' % (self.STOPID, self.LONGNAME)

    def save(self, *args, **kwargs):
        self.location = Point(float(self.DECIMALLONGITUDE), float(self.DECIMALLATITUDE))
        super(MioStops, self).save(*args, **kwargs)


class TipoParada(models.Model):
    STOPID = models.IntegerField(primary_key=True,)
    STOPTYPE = models.IntegerField()

    class Meta:
        db_table = 'stop_types'
        managed = False

    def __unicode__(self):
        return u'%s, %s' % (self.STOPID, self.STOPTYPE)


class Busqueda(models.Model):
    nombre = models.IntegerField(primary_key=True)
    id = models.IntegerField()

    class Meta:
        db_table = 'search'
        managed = False

    def __unicode__(self):
        return u'%s, %s' % (self.nombre, self.id)
