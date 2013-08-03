/**
 * @author Matheo Fiebiger
 */
Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

var MapModule;
var mapview;
var paradas = new Array();
var updateMapTimeout;
var viewContenedora;
var activeRequest = false;
var isPopUpActive = false;
var popupWindow;

function PlanearViaje() {
    Ti.API.log('CREANDO MAPA ');

    var temp = Ti.App.tabgroup;
    temp.addEventListener('android:back', function (e) {

        if (isPopUpActive === false) {
            var dialog = Titanium.UI.createAlertDialog({
                message: '¿Quiere Salir de la App?',
                buttonNames: ['Si', 'No'],
            });
            dialog.show();
            dialog.addEventListener('click', function (e) {
                if (e.index == 0) {
                    temp.close();

                }
            });
        } else {
            isPopUpActive = false;
            viewContenedora.remove(blur);
            viewContenedora.remove(popupWindow);

        }
    });

    var laSearchBar = Ti.UI.createSearchBar({
        hintText: 'Busca barrio, dirección o lugar...',
        barColor: 'black',

    });

    Ti.App.sbTab1 = laSearchBar;

    laSearchBar.addEventListener('cancel', function (e) {
        Titanium.API.info('search bar:cancel received');
        laSearchBar.blur();
        laSearchBar.value = '';
        laSearchBar.showCancel = false;
    });

    laSearchBar.addEventListener('change', function (e) {
        if (laSearchBar.value.length === 0) {
            laSearchBar.showCancel = false;
        } else {
            laSearchBar.showCancel = true;
        }
    });

    laSearchBar.addEventListener('return', function (e) {

        laSearchBar.blur();


        Ti.API.info(q);
        var query = encodeURIComponent(laSearchBar.value);
        var q = query.split('%20').join('%22');
        Ti.API.info(q);
        busqueda_simple(q);
        // or whatever you want to forward geocode


    });
    var blur = Ti.UI.createView({
        opacity: 0.8,
        backgroundColor: 'gray',
        height: Ti.UI.FILL,
        width: Ti.UI.FILL
    });

    viewContenedora = Ti.UI.createView({
        height: Ti.FILL,
        width: Ti.FILL,
        layout: 'vertical'
    });

    viewSearch = Ti.UI.createView({
        height: '43dp',
        width: Ti.FILL
    });
    viewMapa = Ti.UI.createView({
        blur: blur,
        height: 'auto',
        width: Ti.FILL
    });

    if (Ti.Platform.osname === 'android') {
        MapModule = require('ti.map');
        /// GOOGLE MAPS API V2 INSERT HERE
        mapview = MapModule.createView({
            userLocation: true,
            userLocationButton: false,
            mapType: MapModule.NORMAL_TYPE,
            animate: true,
        });
    } else {
        mapview = Titanium.Map.createView({
            Height: Ti.FILL,
            Width: Ti.FILL,
            mapType: Titanium.Map.STANDARD_TYPE,
            animate: true,
            regionFit: true,
            userLocation: true
        });

    }

    // Handle click events on any annotations on this map.
    mapview.addEventListener('click', function (evt) {

        Ti.API.info('source:' + evt.clicksource);

        // Check for all of the possible names that clicksouce
        // can report for the left button/view.
        if (evt.clicksource == 'leftButton' || evt.clicksource == 'leftPane' || evt.clicksource == 'leftView') {
            Ti.API.info("Annotation " + evt.title + ", left button clicked.");
        }
        if (evt.clicksource === 'pin') {

            if (Ti.Platform.osname === 'android') {

            } else {

                mapview.deselectAnnotation(evt.title);
            }

            var popUpRuta = require("/ui/common/EmergenteOrigenDestino");
            isPopUpActive = true;

            popupWindow = popUpRuta.popup(viewMapa, evt.annotation.myid, evt.annotation.eltitle, evt.annotation.latlng, evt.annotation.tipo);
            viewMapa.add(blur);
            viewMapa.add(popupWindow);
            laSearchBar.blur();

        }
    });

    var goToMe = Titanium.UI.createButton({
        backgroundImage: '/images/userloc.png',
        top: '10 dp',
        right: '25 dp',
        width: '40 dp',
        height: '40 dp'

    });
    var goToMeLabel = Titanium.UI.createLabel({
        color: 'black',
        font: {
            fontWeight: 'bold',
            fontSize: '15 dp'
        },
        text: 'ubicame',
        top: '50 dp',
        right: '6 dp',
        width: '70 dp',
        height: '20 dp'

    });

    goToMe.addEventListener('click', function (e) {
        Titanium.Geolocation.getCurrentPosition(function (e) {
            var region = {
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
                animate: true,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };

            if (Ti.Platform.osname === 'android') {
                mapview.setRegion(region);
            } else {

                mapview.setLocation(region);
            }

        });
    });

    viewMapa.add(mapview);
    viewMapa.add(goToMe);
    viewMapa.add(goToMeLabel);
    viewSearch.add(laSearchBar);
    viewContenedora.add(viewSearch);
    viewContenedora.add(viewMapa);

    return viewContenedora;
};

