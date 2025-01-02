import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './Game.css';
import Road from '/Road.jpg';

function Game() {
  const mountRef = useRef(null);
  const location = useLocation();
  const carGLBFile = location.state?.carFile;

  useEffect(() => {
    //! Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03d3fc);

    //! Initialize camera
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 5);

    //! Initialize renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //! Grid Helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    //! Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    //! ROAD
    const textureLoader = new THREE.TextureLoader();
    const roadTexture = textureLoader.load(Road);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 1);

    const planeGeometry = new THREE.PlaneGeometry(12, 12);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: roadTexture });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    scene.add(plane);

    //! BOX CAR
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 0.25, 0);
    scene.add(box);

    //! Camera offset relative to the box
    const cameraOffset = new THREE.Vector3(0, 3, 5);

    //! Track pressed keys
    const pressedKeys = {};
    let isJumping = false; // Track if the box is jumping

    //! Handle key presses
    const handleKeyDown = (event) => {
      pressedKeys[event.key] = true;

      // Handle spacebar jump
      if (event.key === " " && !isJumping) {
        isJumping = true;

        // Smooth jump using GSAP
        gsap.to(box.position, {
          y: 3,
          duration: 0.3, // Upward duration
          ease: "power1.out",
          onComplete: () => {
            gsap.to(box.position, {
              y: 0.25,
              duration: 0.3, // Downward duration
              ease: "power1.in",
              onComplete: () => {
                isJumping = false; // Allow another jump after landing
              },
            });
          },
        });
      }
    };

    const handleKeyUp = (event) => {
      pressedKeys[event.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    //! Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Handle box movement and rotation based on pressed keys
      const moveSpeed = 0.1;
      const rotationSpeed = 0.03;

      // Define forward and backward directions based on box rotation
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(box.quaternion); // Local forward direction
      const backward = new THREE.Vector3(0, 0, 1).applyQuaternion(box.quaternion); 

      if (pressedKeys["w"]) {
        box.position.add(forward.multiplyScalar(moveSpeed)); // Move forward along local Z axis
      }
      if (pressedKeys["s"]) {
        box.position.add(backward.multiplyScalar(moveSpeed)); // Move backward along local Z axis
      }
      if (pressedKeys["a"]) {
        box.rotation.y += rotationSpeed; // Rotate left
      }
      if (pressedKeys["d"]) {
        box.rotation.y -= rotationSpeed; // Rotate right
      }

      // Update the camera position relative to the box
      const relativeOffset = new THREE.Vector3(0, 3, 5); // Adjust as needed
      const rotatedOffset = relativeOffset.applyEuler(box.rotation); // Apply box's rotation to the offset
      const cameraPosition = new THREE.Vector3().addVectors(box.position, rotatedOffset);


      // Ensure the camera looks at the box
      camera.position.copy(cameraPosition);
      camera.lookAt(box.position);

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    //! Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [carGLBFile]);

  return <div ref={mountRef} />;
}

export default Game;
