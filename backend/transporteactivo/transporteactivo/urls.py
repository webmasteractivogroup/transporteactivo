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
router.register(r'rutas-por-parada', views.RutasPoParadaViewSet)
router.register(r'paradas-por-ruta', views.ParadasPorRutaViewSet)


urlpatterns = patterns('',

    # url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^v1/', include(router.urls)),
    url(r'^v1/buscar/$', views.BusquedaView.as_view(), name='buscar'),
    # Examples:
    # url(r'^$', 'transporteactivo.views.home', name='home'),
    # url(r'^transporteactivo/', include('transporteactivo.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
