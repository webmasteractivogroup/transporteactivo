# -*- coding: utf-8 -*-
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

from sgco.models import Stops


class MioStops(Stops):
    """Parada que extiende el modelo de parada entregado por metrocali"""
    location = models.PointField(null=True)
    tipo_parada = models.IntegerField(null=True)
    objects = models.GeoManager()

    def __unicode__(self):
        return u'%s, %s' % (self.STOPID, self.LONGNAME)

    def save(self, *args, **kwargs):
        self.location = Point(float(self.DECIMALLONGITUDE), float(self.DECIMALLATITUDE))
        super(MioStops, self).save(*args, **kwargs)


class TipoParada(models.Model):
    """Modelo de la vista sql que define el tipo de parada para cada parada"""
    STOPID = models.IntegerField(primary_key=True,)
    STOPTYPE = models.IntegerField()

    class Meta:
        db_table = 'stop_types' #nombre de la tabla en la bd
        managed = False #tabla creada por fuera de django, no administrar

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
