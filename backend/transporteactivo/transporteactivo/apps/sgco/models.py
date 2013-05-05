# -*- coding: utf-8 -*-
from django.contrib.gis.db import models


class PlanVersions(models.Model):
    PLANVERSIONID = models.IntegerField(primary_key=True, help_text=u'Identificador interno único, generado en SGCO')
    ACTIVATIONDATE = models.DateField(help_text=u'Fecha que marca el inicio de la vigencia de la planeación')
    CREATIONDATE = models.DateField(help_text=u'Fecha de creación de la nueva planeación.')

    class Meta:
        db_table = 'PLANVERSIONS'


class Arcs(models.Model):
    ARCID = models.IntegerField(primary_key=True, help_text=u'índice único por arco, generado en sequencia.')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID', help_text=u'índice foráneo que representa el número interno (SGCO) de la planeación, según su valor en la tabla PLANVERSIONS.')
    STOPS_STOPID_START = models.IntegerField(help_text=u'Identificador de parada inicial, según las paradas de la tabla STOPS')
    STOPS_STOPID_END = models.IntegerField(help_text=u'Indicador de la parada final, según las paradas de la tabla STOPS')
    STARTPOINT = models.CharField(max_length=10, help_text=u'Descripción corta de la parada inicial')
    ENDPOINT = models.CharField(max_length=10, help_text=u'Descripción corta de la parada final')
    DESCRIPTION = models.CharField(max_length=100, help_text=u'Texto que une la descripción larga de las dos paradas con un guión en la mitad')
    ARCLENGTH = models.IntegerField(null=True, blank=True, help_text=u'Distancia en metros entre el punto de inicio y fin del arco')

    class Meta:
        db_table = 'ARCS'



class BusTypes(models.Model):
    BUSTYPEID = models.IntegerField(primary_key=True, help_text=u'Identificador interno único, generado en SGCO')
    ACTIVATIONDATE = models.DateField(help_text=u'Fecha que marca el inicio de la vigencia de la planeación')
    CREATIONDATE = models.DateField(help_text=u'Fecha de creación de la nueva planeación.')

    class Meta:
        db_table = 'PLANVERSIONS'

class Buses(models.Model):
    BUSID = models.IntegerField(primary_key=True, help_text=u'índice único por arco, generado en sequencia.')
    SBUSNUMBER = models.IntegerField(help_text=u'Identificador de parada inicial, según las paradas de la tabla STOPS')
    STOPS_STOPID_END = models.IntegerField(help_text=u'Indicador de la parada final, según las paradas de la tabla STOPS')
    STARTPOINT = models.CharField(max_length=10, help_text=u'Descripción corta de la parada inicial')
    ENDPOINT = models.CharField(max_length=10, help_text=u'Descripción corta de la parada final')
    DESCRIPTION = models.CharField(max_length=100, help_text=u'Texto que une la descripción larga de las dos paradas con un guión en la mitad')
    ARCLENGTH = models.IntegerField(null=True, blank=True, help_text=u'Distancia en metros entre el punto de inicio y fin del arco')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID', help_text=u'Identificador interno de la planeación, según su valor en la tabla PLANVERSIONS.')

    class Meta:
        db_table = 'BUSES'
