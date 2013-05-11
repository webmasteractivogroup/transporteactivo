# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()


from mio.views import ParadasCercanasViewSet, RutasPoParadaViewSet, ParadasPorRutaViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api/v1/paradas-cercanas', ParadasCercanasViewSet)
router.register(r'api/v1/rutas-por-parada', RutasPoParadaViewSet)
router.register(r'api/v1/paradas-por-ruta', ParadasPorRutaViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    # Examples:
    # url(r'^$', 'transporteactivo.views.home', name='home'),
    # url(r'^transporteactivo/', include('transporteactivo.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
