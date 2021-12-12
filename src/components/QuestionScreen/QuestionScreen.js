import React, { useState, useEffect } from 'react';

const QuestionScreen = ({
  disableButtons,
  question,
  value,
  answers,
  onAnswerClick,
  step,
}) => {
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // randomize answers order on answers state change
  useEffect(() => {
    setShuffledAnswers(
      answers
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
  }, [answers]);

  //color correct answer green and wrong answers red
  const colorAnswers = () => {
    Array.from(document.getElementsByClassName('button')).forEach((element) => {
      console.log(element.dataset.correct);
      if (element.dataset.correct === 'true') {
        element.style.backgroundColor = 'green';
      } else {
        element.style.backgroundColor = 'red';
      }
    });
  };

  return (
    <div>
      {step > 0 && step % 3 === 0 && <h2>bunos round</h2>}
      <h3>{question}</h3>
      <div className='options'>
        {shuffledAnswers.map((e, i) => (
          <div
            className='button'
            key={i}
            data-correct={e.isCorrect}
            onClick={() => {
              if (!disableButtons) {
                onAnswerClick(e.isCorrect, value);
                colorAnswers();
              }
            }}
          >
            {e.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionScreen;
