# -*- coding: utf-8 -*-
from rest_framework import serializers

from sgco.models import LineStops
from .models import MioStops, Busqueda


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
    linevariant = serializers.Field(source='LINEVARIANT')

    class Meta:
        model = LineStops
        fields = ('nombre_ruta', 'id_ruta', 'descripcion', 'orientacion', 'linevariant')


class ParadasPorRutaSerializer(serializers.ModelSerializer):
    """
        Este serializer define las paradas que tiene una ruta especifica
    """
    id_parda = serializers.Field(source='STOPID.STOPID')
    nombre_parda = serializers.Field(source='STOPID.LONGNAME')
    lat = serializers.Field(source='STOPID.DECIMALLATITUDE')
    lng = serializers.Field(source='STOPID.DECIMALLONGITUDE')

    class Meta:
        model = LineStops
        fields = ('id_parda', 'nombre_parda', 'lat', 'lng')


class BusquedaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Busqueda
        fields = ('id', 'nombre', 'extra', 'tipo', 'extra2', 'linevariant')
