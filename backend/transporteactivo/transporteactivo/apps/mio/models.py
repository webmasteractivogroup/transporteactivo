# -*- coding: utf-8 -*-
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point

from sgco.models import Stops


class MioStops(Stops):
    location = models.PointField(null=True)
    objects = models.GeoManager()

    def save(self, *args, **kwargs):
        self.location = Point(float(self.DECIMALLONGITUDE), float(self.DECIMALLATITUDE))
        super(MioStops, self).save(*args, **kwargs)
