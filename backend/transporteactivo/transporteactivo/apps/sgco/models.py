# -*- coding: utf-8 -*-
from django.contrib.gis.db import models


class PlanVersions(models.Model):
    """
        Registra la entidad "Plan", cada registro representa el cargue en SGCO de una nueva planeación
    """

    PLANVERSIONID = models.IntegerField(primary_key=True)
    ACTIVATIONDATE = models.DateField()
    CREATIONDATE = models.DateTimeField()

    class Meta:
        db_table = 'PLANVERSIONS'


class Stops(models.Model):
    """
        Registra la entidad "Parada" y sus principales atributos, se guardan todas las paradas por cada planeación.
    """
    STOPID = models.IntegerField(primary_key=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    SHORTNAME = models.CharField(max_length=10)
    LONGNAME = models.CharField(max_length=100)
    GPS_X = models.IntegerField(null=True)
    GPS_Y = models.IntegerField(null=True)
    DECIMALLONGITUDE = models.FloatField(null=True)
    DECIMALLATITUDE = models.FloatField(null=True)

    class Meta:
        db_table = 'STOPS'


class Arcs(models.Model):
    """
        Registra la entidad "Arco", con abstracción sobre la programación de viajes. La información de la
        tabla guarda todos los arcos para cada plananeación.
    """
    ARCID = models.IntegerField(primary_key=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    STOPS_STOPID_START = models.ForeignKey(Stops, db_column=u'STOPS_STOPID_START')
    STOPS_STOPID_END = models.ForeignKey(Stops, db_column=u'STOPS_STOPID_END')
    STARTPOINT = models.CharField(max_length=10)
    ENDPOINT = models.CharField(max_length=10)
    DESCRIPTION = models.CharField(max_length=100)
    ARCLENGTH = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'ARCS'


class BusTypes(models.Model):
    """
        Registra la tipificación de los buses del sistema.
    """

    BUSTYPEID = models.IntegerField(primary_key=True)
    SHORTNAME = models.DateField()
    LONGNAME = models.DateField()

    class Meta:
        db_table = 'BUSTYPES'


class Buses(models.Model):
    """
        Registra la entidad "bus" ó "vehículo", con la información de todos los vehículos para cada planeación.
    """

    BUSID = models.IntegerField(primary_key=True)
    BUSNUMBER = models.IntegerField()
    IDENTIFICATION = models.CharField(max_length=6)
    BUSTYPEID = models.ForeignKey(BusTypes, db_column=u'BUSTYPEID')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')

    class Meta:
        db_table = 'BUSES'


class ScheduleTypes(models.Model):
    """
        Registra la entidad "Dia Tipo", generada por cada planeación. Esta entidad es usada en
        la definción de las tareas viajes que pueden ser ejecutadas o nó en un día
    """

    SCHEDULETYPEID = models.IntegerField(primary_key=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    SHORTNAME = models.CharField(max_length=10)
    DESCRIPTION = models.CharField(max_length=20)

    class Meta:
        db_table = 'SCHEDULETYPES'


class Calendar(models.Model):
    """
        Registra la entidad "Calendario", que establece el "día tipo" y la planeación vigente en cada día calendario
        de la operación del sistema, registrando los días calendario del año en curso.
    """
    SCHEDULETYPEID = models.IntegerField(primary_key=True)
    OPERATIONDAY = models.DateField()
    SCHEDULETYPEID = models.ForeignKey(ScheduleTypes, db_column=u'SCHEDULETYPEID')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')

    class Meta:
        db_table = 'CALENDAR'


class Lines(models.Model):
    """
        Registra la entidad "Línea", independiente a la programación de viajes. Se registran todas las líneas por planeación.
    """
    LINEID = models.IntegerField(primary_key=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    SHORTNAME = models.CharField(max_length=10)
    DESCRIPTION = models.CharField(max_length=100)

    class Meta:
        db_table = 'LINES'


class LinesArcs(models.Model):
    """
        Registra la relación entre las entidades Linea y Arco, presentando la secuencia de arcos que conforman una línea.
        Esta tabla es independiente a la programación de viajes y presenta la información de todas las línea - arcos para cada planeación.
    """
    LINEARCID = models.IntegerField(primary_key=True)
    LINEID = models.ForeignKey(Lines, db_column=u'LINEID')
    ARCID = models.ForeignKey(Arcs, db_column=u'ARCID')
    ARCSEQUENCE = models.IntegerField()
    ORIENTATION = models.IntegerField(null=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    LINEVARIANT = models.SmallIntegerField(null=True)
    REGISTERDATE = models.DateTimeField(null=True)

    class Meta:
        db_table = 'LINESARCS'









































