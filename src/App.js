import React, { useState } from "react";
import "./style.css";

const API_URL = "https://opentdb.com/api.php";

function App() {
  //questions and their indices
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //user score and answers
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  //for quiz setup
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [amount, setAmount] = useState("10");

  //state of quiz
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const startQuiz = async () => {
    try {
      const response = await fetch(
        `${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
      ); //use user input to get desired quiz from API
      const data = await response.json();
      setQuestions(data.results);
      setIsQuizStarted(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerClick = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer; 
    
    if (isCorrect) setScore((prev) => prev + 1); //update score
    //append to userAnswers
    setUserAnswers((prev) => [
      ...prev,
      { question: currentQuestion.question, 
        selected: answer,
        correct: currentQuestion.correct_answer,
        isCorrect },
    ]);

    if (currentQuestionIndex === questions.length - 1) {
      setIsQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  //decodes HTML entities into plain text
  const decodeHtml = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  //reset states for next round
  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizCompleted(false);
    setUserAnswers([]);
    setIsQuizStarted(false);
  };

  return (
    <div className="app">
      {!isQuizStarted ? (
        <div className="setup">
          <h1>Quiz App</h1>
          <div>
            <label>
              Select Category:&nbsp;
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Any</option>
                <option value="9">General Knowledge</option>
                <option value="21">Sports</option>
                <option value="23">History</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Select Difficulty:&nbsp;
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Select Amount:&nbsp;
              <input
                type="number"
                min="1"
                max="20"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              ></input>
            </label>
          </div>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : isQuizCompleted ? (
        <div>
          <div className="results">
            <h1>Quiz Completed!</h1>
            <p>
              Your Score: {score}/{questions.length}
            </p>
            <button onClick={resetQuiz}>Restart Quiz</button>
          </div>
          <div className="summary">
            <h2>Answer Summary</h2>
            {userAnswers.map((answer, idx) => (
              <p key={idx}>
                Q: {decodeHtml(answer.question)}
                <p>You Answered: {decodeHtml(answer.selected)}</p>
                <p>Correct Answer: {decodeHtml(answer.correct)}</p>
                {answer.isCorrect ? "Nice Job!" : "Incorrect"}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz">
          <h1>
            Question {currentQuestionIndex + 1}/{questions.length}
          </h1>
          <p>{decodeHtml(questions[currentQuestionIndex].question)}</p>
          <div className="answers">
            {[
              ...questions[currentQuestionIndex].incorrect_answers,
              questions[currentQuestionIndex].correct_answer,
            ]
              .sort(() => Math.random() - 0.5)
              .map((answer, idx) => (
                <button key={idx} onClick={() => handleAnswerClick(answer)}>
                  {decodeHtml(answer)}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
