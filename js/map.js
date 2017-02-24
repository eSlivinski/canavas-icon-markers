var map,
    renderer;

function makeMap () {
  var basemap = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });

  map = L.map('map', {
    center: [43.09271, -89.39232],
    zoom: 12,
    layers: [basemap],
    renderer: L.canvas()
  });

  defineRenderer();
}

function defineRenderer() {
  L.MySweetRenderer = L.Canvas.extend({
    // Called when the circle gets rendered
    _updateCircle: function(layer) {

  		if (!this._drawing || layer._empty()) { return; }

  		var p = layer._point,
  		    ctx = this._ctx,
  		    r = layer._radius,
  		    s = (layer._radiusY || r) / r;

  		this._drawnLayers[layer._leaflet_id] = layer;

      // http://stackoverflow.com/questions/35570801/how-to-draw-font-awesome-icons-onto-html-canvas
      ctx.font="20px FontAwesome";
      ctx.fillStyle = layer.options.color;
      ctx.fillText(layer.options.content, p.x, p.y)

    }
  });
  renderer = new L.MySweetRenderer();
  addPoints();
}

function addPoints() {
  var bounds = map.getBounds(),
      points = _.range(50);

  var flag = '\uf11d',
      umbrella = '\uf0e9';

  _.forEach(points, (d,i) => {
    var lat = _.random(bounds._northEast.lat, bounds._southWest.lat, 8),
        lng = _.random(bounds._northEast.lng, bounds._southWest.lng, 8);

    // We will probably want to extend L.Path, but hacking at L.Circle works too!
    L.circleMarker(L.latLng(lat, lng), {
      content: i % 2 ? flag : umbrella,
      color: i % 2 ? 'purple' : 'pink',
      renderer: renderer
    }).addTo(map);
  });
}

window.onload = function() {
  setTimeout(function() {
    makeMap()
  }, 1000);
};
