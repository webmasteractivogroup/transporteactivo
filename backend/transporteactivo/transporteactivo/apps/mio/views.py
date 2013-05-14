# -*- coding: utf-8 -*-
from django.contrib.gis.geos import Point, Polygon

from rest_framework import viewsets

from .models import MioStops, Busqueda
from .serializers import ParadasCercanasSerializer, RutasPorParadaSerializer, ParadasPorRutaSerializer, BusquedaSerializer

from sgco.models import LineStops, Arcs


class ParadasCercanasViewSet(viewsets.ReadOnlyModelViewSet):
    model = MioStops
    serializer_class = ParadasCercanasSerializer

    def get_queryset(self):
        queryset = []
        south_west_query_string = self.request.QUERY_PARAMS.get('sw', None)
        north_east_query_string = self.request.QUERY_PARAMS.get('ne', None)
        tipo = self.request.QUERY_PARAMS.get('tipo', None)
        if south_west_query_string is not None and north_east_query_string is not None:
            south_west_lat = float(south_west_query_string.split(',')[0])
            south_west_lng = float(south_west_query_string.split(',')[1])
            north_east_lat = float(north_east_query_string.split(',')[0])
            north_east_lng = float(north_east_query_string.split(',')[1])

            south_west = Point(south_west_lng, south_west_lat)
            north_west = Point(south_west_lng, north_east_lat)

            north_east = Point(north_east_lng, north_east_lat)
            south_east = Point(north_east_lng, south_west_lat)

            poly = Polygon((south_west, north_west, north_east, south_east, south_west))
            queryset = MioStops.objects.filter(tipo_parada__isnull=False, location__contained=poly)
            if tipo:
                queryset = queryset.filter(tipo_parada=tipo)
        return queryset


class RutasPoParadaViewSet(viewsets.ReadOnlyModelViewSet):
    model = LineStops
    serializer_class = RutasPorParadaSerializer

    def get_queryset(self):
        queryset = []
        parada_id = self.request.QUERY_PARAMS.get('parada_id', None)
        if parada_id is not None:
            queryset = LineStops.objects.filter(STOPID=parada_id).distinct('LINEID')
        return queryset


class ParadasPorRutaViewSet(viewsets.ReadOnlyModelViewSet):
    model = Arcs
    serializer_class = ParadasPorRutaSerializer

    def get_queryset(self):
        queryset = []
        ruta_id = self.request.QUERY_PARAMS.get('ruta_id', None)
        orientacion = self.request.QUERY_PARAMS.get('orientacion', None)
        if ruta_id is not None and orientacion is not None:
            queryset = Arcs.objects.filter(linearcs__LINEID=ruta_id, linearcs__ORIENTATION=orientacion).reverse()
        return queryset


class BusquedaViewSet(viewsets.ReadOnlyModelViewSet):
    model = Busqueda
    serializer_class = BusquedaSerializer

    def get_queryset(self):
        queryset = []
        query = self.request.QUERY_PARAMS.get('query', None)
        if query:
            queryset = Busqueda.objects.filter(nombre__icontains=query)
        return queryset

# class BusquedaView(APIView):

#     def get(self, request, format=None):
#         queryset = []
#         query = self.request.QUERY_PARAMS.get('query', None)
#         if query:
#             queryset = search_sql(query)
#         return Response(queryset)



# class BuscarParadaViewSet(viewsets.ReadOnlyModelViewSet):
#     model = Arcs
#     serializer_class = BuscarParadaSeriralizer

#     def get_queryset(self):
#         queryset = []
#         query = self.request.QUERY_PARAMS.get('query', None)
#         if query:
#             queryset = MioStops.objects.filter(LONGNAME__icontains=query)
#         return queryset


# class BuscarRutaViewSet(viewsets.ReadOnlyModelViewSet):
#     model = Lines
#     serializer_class = BuscarRutaSeriralizer

#     def get_queryset(self):
#         queryset = []
#         query = self.request.QUERY_PARAMS.get('query', None)
#         if query:
#             queryset = MioStops.objects.filter(SHORTNAME__icontains=query)
#         return queryset























































