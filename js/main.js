let size = 100;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;

const loadImages = (paths, whenLoaded) => {
	let imgs = [];
	paths.forEach((path) => {
		let img = new Image;
		img.onload = () => {
			imgs.push(img);
			if (imgs.length == paths.length) whenLoaded(imgs);
		}
		img.src = path;
	});
}


const fillUp = (array, max) => {
	let length = array.length;
	for (let i=0; i<= max-length; i++) {
		array.push(array[Math.floor(Math.random() * length)])
	}
	return array;	
}


const getArrayFromImage = (img) => {
	let imageCoords = []; 
	ctx.clearRect(0,0,size,size);
	ctx.drawImage(img, 0, 0, size, size);

	let data = ctx.getImageData(0,0, size, size);
	data = data.data

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			let red = data[((size*y) + x) * 4];
			let green = data[((size * y) + x) * 4 + 1];
			let blue = data[((size * y) + x) * 4 + 2];
			let alpha = data [((size * y) + x) * 4 + 3];
			if (alpha > 0) {
			 	imageCoords.push([10*(size/2 - x), 10*(size/2 - y)]);
			}
		}
	}
	return fillUp(imageCoords, 7000);
}

let images = [
'img/cute-ghost.svg', 
'img/skull.svg', 
'img/dog.svg', 
'img/penguin.svg', 
'img/koala.svg', 
'img/paw.svg', 
'img/cat.svg',
'img/doge.svg', 
'img/kek.svg'
 ];

loadImages(images, (loadedImages) => {
	let gallery = [];
	loadedImages.forEach((el,index) => {
		gallery.push(getArrayFromImage(loadedImages[index]));
	})

	let camera, controls, scene, renderer,geometry;


	const init = () => {

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xcccccc );
		// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		let container = document.getElementById( 'container' );
		container.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.z = 800;

		controls = new THREE.OrbitControls( camera, renderer.domElement );


		
		let texture = (new THREE.TextureLoader).load("img/particle.png");
		let material = new THREE.PointsMaterial({
		  size: 8,
		  vertexColors: THREE.VertexColors,
		  map: texture,
		  alphaTest: 0.5,
		});
		
		geometry = new THREE.Geometry();
		let x, y, z;


		gallery[0].forEach((el, index) => {
			geometry.vertices.push(new THREE.Vector3(el[0], el[1], Math.random() * 100));
		  	geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
		});
		
		let pointCloud = new THREE.Points(geometry, material);
		scene.add(pointCloud);

		window.addEventListener( 'resize', onWindowResize, false );

	}

	const onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	


	let i = 0;
	const animate = () => {
		i++;
		requestAnimationFrame( animate );

		geometry.vertices.forEach((particle, index) =>{
			  let dX, dY, dZ;
			  dX = Math.sin(i / 10 + index / 2) / 20;
			  dY = Math.cos(i / 10 + index / 2) / 20;
			  dZ = Math.sin(i / 10 + index / 2) / 20;
			  particle.add(new THREE.Vector3(dX, dY, dZ));
			});

		geometry.verticesNeedUpdate = true;		


		render();

	}

	
	

	const render = () => {
		renderer.render( scene, camera );
	}

	init();
	animate();


	let current = 0;
	document.body.addEventListener('click', () => {
		current++;
		current = current % gallery.length;
		geometry.vertices.forEach((particle, index) => {
			let tl = new  gsap.timeline();
			tl.to(particle,1.5,{x:gallery[current][index][0], y:gallery[current][index][1]})
		});
	});

});
