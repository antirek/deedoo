(function() {

  var Plot = function () {
    var graph = new joint.dia.Graph;

    var $app = $('#paper');

    var paper = new joint.dia.Paper({
      //el: $('#paper'),
      width: 1500, height: 900, gridSize: 1,
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

    var paperScroller = new joint.ui.PaperScroller({
        autoResizePaper: true,
        padding: 50,
        paper: paper
    });

    // Initiate panning when the user grabs the blank area of the paper.
    paper.on('blank:pointerdown', paperScroller.startPanning);

    paperScroller.$el.css({
        width: '100%',
        height: '500'
    });

    $app.append(paperScroller.render().el);

    // Example of centering the paper.
    //paperScroller.center();

    graph.on('change:position', function(cell) {

        var parentId = cell.get('parent');
        if (!parentId) return;

        var parent = graph.getCell(parentId);
        var parentBbox = parent.getBBox();
        var cellBbox = cell.getBBox();

        if (parentBbox.containsPoint(cellBbox.origin()) &&
            parentBbox.containsPoint(cellBbox.topRight()) &&
            parentBbox.containsPoint(cellBbox.corner()) &&
            parentBbox.containsPoint(cellBbox.bottomLeft())) {

            // All the four corners of the child are inside
            // the parent area.
            return;
        }

        // Revert the child position.
        cell.set('position', cell.previous('position'));
    });

    $('#toPNG').on('click', function() {

        var windowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
        var windowName = _.uniqueId('png_output');
        var imageWindow = window.open('', windowName, windowFeatures);

        paper.toPNG(function (dataURL) {
            imageWindow.document.write('<img src="' + dataURL + '"/>');
          }, { padding: 10 });
    });

    return {
      graph: graph
    }
  };

  var ObjectId = function (id) { return id };


  var services = [
    { "__v" : 0, "_id" : ObjectId("5554b696e1f356b9384356f7"), "dependencies" : [ ], "host_id" : "5554b670e1f356b9384356f6", "name" : "db server 1", "port" : "3306", "resources" : [   {   "_id" : ObjectId("5554b696e1f356b9384356f8"),   "password" : "1234",  "username" : "root",  "name" : "main" },  {   "password" : "1234",  "username" : "root",  "name" : "actions",   "_id" : ObjectId("5554b6ade1f356b9384356fa") } ] },
    { "__v" : 0, "_id" : ObjectId("5554b6dde1f356b9384356fb"), "dependencies" : [   {   "_id" : ObjectId("5554b6dde1f356b9384356fc"),   "resource_id" : "main", "role" : "config",  "service_id" : "5554b696e1f356b9384356f7" } ], "host_id" : "5554b670e1f356b9384356f6", "name" : "pbx", "port" : "3000", "resources" : [ {   "password" : "admin",   "username" : "admin",   "name" : "ami",   "_id" : ObjectId("5554bbe4e1f356b9384356fd") } ] },
    { "__v" : 0, "_id" : ObjectId("55561abc43e49e2755b0ab35"), "dependencies" : [ ], "host_id" : "555775c17a624adb2916eebb", "name" : "rabbit mq 1", "port" : "4050", "resources" : [   {   "name" : "queue_mail",  "username" : "admin",   "password" : "admin",   "_id" : ObjectId("55561abc43e49e2755b0ab37") },   {   "_id" : ObjectId("55570869069762412a882623"),   "name" : "queue_sms",   "username" : "admin",   "password" : "admin" } ] },
    { "__v" : 0, "_id" : ObjectId("5554cf9fe1f356b9384356fe"), "dependencies" : [   {   "_id" : ObjectId("5554cf9fe1f356b9384356ff"),   "resource_id" : "main", "role" : "data",  "service_id" : "5554b696e1f356b9384356f7" },  {   "resource_id" : "queue_mail",   "role" : "mail",  "service_id" : "55561abc43e49e2755b0ab35",  "_id" : ObjectId("55570883069762412a882625") },   {   "resource_id" : "queue_sms",  "role" : "sms",   "service_id" : "55561abc43e49e2755b0ab35",  "_id" : ObjectId("55570883069762412a882624") } ], "host_id" : "5554b670e1f356b9384356f6", "name" : "веб-кабинет", "port" : "80", "resources" : [ ] },
    { "name" : "api", "host_id" : "555775c17a624adb2916eebb", "port" : "4060", "_id" : ObjectId("555708bf069762412a882626"), "dependencies" : [   {   "_id" : ObjectId("555708bf069762412a882628"),   "resource_id" : "main",   "role" : "config",  "service_id" : "5554b696e1f356b9384356f7" },  {   "_id" : ObjectId("555708bf069762412a882627"),   "resource_id" : "ami",  "role" : "realtime access",   "service_id" : "5554b6dde1f356b9384356fb" } ], "resources" : [ ], "__v" : 0 }
  ];

  var hosts = [
    { "name" : "Host 1", "ip" : "192.168.123.1", "_id" : ObjectId("5554b670e1f356b9384356f6"), "__v" : 0 },
    { "name" : "Host 2", "ip" : "192.168.123.2", "_id" : ObjectId("555775c17a624adb2916eebb"), "__v" : 0 }
  ];


  var createHostView = function (host) {
    var rect = new joint.shapes.basic.Rect({
      id:  host._id,
      position: { x: 20, y: 20 },
      size: { width: 400, height: 300 },
      attrs: { rect: { fill: '#E74C3C' }, text: { text: host.name } }
    });
    return rect;
  };


  var plot = new Plot();

  var hostViews = hosts.map(function (item, i) {
    var m = createHostView(item);    
    plot.graph.addCell(m);
    m.translate(500 * (i % 2), 200 * parseInt(i / 2));
    return m;
  });

  var findHostViewById = function (id) {
    return hostViews.filter(function (item) {
      return item.id == id;
    })[0];
  };




  var createServiceView = function (service) {
    var resources = service.resources;
    var dependencies = service.dependencies;

    var max = Math.max(resources.length, dependencies.length);

    var height = (max > 2 ? max : 2) * 30;

    var outPorts = resources.map(function (item) {
      return item.name;
    });

    var inPorts = dependencies.map(function (item, i) {
      return i + 1;
    })

    var model = new joint.shapes.devs.Model({
      id: service._id,
      //position: { x: 50, y: 50 },
      size: { width: 90, height: height },
      inPorts: inPorts,
      outPorts: outPorts,
      attrs: {
        '.label': { text: service.name, 'ref-x': .5, 'ref-y': .1 },
        rect: { fill: '#2ECC71' },
        '.inPorts circle': { fill: '#16AF85', magnet: 'passive', type: 'input' },
        '.outPorts circle': { fill: '#E74C3C', type: 'output' }
      }
    });

    return model;
  };

  hosts.map(function (host, host_i) {
    var host_service_i = 0;
    services.map(function (service, service_i) {
      if (host._id == service.host_id) {
        var m = createServiceView(service);
        var hostView = findHostViewById(service.host_id);
        hostView.embed(m);
        plot.graph.addCell(m);
        
        m.translate(
          hostView.position().x + 20 + (host_service_i % 3) * 130, 
          hostView.position().y + 20 + parseInt(host_service_i / 3) * 100
        );
        
        host_service_i += 1;
      };
    });

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

        //link.set('router', { name: 'metro' });
        plot.graph.addCell(link);

      });
    }
  });

}());