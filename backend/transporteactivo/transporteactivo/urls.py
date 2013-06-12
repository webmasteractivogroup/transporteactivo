# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import TemplateView

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
router.register(r'buscar-parada', views.BusquedaParadasViewSet)

urlpatterns = patterns('',

    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^api/v1/', include(router.urls)),
    # url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()
