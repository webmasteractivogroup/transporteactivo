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


class ScheduleProfiles(models.Model):
    SCHEDULEPROFILEID = models.IntegerField(primary_key=True)
    SHORTNAME = models.CharField(max_length=10)
    DESCRIPTION = models.CharField(max_length=100)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    REGISTERDATE = models.DateTimeField(null=True)

    class Meta:
        db_table = 'SCHEDULEPROFILES'


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
    STOPS_STOPID_START = models.IntegerField()
    STOPS_STOPID_END = models.IntegerField()
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
    CALENDARID = models.IntegerField(primary_key=True)
    OPERATIONDAY = models.DateField()
    SCHEDULETYPEID = models.IntegerField()
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
    LINEID = models.IntegerField()
    ARCID = models.IntegerField()
    ARCSEQUENCE = models.IntegerField()
    ORIENTATION = models.IntegerField(null=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    LINEVARIANT = models.SmallIntegerField(null=True)
    REGISTERDATE = models.DateTimeField(null=True)

    class Meta:
        db_table = 'LINESARCS'


class TripTypes(models.Model):
    """
        Registra los tipos de viaje válidos en el sistema, no depende de la planeación
    """
    TRIPTYPEID = models.IntegerField(primary_key=True)
    TRIPDESCRIPTION = models.CharField(max_length=35)

    class Meta:
        db_table = 'TRIPTYPES'


class Tasks(models.Model):
    """
        Registra la entidad "Tarea", con una definición para cada planeación cargada al SGCO.
    """
    TASKID = models.IntegerField()
    SCHEDULETYPEID = models.IntegerField()
    LINES_LINEID = models.IntegerField()
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')

    class Meta:
        db_table = 'TASKS'
        unique_together = ('TASKID', 'SCHEDULETYPEID', 'PLANVERSIONID')


class LineStops(models.Model):
    """
        Registra la relación entre las entidades Linea y Parada, presentando la secuencia de paradas que conforman una línea.
        Esta tabla es independiente a la programación de viajes y presenta la información de todas las líneas para cada planeación.
    """
    LINESTOPID = models.IntegerField(primary_key=True)
    STOPSEQUENCE = models.IntegerField()
    ORIENTATION = models.SmallIntegerField()
    LINEID = models.ForeignKey(Lines, db_column=u'LINEID')
    STOPID = models.ForeignKey(Stops, db_column=u'STOPID')
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    LINEVARIANT = models.IntegerField(null=True)
    REGISTERDATE = models.DateTimeField(null=True)
    LINEVARIANTTYPE = models.IntegerField(null=True)

    class Meta:
        db_table = 'LINESTOPS'

    def get_name_line(self):
        line = Lines.objects.get(LINEID=self.LINEID)
        return line.SHORTNAME


class Trips(models.Model):
    """
        Registra la entidad "Viaje", manteniendo los valores de la fuente original en donde cada
        registro refiere un recorrido planeado para iniciar en un momento específico (hora).
    """
    TRIPID = models.IntegerField()
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    TRIPTYPEID = models.ForeignKey(TripTypes, db_column=u'TRIPTYPEID')
    SCHEDULETYPEID = models.IntegerField()
    TRIPSEQUENCE = models.IntegerField(null=True)
    STARTTIME = models.CharField(max_length=6)
    TASKID = models.IntegerField()
    LINEID = models.IntegerField()
    STARTSTOPID = models.IntegerField()
    ENDSTOPID = models.IntegerField()
    DESCRIPTION = models.CharField(max_length=256, null=True)
    ORIENTATION = models.IntegerField(null=True)
    LINEVARIANT = models.IntegerField(null=True)
    REGISTERDATE = models.DateTimeField(null=True)
    SCHEDULEPROFILEID = models.ForeignKey(ScheduleProfiles, db_column=u'SCHEDULEPROFILEID')

    class Meta:
        db_table = 'TRIPS'
        unique_together = ('TRIPID', 'PLANVERSIONID', 'SCHEDULETYPEID', 'TASKID', 'STARTTIME')


class DataPlan(models.Model):
    """
        Registra la entidad "Viaje", extendiendo la información de viajes comerciales y de posicionamiento de de la tabla TRIPS,
        con totales (paradas, distancia) calculados de las tablas ARCS, LINEARCS y LINESTOPS.
    """

    DATAPLANID = models.IntegerField(primary_key=True)
    LINESHORTNAME = models.CharField(max_length=5)
    LINEID = models.IntegerField()
    ORIENTATION = models.IntegerField()
    TOTALSTOPS = models.IntegerField()
    TRIPLENGTH = models.IntegerField(null=True)
    TASKID = models.IntegerField()
    TRIPID = models.IntegerField()
    TRIPSTARTTIME = models.IntegerField(null=True)
    SCHEDULETYPEID = models.IntegerField()
    TRIPTYPEID = models.IntegerField(null=True)
    PLANVERSIONID = models.ForeignKey(PlanVersions, db_column=u'PLANVERSIONID')
    TRANSPORTCONTRATIST = models.CharField(max_length=100)
    REGISTERDATE = models.DateTimeField(null=True)
    TRIPENDTIME = models.IntegerField(null=True)
    TRIPTRANSITTIME = models.IntegerField(null=True)

    class Meta:
        db_table = 'DATAPLAN'
