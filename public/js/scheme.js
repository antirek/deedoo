(function() {

  var graph = new joint.dia.Graph;

  var paper = new joint.dia.Paper({
      el: $('#paper'),
      width: 650, height: 200, gridSize: 1,
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

  var m1 = new joint.shapes.devs.Model({
      position: { x: 50, y: 50 },
      size: { width: 90, height: 90 },
      inPorts: ['in1','in2'],
      outPorts: ['out1', 'out2', 'out3'],
      attrs: {
          '.label': { text: 'Model', 'ref-x': .4, 'ref-y': .2 },
          rect: { fill: '#2ECC71' },
          '.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
          '.outPorts circle': { fill: '#E74C3C', type: 'output' }
      }
  });
  
  graph.addCell(m1);

  var m2 = m1.clone();
  m2.translate(300, 0);
  graph.addCell(m2);
  m2.attr('.label/text', 'Model 2');

  var link = new joint.shapes.devs.Link({
     source: {
       id: m1.id,
       port: 'out2'
     },
     target: {
       id: m2.id,
       port: 'in1'
     },
     attrs: { 
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } 
     }
   });

  var link2 = new joint.shapes.devs.Link({
     source: {
       id: m1.id,
       port: 'out3'
     },
     target: {
       id: m2.id,
       port: 'in2'
     },
     attrs: { 
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } 
     }
   });

  graph.addCell(link);
  graph.addCell(link2);
    
}())