# -*- coding: utf-8 -*-
from rest_framework import serializers

from .models import MioStops
from sgco.models import LineStops, Arcs


class ParadasCercanasSerializer(serializers.ModelSerializer):
    id = serializers.Field(source='STOPID')
    nombre = serializers.Field(source='LONGNAME')
    lat = serializers.Field(source='DECIMALLATITUDE')
    lng = serializers.Field(source='DECIMALLONGITUDE')

    class Meta:
        model = MioStops
        fields = ('id', 'nombre', 'lat', 'lng')


class RutasPorParadaSerializer(serializers.ModelSerializer):
    id_ruta = serializers.Field(source='LINEID.LINEID')
    nombre_parada = serializers.Field(source='STOPID.LONGNAME')
    nombre_ruta = serializers.Field(source='LINEID.SHORTNAME')
    orientacion = serializers.Field(source='ORIENTATION')

    class Meta:
        model = LineStops
        fields = ('nombre_parada', 'nombre_ruta', 'id_ruta', 'orientacion')


class ParadasPorRutaSerializer(serializers.ModelSerializer):
    nombre_parada = serializers.Field(source='STOPS_STOPID_START.LONGNAME')

    class Meta:
        model = Arcs
        fields = ('nombre_parada',)
