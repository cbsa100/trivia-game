import React from 'react';

const FinalScreen = ({ score, reset }) => {
  return (
    <div>
      <h2>Final Screen</h2>
      <p>your score is {score}</p>
      <button onClick={reset}>click here to start over</button>
    </div>
  );
};

export default FinalScreen;
