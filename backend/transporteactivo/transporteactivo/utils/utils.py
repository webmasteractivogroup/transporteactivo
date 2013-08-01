# -*- coding: utf-8 -*-
import os
import csv
from datetime import datetime

from django.conf import settings
from django.utils import timezone
from django.db import DatabaseError
from django.db import connection

from sgco import models

l_format = '%m/%d/%Y %I:%M:%S %p'
s_format = '%m/%d/%Y'
tz = timezone.get_current_timezone()

PROJECT_DIR = getattr(settings, 'PROJECT_DIR', '')
DATA_DIR = os.path.join(PROJECT_DIR, 'sgco_tables', 'planversion46')
PLANVERSIONID = models.PlanVersions.objects.get(pk=46)

####################################################################################
#  PLANVERSIONS


def load_plan_versions():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'planversions.csv'), 'r'),  delimiter=';')
    results = []

    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        PLANVERSIONID = int(r[0])
        ACTIVATIONDATE = timezone.make_aware(datetime.strptime(r[1], s_format), tz)
        CREATIONDATE = datetime.now()
        try:
            CREATIONDATE = datetime.strptime(r[2], l_format)
        except ValueError:
            CREATIONDATE = datetime.strptime(r[2], s_format)
        CREATIONDATE = timezone.make_aware(CREATIONDATE, tz)
        try:
            models.PlanVersions.objects.create(PLANVERSIONID=PLANVERSIONID, ACTIVATIONDATE=ACTIVATIONDATE.date(), CREATIONDATE=CREATIONDATE)
        except DatabaseError:
            connection._rollback()
            continue
####################################################################################
# SCHEDULEPROFILES


def load_schedule_profiles():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'scheduleprofiles.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        SCHEDULEPROFILEID = int(r[0])
        SHORTNAME = r[1]
        DESCRIPTION = r[2]
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[4], l_format), tz)
        models.ScheduleProfiles.objects.create(SCHEDULEPROFILEID=SCHEDULEPROFILEID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION,
                                               PLANVERSIONID=PLANVERSIONID, REGISTERDATE=REGISTERDATE)
    print(models.ScheduleProfiles.objects.count())
####################################################################################
# STOPS


def load_stops():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'stops.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        STOPID = r[0]
        SHORTNAME = unicode(r[2], 'latin-1')
        LONGNAME = unicode(r[3], 'latin-1')
        GPS_X = int(r[4])
        GPS_Y = int(r[5])
        DECIMALLONGITUDE = float(r[6])
        DECIMALLATITUDE = float(r[7])
        models.Stops.objects.create(STOPID=STOPID, PLANVERSIONID=PLANVERSIONID, SHORTNAME=SHORTNAME, LONGNAME=LONGNAME,
                                    GPS_X=GPS_X, GPS_Y=GPS_Y, DECIMALLONGITUDE=DECIMALLONGITUDE, DECIMALLATITUDE=DECIMALLATITUDE)
    print(models.Stops.objects.count())
####################################################################################
# ARCS


def load_arcs():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'arcs.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        ARCID = int(r[0])
        STOPS_STOPID_START = models.Stops.objects.get(pk=int(r[2]))
        STOPS_STOPID_END = models.Stops.objects.get(pk=int(r[3]))
        STARTPOINT = unicode(r[4], 'latin-1')
        ENDPOINT = unicode(r[5], 'latin-1')
        DESCRIPTION = unicode(r[6], 'latin-1')
        try:
            ARCLENGTH = int(r[7])
        except ValueError:
            ARCLENGTH = 0
        models.Arcs.objects.create(ARCID=ARCID, PLANVERSIONID=PLANVERSIONID, STOPS_STOPID_START=STOPS_STOPID_START, STOPS_STOPID_END=STOPS_STOPID_END,
                                   STARTPOINT=STARTPOINT, ENDPOINT=ENDPOINT, DESCRIPTION=DESCRIPTION, ARCLENGTH=ARCLENGTH)
    print(models.Arcs.objects.count())
####################################################################################
# SCHEDULETYPES


def load_schedule_types():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'scheduletypes.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        SCHEDULETYPEID = r[0]
        SHORTNAME = r[2]
        DESCRIPTION = r[3]
        models.ScheduleTypes.objects.create(SCHEDULETYPEID=SCHEDULETYPEID, PLANVERSIONID=PLANVERSIONID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION)
    print(models.ScheduleTypes.objects.count())
####################################################################################
#  CALENDAR


def load_calendar():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'calendar.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        CALENDARID = int(r[0])
        OPERATIONDAY = timezone.make_aware(datetime.strptime(r[1], s_format), tz)
        SCHEDULETYPEID = r[2]
        models.Calendar.objects.create(CALENDARID=CALENDARID, OPERATIONDAY=OPERATIONDAY, SCHEDULETYPEID=SCHEDULETYPEID, PLANVERSIONID=PLANVERSIONID)
    print(models.Calendar.objects.count())
####################################################################################
# LINES


def load_lines():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'lines.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        LINEID = int(r[0])
        SHORTNAME = unicode(r[2], 'latin-1')
        DESCRIPTION = unicode(r[3], 'latin-1')
        models.Lines.objects.create(LINEID=LINEID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION, PLANVERSIONID=PLANVERSIONID)
    print(models.Lines.objects.count())
####################################################################################
# LINESARCS


