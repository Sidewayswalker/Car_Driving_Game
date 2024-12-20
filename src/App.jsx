import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // React-three-fiber for rendering 3D graphics
import { useGLTF } from '@react-three/drei';           // GLTF loader from drei for loading 3D models
import './App.css';

// Component to load and display a 3D car model
function Model({ url, scale = 2 }) {
  const { scene } = useGLTF(url); // Load the GLTF model from the provided URL
  const carRef = useRef();        // Reference to the car model for manipulation

  // Rotates the car on each frame
  useFrame(() => {
    if (carRef.current) {
      carRef.current.rotation.y += 0.01; // Rotate the car around the Y-axis
    }
  });

  // Return the 3D model wrapped in a primitive component
  return <primitive ref={carRef} object={scene} scale={scale} />;
}

function App() {
  const [CarChoice, setCarChoice] = useState(""); // State to store the selected car

  const Orange_Car = '/Orange_Car.glb'; // URL for the orange car model file
  const Green_Car = '/Green_Car.glb';   // URL for the green car model file
  const Purple_Car = '/Purple_Car.glb'; // URL for the purple car model file

  // Function to handle canvas click and set the selected car
  const handleCarClick = (carName) => {
    setCarChoice(carName);
    console.log(CarChoice);
  };

  return (
    <div>
      <h1 className="main-title">Welcome!</h1>
      <p className="subtitle">Choose your Vehicle!</p>

      <div className="canvas-container">
        <Canvas 
          className="orange-car-canvas"
          onClick={() => handleCarClick('Orange Car')}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} />
          <Model url={Orange_Car} />
        </Canvas>

        <Canvas 
          className="green-car-canvas"
          onClick={() => handleCarClick('Green Car')}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} />
          <Model url={Green_Car} />
        </Canvas>

        <Canvas 
          className="purple-car-canvas"
          onClick={() => handleCarClick('Purple Car')}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} />
          <Model url={Purple_Car} />
        </Canvas>
      </div>

    <div>
      <h2 className='SelectedCarText'>Selected Car:</h2>

      <h3 className={CarChoice === 'Orange Car' ? 'CarChoiceTextOrange' : 
          (CarChoice === 'Green Car' ? 'CarChoiceTextGreen' : 
          (CarChoice === 'Purple Car' ? 'CarChoiceTextPurple' : 'CarChoiceText'))}>
        {CarChoice}
      </h3>

    </div>
  </div>
  );
}

export default App; // Export the main App component
