import * as THREE from 'https://cdn.skypack.dev/three@0.124.0';
import orbitControls from 'https://cdn.skypack.dev/three-orbit-controls';



// threejs boilerplate
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('cv-container');
const containerRect = container.getBoundingClientRect();
renderer.setSize( containerRect.width, containerRect.height );
document.getElementById("cv-container").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, containerRect.width / containerRect.height, 0.1, 1000 );
camera.position.set(9,5,10);

// orbit controls
const OrbitControls = orbitControls(THREE);
const controls = new OrbitControls(camera, renderer.domElement);

// helpers
const axisHelper = new THREE.AxesHelper( 5 );
scene.add( axisHelper );
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

// geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
scene.add( box );

const planeGeometry = new THREE.PlaneGeometry( 5, 5, 32 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = Math.PI / 2;
scene.add( plane );

const loader = new THREE.FontLoader();

loader.load( './assets/Roboto_Regular.json', function ( font ) {

    const color = 0x006699;

    const matDark = new THREE.LineBasicMaterial( {
        color: color,
        side: THREE.DoubleSide
    } );

    const matLite = new THREE.MeshBasicMaterial( {
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    } );

    const message = 'Test';

    const shapes = font.generateShapes( message, 1 );

    const geometry = new THREE.ShapeGeometry( shapes );

    geometry.computeBoundingBox();

    const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

    geometry.translate( xMid, 0, 0 );

    // make shape ( N.B. edge view not visible )

    const text = new THREE.Mesh( geometry, matLite );
    text.position.z = 0;
    scene.add( text );

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];

    for ( let i = 0; i < shapes.length; i ++ ) {

        const shape = shapes[ i ];

        if ( shape.holes && shape.holes.length > 0 ) {

            for ( let j = 0; j < shape.holes.length; j ++ ) {

                const hole = shape.holes[ j ];
                holeShapes.push( hole );

            }

        }

    }

    shapes.push.apply( shapes, holeShapes );

    const lineText = new THREE.Object3D();

    for ( let i = 0; i < shapes.length; i ++ ) {

        const shape = shapes[ i ];

        const points = shape.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        geometry.translate( xMid, 0, 0 );

        const lineMesh = new THREE.Line( geometry, matDark );
        lineText.add( lineMesh );

    }

    scene.add( lineText );

} ); //end load function

// animation loop
function animate() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();
