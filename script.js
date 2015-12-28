(function () {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var renderer;
  var geometry, material, sphere;

  function init () {
    var initPromise = new Promise(function (resolve, reject) {
      
      if (Detector.webgl) { // WebGL
        renderer = new THREE.WebGLRenderer();
        resolve();
      } else { // Canvas
        /* Load script */
        var head = document.getElementsByTagName('head')[0];
        var allFilesPromises = [];
        var filesToLoad = [
          'dependencies/CanvasRenderer.js',
          'dependencies/Projector.js'
        ];
        filesToLoad.forEach(function (file) {
          var filePromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = file;
            script.onload = function () {
              resolve();
            };
            script.onerror = function () {
              console.error(file + ' does not load');
              reject('Error loading : ' + file);
            };
            head.appendChild(script);
          });
          allFilesPromises.push(filePromise);
        });
        /* Set renderer */
        Promise.all(allFilesPromises)
          .then(function () {
            renderer = new THREE.CanvasRenderer();
            resolve();
          })
          .catch(function () {
            console.error('Error loading external resources');
            reject('Error loading external resources');
          });
      }
    });
    return initPromise;
  }

  function createWorld () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    geometry = new THREE.SphereGeometry(2, 50, 50, 0, Math.PI * 2, 0, Math.PI);
    material = new THREE.MeshBasicMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sphere.rotation.x = 0.7;
    sphere.rotation.y = -1.6;

    var loader = new THREE.TextureLoader();
    loader.load(
      'land_ocean_ice_cloud_2048.jpg',
      function (texture) { // Function when resource is loaded
        scene.remove(sphere);
        material = new THREE.MeshBasicMaterial({map: texture});
        sphere.material = material;
        scene.add(sphere);
      },
      function (xhr) {	// Function called when download progresses
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (xhr) {	// Function called when download errors
        console.error('An error happened');
      }
    );
    function render() {
      requestAnimationFrame(render);
      sphere.rotation.y -= 0.005;
      renderer.render(scene, camera);
    }
    render();
  }

  init()
    .then(function () {
      createWorld();
    })
    .catch(function () {
      window.alert('Une erreur est survenue. Veuillez réessayer puis contacter un administrateur si le problème persiste.');
    });
})();
