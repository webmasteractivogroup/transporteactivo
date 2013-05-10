# -*- coding: utf-8 -*-
from django.utils.timezone import utc
from django.utils import timezone
from sgco.models import *

import csv
from datetime import datetime


l_format = '%m/%d/%Y %I:%M:%S %p'
s_format = '%m/%d/%Y'
tz = timezone.get_current_timezone()

PLANVERSIONID = PlanVersions.objects.get(pk=40)
####################################################################################
#  PLANVERSIONS


def load_plan_versions():
    reader = csv.reader(open('planversion40/planversions.csv', 'r'),  delimiter=';')
    results = []

    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        plan_version_id = int(r[0])
        activation_date = datetime.strptime(r[1], s_format).replace(tzinfo=utc)
        creation_date = datetime.now()
        try:
            creation_date = datetime.strptime(r[2], l_format)
        except ValueError:
            creation_date = datetime.strptime(r[2], s_format)
        PlanVersions.objects.create(PLANVERSIONID=plan_version_id, ACTIVATIONDATE=activation_date.date(), CREATIONDATE=creation_date.replace(tzinfo=utc))
####################################################################################
# SCHEDULEPROFILES


def load_schedule_profiles():
        reader = csv.reader(open('planversion40/scheduleprofiles.csv', 'r'),  delimiter=';')
        results = []
        for row in reader:
            results.append(row)
        results = results[1:]
        for r in results:
            SCHEDULEPROFILEID = int(r[0])
            SHORTNAME = r[1]
            DESCRIPTION = r[2]
            REGISTERDATE = datetime.strptime(r[4], l_format).replace(tzinfo=utc)
            ScheduleProfiles.objects.create(SCHEDULEPROFILEID=SCHEDULEPROFILEID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION,
                                            PLANVERSIONID=PLANVERSIONID, REGISTERDATE=REGISTERDATE)
####################################################################################
# STOPS


def load_stops():
    reader = csv.reader(open('planversion40/stops.csv', 'r'),  delimiter=';')
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
        Stops.objects.create(STOPID=STOPID, PLANVERSIONID=PLANVERSIONID, SHORTNAME=SHORTNAME, LONGNAME=LONGNAME,
                             GPS_X=GPS_X, GPS_Y=GPS_Y, DECIMALLONGITUDE=DECIMALLONGITUDE, DECIMALLATITUDE=DECIMALLATITUDE)
    ####################################################################################
# ARCS


