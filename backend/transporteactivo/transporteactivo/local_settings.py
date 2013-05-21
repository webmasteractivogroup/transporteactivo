# -*- coding: utf-8 -*-
import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG
PROJECT_DIR = os.path.dirname(__file__)

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(PROJECT_DIR, 'static')


DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'sgco',
        'USER': 'transporteactivo',
        'PASSWORD': '@#ActivoGroup2013#@',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Email settings
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'noreply@ciudadanosactivos.com'
EMAIL_HOST_PASSWORD = 'ciudadanosactivos2012'
DEFAULT_FROM_EMAIL = "Ciudadanos Activos <noreply@ciudadanosactivos.com>"
EMAIL_SUBJECT_PREFIX = "No Reply Ciudadanos Activos"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
