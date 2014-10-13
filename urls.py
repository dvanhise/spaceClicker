from django.conf.urls import patterns, url
from spaceClicker import views

urlpatterns = patterns('',
  url(r'^$', views.main),
  url(r'^save/$', views.save),
)