# -*- coding: utf-8 -*-
# from django.db import DatabaseError
from django.contrib.gis.geos import Point, Polygon

from rest_framework import viewsets
# from unidecode import unidecode

from .models import MioStops, Busqueda
from sgco.models import LineStops

from .serializers import ParadasSerializer, RutasPorParadaSerializer, ParadasPorRutaSerializer, BusquedaSerializer


class ParadasCercanasViewSet(viewsets.ReadOnlyModelViewSet):
    model = MioStops
    serializer_class = ParadasSerializer

    def get_queryset(self):
        queryset = self.model.objects.filter(pk__lt=600000, tipo_parada__isnull=False)

        north_east_query_string = self.request.QUERY_PARAMS.getlist('ne[]', [])
        south_west_query_string = self.request.QUERY_PARAMS.getlist('sw[]', [])
        tipo_query_string = self.request.QUERY_PARAMS.getlist('tipo[]', [])

        if south_west_query_string and north_east_query_string:
            north_east_lat = float(north_east_query_string[0])
            north_east_lng = float(north_east_query_string[1])
            south_west_lat = float(south_west_query_string[0])
            south_west_lng = float(south_west_query_string[1])

            north_east = Point(north_east_lng, north_east_lat)
            north_west = Point(south_west_lng, north_east_lat)
            south_east = Point(north_east_lng, south_west_lat)
            south_west = Point(south_west_lng, south_west_lat)

            poly = Polygon((north_east, south_east, south_west, north_west, north_east))

            if tipo_query_string:
                queryset = queryset.filter(tipo_parada__in=tipo_query_string, location__contained=poly)
            else:
                queryset = queryset.filter(location__contained=poly)
        else:
            if tipo_query_string:
                queryset = queryset.filter(tipo_parada__in=tipo_query_string)
        return queryset


class RutasPorParadaViewSet(viewsets.ReadOnlyModelViewSet):
    model = LineStops
    serializer_class = RutasPorParadaSerializer

    def get_queryset(self):
        queryset = self.model.objects.exclude(LINEID__SHORTNAME__istartswith='R')
        parada_id = self.request.QUERY_PARAMS.get('parada_id', None)
        if parada_id:
            queryset = queryset.filter(STOPID=parada_id, LINEVARIANTTYPE=1).distinct('LINEID')
        return queryset


class ParadasPorRutaViewSet(viewsets.ReadOnlyModelViewSet):
    model = LineStops
    serializer_class = ParadasPorRutaSerializer

    def get_queryset(self):
        queryset = []
        ruta_id = self.request.QUERY_PARAMS.get('ruta_id', None)
        orientacion = self.request.QUERY_PARAMS.get('orientacion', None)
        linevariant = self.request.QUERY_PARAMS.get('linevariant', None)

        if ruta_id is not None and orientacion is not None and linevariant is not None:
            queryset = self.model.objects.filter(LINEID=ruta_id, ORIENTATION=orientacion, LINEVARIANT=linevariant).order_by('STOPSEQUENCE')
        return queryset


class BusquedaViewSet(viewsets.ReadOnlyModelViewSet):
    model = Busqueda
    serializer_class = BusquedaSerializer

    def get_queryset(self):
        queryset = self.model.objects.filter(id__lt=600000)
        q = self.request.QUERY_PARAMS.get('q', None)
        if q:
            query = r'(^|.*\s)%s.*' % q
            queryset = queryset.filter(nombre__iregex=query)
        return queryset


class BusquedaParadasViewSet(viewsets.ReadOnlyModelViewSet):
    model = MioStops
    serializer_class = ParadasSerializer

    def get_queryset(self):
        queryset = []
        q = self.request.QUERY_PARAMS.get('q', None)
        if q:
            query = r'(^|.*\s)%s.*' % q
            queryset = MioStops.objects.filter(nombre__iregex=query)
        return queryset
