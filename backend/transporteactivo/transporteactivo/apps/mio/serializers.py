# -*- coding: utf-8 -*-
from rest_framework import serializers

from .models import MioStops, Busqueda
from sgco.models import LineStops, Arcs


class ParadasCercanasSerializer(serializers.ModelSerializer):
    """
        Este serializer define las paradas cercanas dados unos puntos de geolocalizacion
    """

    id = serializers.Field(source='STOPID')
    nombre = serializers.Field(source='LONGNAME')
    lat = serializers.Field(source='DECIMALLATITUDE')
    lng = serializers.Field(source='DECIMALLONGITUDE')

    class Meta:
        model = MioStops
        fields = ('id', 'nombre', 'lat', 'lng', 'tipo_parada')


class RutasPorParadaSerializer(serializers.ModelSerializer):
    """
        Este serializer define las rutas que pasan por una parada especifica
    """
    id_ruta = serializers.Field(source='LINEID.LINEID')
    nombre_parada = serializers.Field(source='STOPID.LONGNAME')
    nombre_ruta = serializers.Field(source='LINEID.SHORTNAME')
    orientacion = serializers.Field(source='ORIENTATION')

    class Meta:
        model = LineStops
        fields = ('nombre_parada', 'nombre_ruta', 'id_ruta', 'orientacion')


class ParadasPorRutaSerializer(serializers.ModelSerializer):
    """
        Este serializer define las paradas que tiene una ruta especifica
    """

    nombre_parada = serializers.Field(source='STOPS_STOPID_START.LONGNAME')
    lat = serializers.Field(source='STOPS_STOPID_START.DECIMALLATITUDE')
    lng = serializers.Field(source='STOPS_STOPID_START.DECIMALLONGITUDE')

    class Meta:
        model = Arcs
        fields = ('nombre_parada', 'lat', 'lng')


class BusquedaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Busqueda
        fields = ('nombre', 'id')
