var mapnik = require('mapnik');
var mapnikify = require('@mapbox/geojson-mapnikify');
var fs = require('fs');

if (process.argv.length < 5) {
  console.log(`Usage: node ${process.argv[1]} <geojsonfile> <width> <height>`)
  process.exit(1)
}

var width = Number(process.argv[3])
var height = Number(process.argv[4])
var outputFilename = `${process.argv[2]}.png`

/* read GeoJSON into variable */
var filename = process.argv[2];
var geojson = JSON.parse(fs.readFileSync(filename));

/* convert GeoJSON to Mapnik XML */
mapnikify(geojson, false, function(err, xml){
  if(err) throw err;

  /* render the Mapnik XML */
  var map = new mapnik.Map(width, height);
  mapnik.register_default_input_plugins();
  map.fromString(xml, {}, function(err,map) {
      if (err) throw err;
      map.zoomAll();
      var im = new mapnik.Image(width, height);
      map.render(im, function(err,im) {
        if (err) throw err;
        im.encode('png', function(err,buffer) {
            if (err) throw err;
            fs.writeFile(outputFilename, buffer, function(err) {
                if (err) throw err;
                console.log('saved map image to '+outputFilename);
            });
        });
      });
  });
});
