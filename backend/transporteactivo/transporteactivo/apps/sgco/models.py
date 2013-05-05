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
    BUSTYPEID = models.IntegerField(primary_key=True, help_text=u'Identificador interno del tipo de bus.')
    SHORTNAME = models.DateField(help_text=u'Cadena corta que refiere el código del bus para reportes.')
    LONGNAME = models.DateField(help_text=u'Cadena que define el tipo de bus.')

    class Meta:
        db_table = 'BUSTYPES'


class Buses(models.Model):
    BUSID = models.IntegerField(primary_key=True, help_text=u'Identificador de aplicación, usado en los procesos de descarga de datos, mantiene el valor original de la fuente, es único por planeación.')
    BUSNUMBER = models.IntegerField(help_text=u'Identificador externo del vehículo según su valor en la fuente original, es único para cada planeación, el primer dígito representa el concesionario, el segundo el tipo de bus y el resto el consecutivo del vehículo, es el valor usado en los reportes.')
    IDENTIFICATION = models.CharField(max_length=6, help_text=u'Texto que registra la placa del vehículo.')
    BUSTYPEID = models.IntegerField(help_text=u'Identificador del tipo de bus, según su valor en la tabla BUSTYPES.')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID', help_text=u'Identificador interno de la planeación, según su valor en la tabla PLANVERSIONS.')

    class Meta:
        db_table = 'BUSES'


class ScheduleTypes(models.Model):
    SCHEDULETYPEID = models.IntegerField(primary_key=True, help_text=u'')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID', help_text=u'')
    SHORTNAME = models.CharField(max_length=10, help_text=u'')
    DESCRIPTION = models.CharField(max_length=20, help_text=u'')

    class Meta:
        db_table = 'SCHEDULETYPES'


class Calendar(models.Model):
    SCHEDULETYPEID = models.IntegerField(primary_key=True, help_text=u'')
    OPERATIONDAY = models.DateField(help_text=u'')
    SCHEDULETYPEID = models.CharField(max_length=10, help_text=u'')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID', help_text=u'')

    class Meta:
        db_table = 'CALENDAR'
