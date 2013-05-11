# -*- coding: utf-8 -*-
from sgco.models import LineStops, Arcs
from mio.models import MioStops
from rest_framework import serializers


class MioStopsSerializer(serializers.ModelSerializer):
    id = serializers.Field(source='STOPID')
    nombre_corto = serializers.Field(source='SHORTNAME')
    nombre_largo = serializers.Field(source='LONGNAME')
    lat = serializers.Field(source='DECIMALLATITUDE')
    lng = serializers.Field(source='DECIMALLONGITUDE')

    class Meta:
        model = MioStops
        fields = ('id', 'nombre_corto', 'nombre_largo', 'lat', 'lng')


class LinesStopsSerializer(serializers.ModelSerializer):
    id_ruta = serializers.Field(source='LINEID.LINEID')
    nombre_parada = serializers.Field(source='STOPID.LONGNAME')
    nombre_ruta = serializers.Field(source='LINEID.SHORTNAME')
    orientacion = serializers.Field(source='ORIENTATION')

    class Meta:
        model = LineStops
        fields = ('nombre_parada', 'nombre_ruta', 'id_ruta', 'orientacion')


class StopsField(serializers.RelatedField):
    def to_native(self, value):
        return '%s' % value.STOPS_STOPID_END.LONGNAME


class ArcsSerializer(serializers.ModelSerializer):
    nombre_parada = serializers.Field(source='STOPS_STOPID_END.LONGNAME')

    class Meta:
        model = Arcs
        fields = ('nombre_parada',)