def load_line_arcs():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'linearcs.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        LINEARCID = int(r[0])
        LINEID = models.Lines.objects.get(pk=int(r[1]))
        ARCID = models.Arcs.objects.get(pk=int(r[2]))
        ARCSEQUENCE = int(r[3])
        ORIENTATION = int(r[4])
        LINEVARIANT = int(r[6])
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[7], l_format), tz)
        models.LinesArcs.objects.create(LINEARCID=LINEARCID, LINEID=LINEID, ARCID=ARCID, ARCSEQUENCE=ARCSEQUENCE, ORIENTATION=ORIENTATION,
                                        LINEVARIANT=LINEVARIANT, REGISTERDATE=REGISTERDATE, PLANVERSIONID=PLANVERSIONID)
    print(models.LinesArcs.objects.count())
####################################################################################
# TASKS


def load_tasks():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'tasks.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        TASKID = int(r[0])
        SCHEDULETYPEID = int(r[1])
        LINES_LINEID = int(r[2])
        models.Tasks.objects.create(TASKID=TASKID, SCHEDULETYPEID=SCHEDULETYPEID, LINES_LINEID=LINES_LINEID, PLANVERSIONID=PLANVERSIONID)
    print(models.Tasks.objects.count())
####################################################################################
# LINESTOPS


def load_line_stops():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'linestops.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        LINESTOPID = int(r[0])
        STOPSEQUENCE = int(r[1])
        ORIENTATION = int(r[2])
        LINEID = models.Lines.objects.get(pk=int(r[3]))
        STOPID = models.Stops.objects.get(pk=int(r[4]))
        LINEVARIANT = int(r[6])
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[7], l_format), tz)
        LINEVARIANTTYPE = int(r[8])
        models.LineStops.objects.create(LINESTOPID=LINESTOPID, STOPSEQUENCE=STOPSEQUENCE, ORIENTATION=ORIENTATION, PLANVERSIONID=PLANVERSIONID,
                                        LINEID=LINEID, STOPID=STOPID, LINEVARIANT=LINEVARIANT, REGISTERDATE=REGISTERDATE, LINEVARIANTTYPE=LINEVARIANTTYPE
                                )
    print(models.LineStops.objects.count())
####################################################################################
# TRIPS


def load_trips():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'trips.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        TRIPID = int(r[0])
        TRIPTYPEID = models.TripTypes.objects.get(pk=int(r[2]))
        SCHEDULETYPEID = int(r[3])
        TRIPSEQUENCE = int(r[4])
        STARTTIME = int(r[5])
        TASKID = int(r[6])
        LINEID = int(r[7])
        STARTSTOPID = int(r[8])
        ENDSTOPID = int(r[9])
        DESCRIPTION = unicode(r[10], 'latin-1')
        ORIENTATION = int(r[11])
        LINEVARIANT = int(r[12])
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[13], l_format), tz)
        SCHEDULEPROFILEID = models.ScheduleProfiles.objects.get(pk=int(r[14]))
        models.Trips.objects.create(TRIPID=TRIPID, PLANVERSIONID=PLANVERSIONID, TRIPTYPEID=TRIPTYPEID, SCHEDULETYPEID=SCHEDULETYPEID,
                                    TRIPSEQUENCE=TRIPSEQUENCE, STARTTIME=STARTTIME, TASKID=TASKID, LINEID=LINEID, STARTSTOPID=STARTSTOPID,
                                    ENDSTOPID=ENDSTOPID, DESCRIPTION=DESCRIPTION, ORIENTATION=ORIENTATION, LINEVARIANT=LINEVARIANT,
                                    REGISTERDATE=REGISTERDATE, SCHEDULEPROFILEID=SCHEDULEPROFILEID
                                )
    print(models.Trips.objects.count())
####################################################################################
# TRIPS


def load_data_plan():
    reader = csv.reader(open(os.path.join(DATA_DIR, 'dataplan.csv'), 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        DATAPLANID = int(r[0])
        LINESHORTNAME = unicode(r[1], 'latin-1')
        LINEID = int(r[2])
        ORIENTATION = int(r[3])
        TOTALSTOPS = int(r[4])
        TRIPLENGTH = int(r[5])
        TASKID = int(r[6])
        TRIPID = int(r[7])
        TRIPSTARTTIME = int(r[8])
        SCHEDULETYPEID = int(r[9])
        TRIPTYPEID = int(r[10])
        TRANSPORTCONTRATIST = unicode(r[12], 'latin-1')
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[13], l_format), tz)
        try:
            TRIPENDTIME = int(r[14])
        except:
            TRIPENDTIME = None
        try:
            TRIPTRANSITTIME = int(r[15])
        except:
            TRIPTRANSITTIME = None
        models.DataPlan.objects.create(DATAPLANID=DATAPLANID, PLANVERSIONID=PLANVERSIONID, LINESHORTNAME=LINESHORTNAME, LINEID=LINEID,
                                       ORIENTATION=ORIENTATION, TOTALSTOPS=TOTALSTOPS, TRIPLENGTH=TRIPLENGTH, TASKID=TASKID, TRIPID=TRIPID,
                                       TRIPSTARTTIME=TRIPSTARTTIME, SCHEDULETYPEID=SCHEDULETYPEID, TRIPTYPEID=TRIPTYPEID, TRANSPORTCONTRATIST=TRANSPORTCONTRATIST,
                                       REGISTERDATE=REGISTERDATE, TRIPENDTIME=TRIPENDTIME, TRIPTRANSITTIME=TRIPTRANSITTIME
                                    )
    print(models.DataPlan.objects.count())