var times = 0;

function getLocation() {
    if (times === 0) {
        times++;
        //Get the current position and set it to the mapview
        Titanium.Geolocation.getCurrentPosition(function (e) {

            Ti.API.log('USER ENCONTRADO, CAMBIANDO CAMARA HACIA ' + e.coords.latitude + ',' + e.coords.longitude);

            var region = {
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
                animate: true,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };

            if (Ti.Platform.osname === 'android') {
                mapview.setRegion(region);
            } else {

                mapview.setLocation(region);
            }
            Ti.API.log('GET REGION PARA PARADAS ');
            getParadas(region);

            Titanium.Geolocation.removeEventListener('location', function () {
                getLocation();
            });

            mapview.addEventListener('regionchanged', function (e) {

                Ti.API.log('REGION CHANGED');
                var region = {
                    latitude: e.latitude,
                    longitude: e.longitude,
                    animate: true,
                    latitudeDelta: e.latitudeDelta,
                    longitudeDelta: e.longitudeDelta
                };
                if (updateMapTimeout)
                    clearTimeout(updateMapTimeout);

                updateMapTimeout = setTimeout(function () {
                    // update your map
                    getParadas(region);
                }, 100);

            });

        });
    }
}

Titanium.Geolocation.addEventListener('location', function () {
    getLocation();
});

function getMapBounds(region) {
    var b = {};
    b.northWest = {};
    b.northEast = {};
    b.southWest = {};
    b.southEast = {};

    b.northWest.lat = region.latitude + (region.latitudeDelta / 2.0);
    b.northWest.lng = region.longitude - (region.longitudeDelta / 2.0);

    b.southWest.lat = region.latitude - (region.latitudeDelta / 2.0);
    b.southWest.lng = region.longitude - (region.longitudeDelta / 2.0);

    b.northEast.lat = region.latitude + (region.latitudeDelta / 2.0);
    b.northEast.lng = region.longitude + (region.longitudeDelta / 2.0);

    b.southEast.lat = region.latitude - (region.latitudeDelta / 2.0);
    b.southEast.lng = region.longitude + (region.longitudeDelta / 2.0);

    return b;
}

/// SERVICIO CONSULTA PARADAS

function getParadas(region) {

    Ti.API.log('LatitudDelta: ' + region.latitudeDelta);
    var delta = region.latitudeDelta;
    var bounds = getMapBounds(region);
    var url = "http://transporteactivo.com/api/v1/paradas-cercanas/?ne[]=" + bounds.northEast.lat + "&ne[]=" + bounds.northEast.lng + "&sw[]=" + bounds.southWest.lat + "&sw[]=" + bounds.southWest.lng;
    Ti.API.log('URL: ' + url);
    var json, parada, i;

    var xhr = Ti.Network.createHTTPClient({
        onload: function () {
            paradas = new Array();
            mapview.removeAllAnnotations();

            Ti.API.log('RESPUESTA: ' + this.responseText);

            json = JSON.parse(this.responseText);
            for (i = 0; i < json.length; i++) {
                parada = json[i];
                var imagen;

                var dpi = Titanium.Platform.displayCaps.dpi;

                if (dpi >= 240) {
                    if (parada.tipo_parada === 1) {
                        imagen = '/images/marker_icon_troncal@2x.png';
                    } else if (parada.tipo_parada === 2) {
                        imagen = '/images/marker_icon_pretroncal@2x.png';
                    } else {
                        imagen = '/images/marker_icon_alimentadora@2x.png';
                    }
                } else {
                    if (parada.tipo_parada === 1) {
                        imagen = '/images/marker_icon_troncal.png';
                    } else if (parada.tipo_parada === 2) {
                        imagen = '/images/marker_icon_pretroncal.png';
                    } else {
                        imagen = '/images/marker_icon_alimentadora.png';
                    }
                }

                if (Ti.Platform.osname === 'android') {
                    var pin = MapModule.createAnnotation({
                        latitude: parada.lat,
                        tipo: parada.tipo_parada,
                        longitude: parada.lng,
                        eltitle: parada.nombre,
                        image: imagen,
                        animate: true,
                        myid: parada.id, // Custom property to uniquely identify this annotation.
                        latlng: parada.lat + ';' + parada.lng,
                        classname: 'pin',
                    });
                } else {

                    var pin = Titanium.Map.createAnnotation({
                        latitude: parada.lat,
                        longitude: parada.lng,
                        title: parada.nombre,
                        image: imagen,
                        animate: true,
                        myid: parada.id, // Custom property to uniquely identify this annotation.
                        eltitle: parada.nombre,
                        latlng: parada.lat + ';' + parada.lng,
                        tipo: parada.tipo_parada
                    });
                }

                if (delta < 0.025) {
                    paradas.push(pin);
                } else {
                    if (parada.tipo_parada === 1) {
                        paradas.push(pin);
                    }
                };
            }
            Ti.API.log('NUMERO DE PARADAS: ' + paradas.length);
            mapview.addAnnotations(paradas);
            activeRequest = false;
        },
        onerror: function (e) {
            Ti.API.log("STATUS: " + this.status);
            Ti.API.log("TEXT:   " + this.responseText);
            Ti.API.log("ERROR:  " + e.error);
            alert('No se pudo contactar al servidor, intentelo de nuevo');
            activeRequest = false;
        },
        timeout: 5000
    });

    if (activeRequest === false) {
        Ti.API.log('Paradas request va a abrir');
        activeRequest = true;
        xhr.open("GET", url);
        xhr.send();
        Ti.API.log('Paradas request enviado');
    }

    return null;
}

