import React from "react";
import {
  useGame,
  useRound,
  useStage,
  usePlayer,
} from "@empirica/core/player/classic/react";
import { useState, useEffect, useRef } from "react";
import { usePlayerID } from "@empirica/core/player/react";
import { Loading } from "@empirica/core/player/react";
import { InputForm } from "./inputForm";
import Message from "./Message";
import "./textbubble.css";

export function World() {
  const game = useGame();
  const data = game.get("data");

  const speaker1 = data[0].speaker; // speaker 1 for message sequence purposes

  const player = usePlayer();
  const playerName = usePlayerID();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedIndices, setMarkedIndices] = useState([]);

  const [showInput, setShowInput] = useState(true); // start with true cuz user input for the start topic is required
  const [annotated, setAnnotated] = useState(game.get("messages") || []);

  const [finishScroll, setFinishScroll] = useState(false);

  const [displayIndex, setDisplayIndex] = useState(0);
  const scrollRef = useRef(null);

  const [turnIds, setTurnIds] = useState([]);

  // set up scroll
  useEffect(() => {
    const tIds = annotated.map((a) => a.turn_id);
    if (!tIds.includes(currentIndex)){
      tIds.push(currentIndex)
    }
    tIds.sort((a, b) => a - b);

    if (currentIndex >= tIds[tIds.length - 1]){
      setDisplayIndex(tIds.length - 1)
    }
    else if (currentIndex <= tIds[0]){
      setDisplayIndex(0)
    } else {
      setDisplayIndex(findPositionInSortedArray(tIds, currentIndex))
    }

    setTurnIds(tIds);
  }, [annotated,currentIndex]);
  useEffect(() => {
    if (scrollRef.current) {
      const messageElements =
        scrollRef.current.querySelectorAll(".message-item");
      if (messageElements[turnIds[displayIndex]]) {
        messageElements[turnIds[displayIndex]].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [displayIndex]);

  // binary search helper
  function findPositionInSortedArray(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

  // Check if data is defined and is an array
  if (!Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const handleMarkToggle = (index) => {
    setMarkedIndices((prevMarkedIndices) => {
      if (prevMarkedIndices.includes(index)) {
        return prevMarkedIndices.filter((i) => i !== index);
      } else {
        return [...prevMarkedIndices, index];
      }
    });
  };

  const handleUtteranceClick = (index) => {
    setCurrentIndex(index);
    if (showInput === false) {
      setShowInput(true);
    }
  };

  const isMarked = (index) => markedIndices.includes(index);

  // handle remove annotation
  const removeItem = (index) => {
    console.log(annotated[index - 1]);
    console.log(annotated[index + 1]);

    let newMessages = [...annotated];

    // no prev have after
    if (!newMessages[index - 1] && newMessages[index + 1]) {
      newMessages[index + 1].previous_topic = game.get("startTopic");
    }
    // have prev no after
    else if (newMessages[index - 1] && !newMessages[index + 1]) {
      // no need to do anything
    }
    // no prev no after -- only one
    else if (!newMessages[index - 1] && !newMessages[index + 1]) {
      // no need to do anything
    }
    // have both
    else {
      newMessages[index + 1].previous_topic = newMessages[index - 1].new_topic;
    }

    newMessages = [
      ...newMessages.slice(0, index),
      ...newMessages.slice(index + 1),
    ];

    setAnnotated(newMessages);

    game.set("messages", newMessages);
    // console.log(game.get("messages"));
  };


  // handle adding annotation
  const handleNewMessage = (prevtopic, newtopic) => {
    let currentUtterance = data[currentIndex];
    let isRepeat = false;
    let newMessages = [...annotated];
    
    // Find the index of the message with matching turn_id
    const messageIndex = newMessages.findIndex(msg => currentUtterance.turn_id === msg.turn_id);
    
    // If found, update the existing message
    if (messageIndex !== -1) {
      newMessages[messageIndex].previous_topic = prevtopic;
      newMessages[messageIndex].new_topic = newtopic;
      isRepeat = true;
      
      // If this isn't the last message, update the next message's previous_topic
      if (messageIndex < newMessages.length - 1) {
        newMessages[messageIndex + 1].previous_topic = newtopic;
      }
    }

    if (!isRepeat) {
      handleMarkToggle(currentIndex);
      newMessages.push({
        turn_id: currentUtterance.turn_id,
        speaker: currentUtterance.speaker,
        currentUtterance: currentUtterance.utterance,
        previous_topic: prevtopic,
        new_topic: newtopic,
        participent_id: playerName,
        time: Date.now(),
      });
      
      // Sort messages by turn_id to ensure proper ordering
      newMessages.sort((a, b) => a.turn_id - b.turn_id);
      
      // Find the new index after sorting
      const newIndex = newMessages.findIndex(msg => currentUtterance.turn_id === msg.turn_id);
      
      // If this isn't the last message, update the next message's previous_topic
      if (newIndex < newMessages.length - 1) {
        newMessages[newIndex + 1].previous_topic = newtopic;
      }
    }

    setAnnotated(newMessages);
    game.set("messages", newMessages);
  };


  // prev and next button
  const handlePrevious = () => {
    if (displayIndex > 0) {
      setDisplayIndex(displayIndex - 1);
    }
  };

  const handleNext = () => {
    if (displayIndex < turnIds.length - 1) {
      setDisplayIndex(displayIndex + 1);
    }
  };

  // console.log("currIndex: " + currentIndex);

  // end game
  const handleFinish = () => {
    player.stage.set("submit", true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="flex w-full max-w-5xl gap-4">
        <div
          className={`flex flex-col items-center w-full ${
            showInput ? "max-w-[75%]" : "w-full"
          }`}
        >
          <div
            className="bg-white p-4 rounded shadow-lg w-full h-[50vh] overflow-y-auto"
            ref={scrollRef}
            onScroll={(e) => {
              const element = e.target;
              const tolerance = 2000;
              if (
                element.scrollHeight - element.scrollTop <=
                element.clientHeight + tolerance
              ) {
                setFinishScroll(true);
              }
            }}
          >
            {data.map((d, index) => (
              <div key={d.turn_id} className="message-item">
                <Message
                  index={d.turn_id}
                  utterance={d.utterance}
                  speaker1 = {speaker1}
                  currentSpeaker = {d.speaker}
                  isMarked={isMarked(d.turn_id - 2)}
                  currentIndex={currentIndex}
                  handleMarkToggle={handleMarkToggle}
                  handleUtteranceClick={handleUtteranceClick}
                  clickable={true}
                  annotatedData={annotated}
                  removeItem={removeItem}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded shadow-md w-full flex justify-center items-center flex-col">
            <p className="text-sm">
              Use these buttons to navigate through annotated utterances, A finish button will appear once you finish scrolling the whole conversation.
            </p>

            <p className="text-sm font-bold">If the finish button is not showing up for any reason, submit with "nocode" or contact researcher, you will still be compensated.</p>
            <div className="flex mt-2 space-x-2">
              <button
                onClick={handlePrevious}
                disabled={displayIndex === 0 || turnIds.length === 0}
                className={`bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 ${
                  displayIndex === 0 || turnIds.length === 0
                    ? "hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={
                  displayIndex === turnIds.length - 1 || turnIds.length === 0
                }
                className={`bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 ${
                  displayIndex === turnIds.length - 1 || turnIds.length === 0
                    ? "hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Next
              </button>
              {finishScroll && (
                <button
                  onClick={() => {
                    handleFinish();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>

        {showInput && (
          <div className="w-[25%] flex flex-col items-center">
            <div className="flex flex-col items-center justify-center ml-4 h-full w-full">
              <div className="w-full mt-4">
                <InputForm
                  // startTopic={startTopic}
                  setAnnotated={setAnnotated}
                  onNewMessage={handleNewMessage}
                  currentUtterance={data[currentIndex]}
                  setShowInput={setShowInput}
                  annotated={annotated}
                  currentIndex={currentIndex}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
