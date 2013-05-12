# -*- coding: utf-8 -*-
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D


from sgco.models import LineStops, Arcs
from mio.models import MioStops
from mio.serializers import ParadasCercanasSerializer, RutasPorParadaSerializer, ParadasPorRutaSerializer
from mio.utils import search_sql
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response


class ParadasCercanasViewSet(viewsets.ReadOnlyModelViewSet):
    model = MioStops
    serializer_class = ParadasCercanasSerializer

    def get_queryset(self):
        queryset = []
        lat = self.request.QUERY_PARAMS.get('lat', None)
        lng = self.request.QUERY_PARAMS.get('lng', None)
        if lat is not None and lng is not None:
            pnt = Point(float(lng), float(lat))
            distance = 800
            queryset = MioStops.objects.filter(location__distance_lt=(pnt, D(m=distance))).order_by('LONGNAME', 'STOPID')
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
            queryset = Arcs.objects.filter(arcs__LINEID=ruta_id, arcs__ORIENTATION=orientacion)
        return queryset


class BusquedaView(APIView):

    def get(self, request, format=None):
        queryset = []
        query = self.request.QUERY_PARAMS.get('query', None)
        if query:
            queryset = search_sql(query)
        return Response(queryset)



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























































