/* global THREE */
/**
 * @author mrdoob / http://mrdoob.com/
 * @author sean bradley / https://www.youtube.com/user/seanwasere
 */

THREE.OBJVertexColorLoader = function (manager) {
  this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager
  this.materials = null
}

THREE.OBJVertexColorLoader.prototype = {
  constructor: THREE.OBJVertexColorLoader,

  load: function (url, onLoad, onProgress, onError) {
    var scope = this

    var loader = new THREE.XHRLoader(scope.manager)

    loader.setPath(this.path)

    loader.load(url, function (text) {
      onLoad(scope.parse(text))
    }, onProgress, onError)
  },

  setPath: function (value) {
    this.path = value
  },

  parse: function (text) {
    var container = new THREE.Group()
    var geometry = new THREE.Geometry()
    var vertices = []
    var vertexColors = []
    var faces = []

    // v float float float float float float (vertex with rgb)
    // eslint-disable-next-line
    var vertexColourPattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/

        // f vertex vertex vertex ...
    var facePattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/

    var lines = text.split('\n')

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i]
      line = line.trim()
      var result

      if (line.length === 0 || line.charAt(0) === '#') {
        continue
      } else if ((result = vertexColourPattern.exec(line)) !== null) {
        vertices.push(
                    new THREE.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]))
                )
        vertexColors.push(new THREE.Color(parseFloat(result[4]), parseFloat(result[5]), parseFloat(result[6])))
      } else if ((result = facePattern1.exec(line)) !== null) {
        faces.push(new THREE.Face3(result[1] - 1, result[2] - 1, result[3] - 1))
      }
    }

    for (var j = 0; j < vertices.length; j++) {
      geometry.vertices.push(vertices[j])
    }
    for (var k = 0; k < faces.length; k++) {
      faces[k].vertexColors[0] = vertexColors[faces[k].a]
      faces[k].vertexColors[1] = vertexColors[faces[k].b]
      faces[k].vertexColors[2] = vertexColors[faces[k].c]
      geometry.faces.push(faces[k])
    }

    var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
    var mesh = new THREE.Mesh(geometry, material)
    container.add(mesh)

    return container
  }
}
