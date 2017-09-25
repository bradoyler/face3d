/* global THREE */
var controls
var controlsB
var camera
var scene
var sceneB
var renderer
var rendererB
var face
var plane
var zTranslate = -30
var counter = 0
var direction = 'left'
var rotate = true

window.onload = function () {
  init()
  animate()
}

function init () {
  var container = document.getElementById('viewer_frame')
  var containerB = document.getElementById('viewer_frame_b')
  camera = new THREE.OrthographicCamera(-96, 96, -96, 96, 1, 1000)
  camera.up.set(0, 1, 0)
  camera.position.x = 40
  camera.position.y = 0
  camera.position.z = 75
  camera.zoom = 0.6
  camera.updateProjectionMatrix()

  scene = new THREE.Scene()
  scene.position.z = 0
  scene.position.y = 0
  sceneB = new THREE.Scene()
  sceneB.position.z = 0
  sceneB.position.y = 0

  var manager = new THREE.LoadingManager()

  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = Math.round(xhr.loaded / xhr.total * 100)
      if (percentComplete >= 100) {
        console.log('>>> Object Loaded', controls, controlsB)
        document.querySelectorAll('.errormsg')[0].style.display = 'none'
        document.querySelectorAll('.errormsg')[1].style.display = 'none'
      }
    }
  }

  if (!window.objname) {
    var objname = window.location.hash.substring(1)
  }
  var loader = new THREE.OBJVertexColorLoader(manager)
  loader.load('p/' + objname + '/model.obj', function (object) {
    object.children[0].material.side = THREE.DoubleSide
    object.translateX(-96)
    object.translateY(-96)
    object.translateZ(-30)
    scene.add(object)
    face = object
  }, onProgress, function () {})

  var material = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('p/' + objname + '/avatar.jpg')
  })

  // cube to hide the back of the face and background image
  var cube = new THREE.Mesh(new THREE.CubeGeometry(192, 192, 20))
  cube.position.set(0, 0, -11)
  cube.material.side = THREE.DoubleSide
  cube.material.color.setHex(0xcccccc)
  scene.add(cube)

  // plane
  plane = new THREE.Mesh(new THREE.PlaneGeometry(192, 192), material)
  plane.material.side = THREE.DoubleSide
  plane.scale.y = -1
  scene.add(plane)

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(462, 462)
  rendererB = new THREE.WebGLRenderer({ alpha: true })
  rendererB.setPixelRatio(window.devicePixelRatio)
  rendererB.setSize(462, 462)
  container.appendChild(renderer.domElement)
  containerB.appendChild(rendererB.domElement)

  controls = new THREE.OrbitControls(camera, renderer.domElement)
  controlsB = new THREE.OrbitControls(camera, rendererB.domElement)
}

function animate () {
  if (face != null) {
    face.translateZ(-zTranslate)
    zTranslate = document.getElementById('zTranslate').value
    face.translateZ(zTranslate)
  }
  if (plane != null) {
    plane.visible = document.getElementById('checkBackground').checked
  }
  render()
  if (counter > 80) {
    direction = 'right'
  } else if (counter < -20) {
    direction = 'left'
  }

  if (rotate === true && direction === 'left') {
    counter += 0.4
    scene.position.z = counter
  } else if (rotate === true) {
    counter -= 0.4
    scene.position.z = counter
  }
  window.requestAnimationFrame(animate)
}

function render () {
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
  rendererB.render(scene, camera)
}