function setOrigen(id, nombre) {

};

function busqueda_simple(query) {
    var xhr = Titanium.Network.createHTTPClient();
    Ti.API.info('http://maps.googleapis.com/maps/api/geocode/json?address=' + query + '+Cali+Colombia&sensor=true');
    xhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?address=' + query + '+Cali+Colombia&sensor=true');

    xhr.onload = function () {
        var json = JSON.parse(this.responseText);
        Ti.API.info(json);

        if (json.status != 'ZERO_RESULTS') {
            if (json.results[0].address_components[0].long_name != 'Cali') {

                var region = {
                    latitude: json.results[0].geometry.location.lat,
                    longitude: json.results[0].geometry.location.lng,
                    animate: true,
                    latitudeDelta: 0.007,
                    longitudeDelta: 0.007
                };

                if (Ti.Platform.osname === 'android') {
                    mapview.setRegion(region);
                } else {

                    mapview.setLocation(region);
                }
                Ti.App.sbTab1.blur();


            } else {
                dialogo_avanzada(query);
            }
        } else {
            dialogo_avanzada(query);
        }


    };
    xhr.send();
}

function busqueda_avanzada(query) {
    var xhr2 = Titanium.Network.createHTTPClient();
    Ti.API.info('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=3.423807,-76.521862&radius=50000&name=' + query + '&sensor=false&key=AIzaSyBK7aRCs-42mTtsZj92bQOCgNfYvXjLAcM');
    xhr2.open('GET', 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=3.423807,-76.521862&radius=50000&name=' + query + '&sensor=false&key=AIzaSyBK7aRCs-42mTtsZj92bQOCgNfYvXjLAcM');
    xhr2.onload = function () {
        var json = JSON.parse(this.responseText);
        Ti.API.info(json);
        if (json.status != 'ZERO_RESULTS') {
            var region = {
                latitude: json.results[0].geometry.location.lat,
                longitude: json.results[0].geometry.location.lng,
                animate: true,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };

            if (Ti.Platform.osname === 'android') {
                mapview.setRegion(region);
            } else {

                mapview.setLocation(region);
            }
            Ti.App.sbTab1.blur();
        } else {
            alert("Lo sentimos, la busqueda no retornó resultados");
        }

    };
    xhr2.send();
}

function dialogo_avanzada(query) {
    var dialogB = Titanium.UI.createAlertDialog({
        message: 'La busqueda inicial no retornó resultados, ¿Qué busca?',
        buttonNames: ['Lugar', 'Barrio', 'Dirección'],
    });
    dialogB.show();
    dialogB.addEventListener('click', function (e) {
        if (e.index == 0 || e.index == 1) {
            busqueda_avanzada(query);
        }

        if (e.index == 2) {
            alert("Lo sentimos, la dirección ingresada no retornó resultados. Lo invitamos a reformular la dirección y reintentar la busqueda");

        }
    });
}
module.exports = PlanearViaje;