import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Game.css';
import Road from '../../public/Road.jpg'

function Game() {
  const mountRef = useRef(null);
  const location = useLocation();
  const carChoice = location.state?.carChoice;
  const carGLBFile = location.state?.carFile;

  useEffect(() => {
    //! Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03d3fc); // Blue color

    //! Camera
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4; 
    camera.position.y = 3;

    //! Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //! GRID - Scene
    const gridHelper = new THREE.GridHelper(10, 10); // Size of grid and number of divisions
    scene.add(gridHelper);

    //! Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    //! Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable smooth controls
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false; // Prevent panning across the screen

    //TODO - THE ROAD
    //* Load Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(Road);

    //* Set texture wrapping and repeat
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    //* Create the plane geometry and material
    const planeGeometry = new THREE.PlaneGeometry(12, 12); // BoxGeometry for the plane
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture }); 
    const plane = new THREE.Mesh(planeGeometry, planeMaterial); 

    //* Set position and rotation
    plane.position.z = 0;
    plane.rotation.x = -Math.PI / 2;
    plane.rotation.z = Math.PI /2;
    scene.add(plane); 


    //TODO - Box Car
   //* Create the plane geometry and material
    const boxGeometry = new THREE.BoxGeometry(.5, .5, .5); // BoxGeometry for the box
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red material
    const box = new THREE.Mesh(boxGeometry, boxMaterial); 

    //* Set position and rotation
    box.position.y = 0.25; 
    box.position.z = 0; 
    scene.add(box);

    const handleKeyDown = (event) => {
      if (event.key === "w") {
        box.position.z -= 1;
      } else if (event.key === "a") {
        box.position.x -= 1;
      } else if (event.key === "d") {
        box.position.x += 1;
      } else if (event.key === "s") {
        box.position.z += 1;
      }
    };

    window.addEventListener("keydown", handleKeyDown);


    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update the controls for smooth movement
      controls.update(); 
  
      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [carGLBFile]); // Re-run when carGLBFile changes

  return (
    <div>
      <div ref={mountRef}>
        
      </div>
    </div>
  );
}

export default Game;
