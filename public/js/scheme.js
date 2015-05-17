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

  var services, hosts;

  $.getJSON('/services/', function (data) {
    services = data;

    $.getJSON('/hosts/', function (data) {
      hosts = data;

      buildScheme(services, hosts);
    });
  });


  var buildScheme = function (services, hosts) {
   
    var createHostView = function (host) {
      var rect = new joint.shapes.basic.Rect({
        id:  host._id,
        position: { x: 20, y: 20 },
        size: { width: 400, height: 180 },
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
  };
}());