# -*- coding: utf-8 -*-
from rest_framework import serializers

from sgco.models import LineStops
from .models import MioStops, Busqueda, ParadasPorRuta


class ParadasSerializer(serializers.ModelSerializer):
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
    nombre_ruta = serializers.Field(source='LINEID.SHORTNAME')
    descripcion = serializers.Field(source='LINEID.DESCRIPTION')
    orientacion = serializers.Field(source='ORIENTATION')

    class Meta:
        model = LineStops
        fields = ('nombre_ruta', 'id_ruta', 'descripcion', 'orientacion')


class ParadasPorRutaSerializer(serializers.ModelSerializer):
    """
        Este serializer define las paradas que tiene una ruta especifica
    """
    class Meta:
        model = ParadasPorRuta
        fields = ('stop_start_id', 'stop_start_name', 'stop_start_lat', 'stop_start_lng', 'stop_end_id', 'stop_end_name', 'stop_end_lat', 'stop_end_lng', 'arcsequence')


class BusquedaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Busqueda
        fields = ('id', 'nombre', 'extra', 'tipo', 'extra2')
