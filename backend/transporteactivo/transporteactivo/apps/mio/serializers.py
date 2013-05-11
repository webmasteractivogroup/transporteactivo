# -*- coding: utf-8 -*-
from sgco.models import LineStops
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


class LineNameSerializerField(serializers.Field):

    def to_native(self, obj):
        return obj.get_name_line()


class LinesStopsSerializer(serializers.ModelSerializer):
    ruta = serializers.Field(source='LINEID.SHORTNAME')
    parada = serializers.Field(source='STOPID.LONGNAME')

    class Meta:
        model = LineStops
        fields = ('parada', 'ruta')
















