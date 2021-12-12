import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';
import CatSelect from './components/CatSelect/CatSelect';
import QuestionScreen from './components/QuestionScreen/QuestionScreen';
import FinalScreen from './components/FinalScreen/FinalScreen';

const App = () => {
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState(0);
  const [question, setQuestion] = useState('');
  const [value, setValue] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [notAllwedCat, setNotAllowedCat] = useState([]);
  const [highScore, setHighScore] = useState(0);

  // init categories
  useEffect(() => {
    getCats();
  }, []);
  //update highScore
  useEffect(() => {
    score > highScore && setHighScore(score);
  }, [score]);
  //move to finalScreen when 0 lives
  useEffect(() => {
    setTimeout(function () {
      lives === 0 && setPhase(2);
    }, 1000);
  }, [lives]);

  //random questions
  useEffect(() => {
    if (step > 0 && step % 3 === 0) {
      const randomCat = Math.floor(Math.random() * 18000);
      setNotAllowedCat((a) => [...a, randomCat]);
      onCatSelect(randomCat);
    }
  }, [step]);

  const decreaseLives = () => {
    setLives((l) => l - 1);
  };
  const nextStep = () => {
    setStep((s) => s + 1);
  };

  //reset all states but HighScore to start a new game
  const reset = () => {
    setLives(5);
    setScore(0);
    setStep(1);
    setPhase(0);
    setQuestion('');
    setValue(0);
    setAnswers([]);
    setCategories([]);
    setUsedQuestions([]);
    setNotAllowedCat([]);
    getCats();
  };

  //when choosing an answer option
  const onAnswerClick = async (isCorrect, value) => {
    if (isCorrect) {
      setScore((s) => s + value);
      setTimeout(function () {
        nextStep();
        setPhase(0);
      }, 1000);
    } else {
      setTimeout(function () {
        if (lives !== 1) {
          nextStep();
          setPhase(0);
          setAnswers([]);
          setQuestion('');
          setValue(0);
        }
      }, 1000);
      decreaseLives();
    }
  };

  //get categories to first phase
  const getCats = async () => {
    let catIdArray = [];
    while (catIdArray.length < 4) {
      let catId = Math.floor(Math.random() * 18000);
      !catIdArray.includes(catId) &&
        !notAllwedCat.includes(catId) &&
        catIdArray.push(catId);
    }
    const catsPromise = Promise.all([
      axios.get(`https://jservice.io/api/category/?id=${catIdArray[0]}`),
      axios.get(`https://jservice.io/api/category/?id=${catIdArray[1]}`),
      axios.get(`https://jservice.io/api/category/?id=${catIdArray[2]}`),
      axios.get(`https://jservice.io/api/category/?id=${catIdArray[3]}`),
    ]);
    const promiseValues = await catsPromise;
    const catIdNameArray = promiseValues.map((e) => {
      return { id: e.data.id, title: e.data.title };
    });
    setCategories(catIdNameArray);
  };

  //get questions after category
  const getQuestion = async (category) => {
    const res = await axios.get(
      `https://jservice.io/api/category/?id=${category}`
    );
    let questionsIdArray = [];
    const cluesCount = res.data.clues_count;
    while (questionsIdArray.length < 4) {
      let questionId = Math.floor(Math.random() * cluesCount);
      !questionsIdArray.includes(questionId) &&
        !usedQuestions.includes(questionId) &&
        questionsIdArray.push(questionId);
    }
    setUsedQuestions((s) => [...s, res.data.clues[questionsIdArray[0]].id]);
    setValue(res.data.clues[questionsIdArray[0]].value);
    setQuestion(res.data.clues[questionsIdArray[0]].question);

    const answerList = questionsIdArray.map((e, i) => {
      const answer = res.data.clues[e].answer;

      return {
        answer: answer,
        isCorrect: i === 0,
      };
    });
    setAnswers(answerList);
  };

  const onCatSelect = async (catId) => {
    await getQuestion(catId);
    setPhase(1);
    getCats();
  };

  return (
    <div className='outerContainer'>
      {phase === 0 && !(step % 3 === 0) && (
        <CatSelect onCatSelect={onCatSelect} categories={categories} />
      )}
      {phase === 1 && (
        <QuestionScreen
          question={question}
          value={value}
          answers={answers}
          onAnswerClick={onAnswerClick}
          step={step}
        />
      )}
      {phase === 2 && <FinalScreen score={score} reset={reset} />}
      <div className='scores'>
        {highScore > 0 && highScore > score && (
          <div className='highScore'>HIGH SCORE: {highScore}</div>
        )}
        {score > 0 && (
          <div className='currentScore'>CURRENT SCORE: {score}</div>
        )}
      </div>
    </div>
  );
};

export default App;
