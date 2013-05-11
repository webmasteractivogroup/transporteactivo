# -*- coding: utf-8 -*-
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from sgco.models import LineStops
from mio.models import MioStops
from mio.serializers import MioStopsSerializer, LinesStopsSerializer
from rest_framework import viewsets


class MioStopsViewSet(viewsets.ReadOnlyModelViewSet):
    model = MioStops
    serializer_class = MioStopsSerializer

    def get_queryset(self):
        queryset = []
        lat = self.request.QUERY_PARAMS.get('lat', None)
        lng = self.request.QUERY_PARAMS.get('lng', None)
        if lat is not None and lng is not None:
            pnt = Point(float(lng), float(lat))
            distance = 800
            queryset = MioStops.objects.filter(location__distance_lt=(pnt, D(m=distance)))
        return queryset


class LineStopsViewSet(viewsets.ReadOnlyModelViewSet):
    model = LineStops
    serializer_class = LinesStopsSerializer

    def get_queryset(self):
        queryset = []
        parada_id = self.request.QUERY_PARAMS.get('parada_id', None)
        if parada_id is not None:
            queryset = LineStops.objects.filter(STOPID=parada_id).distinct('LINEID')
        return queryset
