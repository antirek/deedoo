(function() {

  var Plot = function () {
    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
      el: $('#paper'),
      width: 1050, height: 600, gridSize: 1,
      model: graph,
      defaultLink: new joint.dia.Link({
          attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
      }),
      validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
          // Prevent linking from input ports.
          if (magnetS && magnetS.getAttribute('type') === 'input') return false;
          // Prevent linking from output ports to input ports within one element.
          if (cellViewS === cellViewT) return false;
          // Prevent linking to input ports.
          return magnetT && magnetT.getAttribute('type') === 'input';
      },
      validateMagnet: function(cellView, magnet) {
          // Note that this is the default behaviour. Just showing it here for reference.
          // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
          return magnet.getAttribute('magnet') !== 'passive';
      }
    });

    return {
      graph: graph
    }
  };

  var ObjectId = function(id){ return id };

  var services = [
    { "__v" : 0, "_id" : ObjectId("5554b696e1f356b9384356f7"), "dependencies" : [ ], "host_id" : "5554b670e1f356b9384356f6", "name" : "db server 1", "port" : "3306", "resources" : [   {   "_id" : ObjectId("5554b696e1f356b9384356f8"),   "password" : "1234",  "username" : "root",  "name" : "main" },  {   "password" : "1234",  "username" : "root",  "name" : "actions",   "_id" : ObjectId("5554b6ade1f356b9384356fa") } ] },
    { "__v" : 0, "_id" : ObjectId("5554b6dde1f356b9384356fb"), "dependencies" : [   {   "_id" : ObjectId("5554b6dde1f356b9384356fc"),   "resource_id" : "main", "role" : "config",  "service_id" : "5554b696e1f356b9384356f7" } ], "host_id" : "5554b670e1f356b9384356f6", "name" : "pbx", "port" : "3000", "resources" : [ {   "password" : "admin",   "username" : "admin",   "name" : "ami",   "_id" : ObjectId("5554bbe4e1f356b9384356fd") } ] },
    { "name" : "веб-кабинет", "host_id" : "5554b670e1f356b9384356f6", "port" : "80", "_id" : ObjectId("5554cf9fe1f356b9384356fe"), "dependencies" : [   {   "service_id" : "5554b696e1f356b9384356f7",  "role" : "data",  "resource_id" : "main",   "_id" : ObjectId("5554cf9fe1f356b9384356ff") } ], "resources" : [ ], "__v" : 0 },
    { "host_id" : "5554b670e1f356b9384356f6", "name" : "dsfdsf", "port" : "dsf", "_id" : ObjectId("55561abc43e49e2755b0ab35"), "dependencies" : [   {   "service_id" : "5554b6dde1f356b9384356fb",  "role" : "1",   "resource_id" : "ami", "_id" : ObjectId("55561abc43e49e2755b0ab36") } ], "resources" : [  {   "name" : "dsfd",  "username" : "dsf",   "password" : "dsfsdfdsf",   "_id" : ObjectId("55561abc43e49e2755b0ab37") } ], "__v" : 0 }
  ];


  var plot = new Plot();

  var createServiceView = function (service) {
    var resources = service.resources;
    var dependencies = service.dependencies;

    var max = Math.max(resources.length, dependencies.length);

    var height = (max > 2 ? max : 2) * 50;

    var outPorts = resources.map(function (item) {
      return item.name;
    });

    var inPorts = dependencies.map(function (item, i) {
      return i + 1;
    })

    var model = new joint.shapes.devs.Model({
      id: service._id,
      position: { x: 50, y: 50 },
      size: { width: 90, height: height },
      inPorts: inPorts,
      outPorts: outPorts,
      attrs: {
          '.label': { text: service.name, 'ref-x': .4, 'ref-y': .1 },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
      }
    });

    return model;
  };

  services.map(function (item, i) {
    var m = createServiceView(item);    
    plot.graph.addCell(m);
    m.translate(250 * (i % 4), 120 * parseInt(i / 4));
  });

  services.map(function (service) {
    var dependencies = service.dependencies;

    if (dependencies.length > 0) {
      dependencies.map(function (dependence, i) {
        var link = new joint.shapes.devs.Link({
          source: {
            id: dependence.service_id,
            port: dependence.resource_id
          },
          target: {
            id: service._id,
            port: i + 1
          },
          attrs: { 
            '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#EFEFEF' } 
          }
        });

        link.set('router', { name: 'metro' });
        plot.graph.addCell(link);

      });
    }
  });

}());