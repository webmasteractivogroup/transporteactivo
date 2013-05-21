# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
# from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from mio import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

router = DefaultRouter()
router.register(r'paradas-cercanas', views.ParadasCercanasViewSet)
router.register(r'rutas-por-parada', views.RutasPorParadaViewSet)
router.register(r'paradas-por-ruta', views.ParadasPorRutaViewSet)
router.register(r'buscar', views.BusquedaViewSet)

urlpatterns = patterns('',

    url(r'^v1/', include(router.urls)),
    # url(r'^admin/', include(admin.site.urls)),
)
