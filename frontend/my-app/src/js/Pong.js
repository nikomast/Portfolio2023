import React, { useState, useEffect, useRef } from 'react';
//import '../css/Pong.css';
import { Link } from 'react-router-dom';

function App() {
  const [isGameRunning, setIsGameRunning] = useState(true);
  const [gameState, setGameState] = useState({
    ball: {
      x: 200,
      y: 200,
      velocityX: 5,
      velocityY: 5,
      radius: 5,
    },
    leftPaddle: {
      y: 200,
      height: 40,
      width: 10,
      speed: -5,
      defaultSpeed: -5
    },
  });
  const [score, setScore] = useState(0);

  const canvasRef = useRef(null);
  
  const update = () => {
    setGameState(prevState => {
      // Update leftPaddle
      const newY = prevState.leftPaddle.y + prevState.leftPaddle.speed;
      const clampedY = Math.min(Math.max(newY, prevState.leftPaddle.height / 2), 300 - prevState.leftPaddle.height / 2);
  
      // Update ball (example: move ball by its velocity)
      let newBallX = prevState.ball.x + prevState.ball.velocityX;
      let newBallY = prevState.ball.y + prevState.ball.velocityY;

      // Collisions with top and bottom
      if (newBallY - prevState.ball.radius < 0 || newBallY + prevState.ball.radius > 300) {
        prevState.ball.velocityY = -prevState.ball.velocityY;
        newBallY = prevState.ball.y + prevState.ball.velocityY;  // recompute newBallY after reversing the direction
      }

      // Collisions with left and right
      if (newBallX - prevState.ball.radius < -1) {
        console.log("Vasen")
        setIsGameRunning(false); // Stop the game
        return prevState; // Return the previous state without any changes  // recompute newBallX after reversing the direction
      }

      if (newBallX + prevState.ball.radius > 590) {
        setScore(prevScore => {
          console.log("Oikea", prevScore + 1);
          return prevScore + 1;
      });
        prevState.ball.velocityX = -(prevState.ball.velocityX * 1.1);
        newBallX = prevState.ball.x + prevState.ball.velocityX;  // recompute newBallX after reversing the direction
      }


      // Collision with left paddle
      const paddleTop = clampedY - prevState.leftPaddle.height / 2;
      const paddleBottom = clampedY + prevState.leftPaddle.height / 2;

      if (
        newBallX - prevState.ball.radius < prevState.leftPaddle.width &&   // check ball is near the paddle horizontally
        newBallY + prevState.ball.radius > paddleTop &&  // check ball is below the top edge of paddle
        newBallY - prevState.ball.radius < paddleBottom  // check ball is above the bottom edge of paddle
      ) {
        prevState.ball.velocityX = -prevState.ball.velocityX; // reverse ball's horizontal direction
        newBallX = prevState.ball.x + prevState.ball.velocityX;  // recompute newBallX after reversing the direction
      }
      
      return {
        ball: {
          ...prevState.ball,
          x: newBallX,
          y: newBallY
        },
        leftPaddle: {
          ...prevState.leftPaddle,
          y: clampedY
        }
      };
    });
};


useEffect(() => {
  const handleInputStart = (e) => {
      // Only act if game is running
      if (!isGameRunning) return;
      
      e.preventDefault();
      // Reverse speed
      setGameState(prev => ({
          ...prev,
          leftPaddle: { ...prev.leftPaddle, speed: -prev.leftPaddle.speed }
      }));
  };

  const handleInputEnd = (e) => {
      // Only act if game is running
      if (!isGameRunning) return;

      e.preventDefault();
      // Revert to default speed
      setGameState(prev => ({
          ...prev,
          leftPaddle: { ...prev.leftPaddle, speed: prev.leftPaddle.defaultSpeed }
      }));
  };

  // Mouse Events
  window.addEventListener("mousedown", handleInputStart);
  window.addEventListener("mouseup", handleInputEnd);
  
  // Touch Events
  window.addEventListener("touchstart", handleInputStart);
  window.addEventListener("touchend", handleInputEnd);

  // Cleanup to avoid multiple event listeners
  return () => {
      window.removeEventListener("mousedown", handleInputStart);
      window.removeEventListener("mouseup", handleInputEnd);
      window.removeEventListener("touchstart", handleInputStart);
      window.removeEventListener("touchend", handleInputEnd);
  };
}, [isGameRunning]); // Note: Added isGameRunning to dependency array




 /* useEffect(() => {
    console.log(leftPaddle);
  }, [leftPaddle]);*/


  useEffect(() => {
    if(isGameRunning){
    const interval = setInterval(update, 1000 / 60);  // 60 FPS
    return () => clearInterval(interval);
    }
  }, [isGameRunning]);

function drawBall(context) {
    context.fillStyle = '#33FF57';
    context.beginPath();
    context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    context.fill();
}

function drawPaddle(context) {
    context.fillStyle = '#FF5733';
    context.fillRect(10, gameState.leftPaddle.y - (gameState.leftPaddle.height / 2), gameState.leftPaddle.width, gameState.leftPaddle.height);
}

useEffect(() => {
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(context);
  drawPaddle(context); // No need to pass these as parameters now

  // Draw the right wall
  context.fillStyle = '#FF5733';
  context.fillRect(canvas.width - 10, 0, 10, canvas.height);
}, [gameState]);  // Updated dependency array

const resetGame = () => {
  setGameState({
    ball: {
      x: 200,
      y: 200,
      velocityX: 5,
      velocityY: 5,
      radius: 5,
    },
    leftPaddle: {
      y: 200,
      height: 40,
      width: 10,
      speed: -5,
      defaultSpeed: -5
    },
    score: 0.
  });
  setScore(0);
  setIsGameRunning(true);
};

return (
  <div className="App">
      <div className="canvas-container">
          {!isGameRunning && <button className='restart' onClick={resetGame}>Restart Game</button>}
          <canvas ref={canvasRef} width={600} height={300}></canvas>
          <div className='game-info'>
          <div className='score'>Score: {score}</div>
          <div className="pong-instructions">
              <h2>How to Play</h2>
              <p>Press the left mouse button</p>
              <p>Or</p>
              <p>On a mobile device press the screen</p>
          </div>
      </div>
      </div>
      <div className="rotate-message">
          Please rotate your screen for the best experience.
      </div>
  </div>
);
}

export default App;

/*<div className='game-info'>
      <div className='score'>Score: {score}</div>
      <div className="pong-instructions">
              <h2>How to Play</h2>
              <p>Press the left mouse button</p>
              <p>Or</p>
              <p>On a mobile device press the screen</p>
          </div>
      </div>*/