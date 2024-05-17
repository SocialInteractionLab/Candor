import React, { useState } from "react";
import { Button } from "../components/Button";

export function Quiz({next}) {
  //const game = useGame();
  //const treatment = game.get("treatment");
  //const { feedback } = treatment;
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      question: "What is the goal of this game?",
      choices: [
        "(A) Learn to identify different species.",
        "(B) Figure out the ratio of squirrels to rabbits in the neighborhood.",
        "(C) Gossip with your neighbors about each other",
      ],
      correctAnswer: "(B) Figure out the ratio of squirrels to rabbits in the neighborhood.",
    },
    {
      question: "How many people are reading your message?",
      choices: [
        "(A) Nobody :(",
        "(B) Everyone :)",
        "(C) One person per message.",
      ],
      correctAnswer: "(C) One person per message.",
    },
{
      question: "If you wanted to express the fraction 2/10 as a percentage, what would the percentage be?",
      choices: [
        "(A) 20%",
        "(B) 75%",
        "(C) 80%",
      ],
      correctAnswer: "(A) 20%",
    },
    {
      question: "What happens if everyone agrees on the ratio?",
      choices: [
        "(A) We receive a bonus.",
        "(B) Nothing but cozy feelings of success and community effort.",
        "(C) The researchers will send me a live rabbit.",
      ],
      correctAnswer: "(A) We receive a bonus.",
    },
  ];

  const handleChoiceChange = (questionIndex, event) => {
    setAnswers({
      ...answers,
      [questionIndex]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const allCorrect = questions.every(
      (q, index) => answers[index] === q.correctAnswer
    );

    if (allCorrect) {
      alert("Congratulations, you answered all questions correctly!");
      next();
    } else {
      alert("Some answers are incorrect. Please try again.");
    }
  };

  const radioStyle = {
    display: "block",
    margin: "8px 0",
  };

  const inputStyle = {
    marginRight: "10px",
  };

  return (
    <div className="flex items-center justify-center w-screen" style={{ margin: "50px" }}><div className="w-1/2">
       <h3 className="text-lg leading-6 text-gray-900"> <center>
        Comprehension Quiz </center>
      </h3> <br/>
      <form>
        {questions.map((q, questionIndex) => (
          <div key={questionIndex}>
           <br/> <h2><b>{q.question}</b></h2> <br/>
            {q.choices.map((choice, index) => (
              <label key={index} style={radioStyle}>
                <input
                  type="radio"
                  style={inputStyle}
                  name={`question-${questionIndex}`}
                  value={choice}
                  checked={answers[questionIndex] === choice}
                  onChange={(e) => handleChoiceChange(questionIndex, e)}
                /> 
                {choice}
              </label>
            ))}
          </div>
        ))}
        <br />
        <Button handleClick={handleSubmit}>Submit</Button>
      </form>
    </div> </div>
  );
}
