import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@mui/material";
import {
  useGame,
  useRound,
  useStage,
  usePlayer,
} from "@empirica/core/player/classic/react";
//*
// InputForm is a component for typing and sending messages
//*
export function InputForm({
  onNewMessage,
  currentUtterance,
  setShowInput,
  annotated,
  currentIndex,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const game = useGame();

  const [prevtopic, setPrevtopic] = useState("");
  const [newtopic, setNewtopic] = useState("");
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewMessage(prevtopic, newtopic);
    setPrevtopic("");
    setNewtopic("");
    setIsSubmitted(true);
  };

  const handleExit = (e) => {
    setShowInput(false);
  };

  const getPrevTopic = (val) => {
    const arr = game.get("messages");

    if (arr) {
      arr.sort((a, b) => a.turn_id - b.turn_id);
    } else {
      return "Starting The Call";
    }

    if (!arr[0]) {
      return "Starting The Call";
    }

    if (Number(arr[0].turn_id) >= val) {
      return "Starting The Call";
    }

    let low = 0;
    let high = arr.length - 1;
    let result = null;
    let result_obj = null;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (Number(arr[mid].turn_id) < val) {
        result = Number(arr[mid]);
        result_obj = arr[mid];
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return result_obj.new_topic;
  };

  // set previous topic on user Click
  useEffect(() => {
    if (inputRef.current) {
      setPrevtopic(inputRef.current.value);
    }
    console.log(prevtopic);
  }, [currentUtterance, annotated]);

  return (
    <>
    {currentIndex == 0 ? <>
      <div className="max-w-sm mx-auto text-right mb-5">
        <button
          onClick={() => {
            handleExit();
          }}
          className="ml-2 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
        >
          ✕
        </button>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={undefined}>
          <p className="mb-4 text-base text-gray-700 dark:text-gray-300">This is a prefilled starting topic to help with data completeness, it can not be changed.</p>
          <div className="mb-5">
            <label
              htmlFor="prevtopic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Starting Topic:
            </label>
            <input
              type="text"
              id="prevtopic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
             dark:focus:ring-blue-500 dark:focus:border-blue-500
             disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400 
             dark:disabled:bg-gray-600 dark:disabled:text-gray-500 dark:disabled:border-gray-500"
              value={'Starting The Call'}
              ref={inputRef}
              disabled={true}
              required
            />
          </div>
      </form>
    </>: <>
      <div className="max-w-sm mx-auto text-right mb-5">
        <button
          onClick={() => {
            handleExit();
          }}
          className="ml-2 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
        >
          ✕
        </button>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="prevtopic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Previous Topic
            </label>
            <input
              type="text"
              id="prevtopic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
             dark:focus:ring-blue-500 dark:focus:border-blue-500
             disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400 
             dark:disabled:bg-gray-600 dark:disabled:text-gray-500 dark:disabled:border-gray-500"
              value={getPrevTopic(currentUtterance.turn_id)}
              ref={inputRef}
              disabled={true}
              required
            />
          </div>
        <div className="mb-5">
          <label
            htmlFor="newtopic"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            New Topic
          </label>
          <input
            type="newtopic"
            id="newtopic"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={newtopic}
            onChange={(e) => setNewtopic(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>}
    </>
    
  );
}


