# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from mio import views as mioviews
from calificar import views as calificarviews

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

router = DefaultRouter()
router.register(r'paradas-cercanas', mioviews.ParadasCercanasViewSet, base_name='paradas_cercanas')
router.register(r'rutas-por-parada', mioviews.RutasPorParadaViewSet)
router.register(r'paradas-por-ruta', mioviews.ParadasPorRutaViewSet)
router.register(r'buscar', mioviews.BusquedaViewSet)
router.register(r'buscar-parada', mioviews.BusquedaParadasViewSet)
router.register(r'calificar', calificarviews.CalificarViewSet)

urlpatterns = patterns('',

    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^api/v1/', include(router.urls)),
    # url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()
