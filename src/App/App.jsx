import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Model({ url, scale = 2 }) {
  const { scene } = useGLTF(url);
  const carRef = useRef();

  useFrame(() => {
    if (carRef.current) {
      carRef.current.rotation.y += 0.01;
    }
  });

  return <primitive ref={carRef} object={scene} scale={scale} />;
}

function App() {
  const [CarChoice, setCarChoice] = useState("");
  const navigate = useNavigate();

  const Orange_Car = '/Orange_Car.glb';
  const Green_Car = '/Green_Car.glb';
  const Purple_Car = '/Purple_Car.glb';

  const handleCarClick = (carName) => {
    setCarChoice(carName);
    console.log(carName);
  };

  const handleClickStart = () => {
    if (CarChoice) {
      let selectedCarFile = '';

      if (CarChoice === 'Orange Car') {
        selectedCarFile = Orange_Car;
      } else if (CarChoice === 'Green Car') {
        selectedCarFile = Green_Car;
      } else if (CarChoice === 'Purple Car') {
        selectedCarFile = Purple_Car;
      }

    
      console.log('Navigating to game page..');

      navigate('/game', 
        {state: { 
          carChoice: CarChoice,
          carFile: selectedCarFile,
        },
      });
    }
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
        <h2 className="SelectedCarText">Selected Car:</h2>
        <h3
          className={
            CarChoice === 'Orange Car'
              ? 'CarChoiceTextOrange'
              : CarChoice === 'Green Car'
              ? 'CarChoiceTextGreen'
              : CarChoice === 'Purple Car'
              ? 'CarChoiceTextPurple'
              : 'CarChoiceText'
          }
        >
          {CarChoice}
        </h3>

        <h3
          className={CarChoice === '' ? 'StartButtonGrey' : 'StartButtonGreen'}
          onClick={handleClickStart}
          style={{ cursor: CarChoice !== '' ? 'pointer' : 'default' }}
        >
          Let's Drive!
        </h3>
      </div>
    </div>
  );
}

export default App;