def load_arcs():
    reader = csv.reader(open('planversion40/arcs.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        ARCID = int(r[0])
        STOPS_STOPID_START = int(r[2])
        STOPS_STOPID_END = int(r[3])
        STARTPOINT = unicode(r[4], 'latin-1')
        ENDPOINT = unicode(r[5], 'latin-1')
        DESCRIPTION = unicode(r[6], 'latin-1')
        try:
            ARCLENGTH = int(r[7])
        except ValueError:
            ARCLENGTH = 0
        Arcs.objects.create(ARCID=ARCID, PLANVERSIONID=PLANVERSIONID, STOPS_STOPID_START=STOPS_STOPID_START, STOPS_STOPID_END=STOPS_STOPID_END,
                            STARTPOINT=STARTPOINT, ENDPOINT=ENDPOINT, DESCRIPTION=DESCRIPTION, ARCLENGTH=ARCLENGTH)
####################################################################################
# SCHEDULETYPES


def load_schedule_types():
    reader = csv.reader(open('planversion40/scheduletypes.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        SCHEDULETYPEID = r[0]
        SHORTNAME = r[2]
        DESCRIPTION = r[3]
        ScheduleTypes.objects.create(SCHEDULETYPEID=SCHEDULETYPEID, PLANVERSIONID=PLANVERSIONID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION)
####################################################################################
#  CALENDAR


def load_calendar():
    reader = csv.reader(open('planversion40/calendar.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        CALENDARID = int(r[0])
        OPERATIONDAY = datetime.strptime(r[1], s_format).replace(tzinfo=utc)
        SCHEDULETYPEID = r[2]
        Calendar.objects.create(CALENDARID=CALENDARID, OPERATIONDAY=OPERATIONDAY, SCHEDULETYPEID=SCHEDULETYPEID, PLANVERSIONID=PLANVERSIONID)
####################################################################################
# LINES


def load_lines():
    reader = csv.reader(open('planversion40/lines.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]

    for r in results:
        LINEID = int(r[0])
        SHORTNAME = unicode(r[2], 'latin-1')
        DESCRIPTION = unicode(r[3], 'latin-1')
        Lines.objects.create(LINEID=LINEID, SHORTNAME=SHORTNAME, DESCRIPTION=DESCRIPTION, PLANVERSIONID=PLANVERSIONID)
####################################################################################
# LINESARCS


def load_line_arcs():
    reader = csv.reader(open('planversion40/linearcs.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        LINEARCID = int(r[0])
        LINEID = int(r[1])
        ARCID = int(r[2])
        ARCSEQUENCE = int(r[3])
        ORIENTATION = int(r[4])
        LINEVARIANT = int(r[6])
        REGISTERDATE = datetime.strptime(r[7], s_format).replace(tzinfo=utc)
        Lines.objects.create(LINEARCID=LINEARCID, LINEID=LINEID, ARCID=ARCID, ARCSEQUENCE=ARCSEQUENCE, ORIENTATION=ORIENTATION,
                             LINEVARIANT=LINEVARIANT, REGISTERDATE=REGISTERDATE, PLANVERSIONID=PLANVERSIONID)
####################################################################################
# TASKS


def load_tasks():
    reader = csv.reader(open('planversion40/tasks.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        TASKID = int(r[0])
        SCHEDULETYPEID = int(r[1])
        LINES_LINEID = int(r[2])
        Tasks.objects.create(TASKID=TASKID, SCHEDULETYPEID=SCHEDULETYPEID, LINES_LINEID=LINES_LINEID, PLANVERSIONID=PLANVERSIONID)
####################################################################################
# LINESTOPS


def load_line_stops():
    reader = csv.reader(open('planversion40/linestops.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        LINESTOPID = int(r[0])
        STOPSEQUENCE = int(r[1])
        ORIENTATION = int(r[2])
        LINEID = int(r[3])
        STOPID = int(r[4])
        LINEVARIANT = int(r[6])
        REGISTERDATE = timezone.make_aware(datetime.strptime(r[7], l_format), tz)
        LINEVARIANTTYPE = int(r[8])
        LineStops.objects.create(LINESTOPID=LINESTOPID, STOPSEQUENCE=STOPSEQUENCE, ORIENTATION=ORIENTATION, PLANVERSIONID=PLANVERSIONID,
                                 LINEID=LINEID, STOPID=STOPID, LINEVARIANT=LINEVARIANT, REGISTERDATE=REGISTERDATE, LINEVARIANTTYPE=LINEVARIANTTYPE
                                )
####################################################################################
# TRIPS


def load_trips():
    reader = csv.reader(open('planversion40/trips.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        TRIPID = int(r[0])
        TRIPTYPEID = TripTypes.objects.get(pk=int(r[2]))
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
        SCHEDULEPROFILEID = ScheduleProfiles.objects.get(pk=int(r[14]))
        Trips.objects.create(TRIPID=TRIPID, PLANVERSIONID=PLANVERSIONID, TRIPTYPEID=TRIPTYPEID, SCHEDULETYPEID=SCHEDULETYPEID,
                             TRIPSEQUENCE=TRIPSEQUENCE, STARTTIME=STARTTIME, TASKID=TASKID, LINEID=LINEID, STARTSTOPID=STARTSTOPID,
                             ENDSTOPID=ENDSTOPID, DESCRIPTION=DESCRIPTION, ORIENTATION=ORIENTATION, LINEVARIANT=LINEVARIANT,
                             REGISTERDATE=REGISTERDATE, SCHEDULEPROFILEID=SCHEDULEPROFILEID
                            )
####################################################################################
# TRIPS


def load_plan_data():
    reader = csv.reader(open('planversion40/trips.csv', 'r'),  delimiter=';')
    results = []
    for row in reader:
        results.append(row)
    results = results[1:]
    for r in results:
        TRIPID = int(r[0])
        TRIPTYPEID = TripTypes.objects.get(pk=int(r[2]))
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
        SCHEDULEPROFILEID = ScheduleProfiles.objects.get(pk=int(r[14]))
        Trips.objects.create(TRIPID=TRIPID, PLANVERSIONID=PLANVERSIONID, TRIPTYPEID=TRIPTYPEID, SCHEDULETYPEID=SCHEDULETYPEID,
                             TRIPSEQUENCE=TRIPSEQUENCE, STARTTIME=STARTTIME, TASKID=TASKID, LINEID=LINEID, STARTSTOPID=STARTSTOPID,
                             ENDSTOPID=ENDSTOPID, DESCRIPTION=DESCRIPTION, ORIENTATION=ORIENTATION, LINEVARIANT=LINEVARIANT,
                             REGISTERDATE=REGISTERDATE, SCHEDULEPROFILEID=SCHEDULEPROFILEID
                            )
