import React, { useState, useEffect } from 'react';
import { useGame } from "@empirica/core/player/classic/react";

//*
// Message is a component for displaying message and annotation history
//*
const Message = ({ index, utterance, speaker1, currentSpeaker, isMarked, currentIndex, handleMarkToggle, handleUtteranceClick, clickable, annotatedData, removeItem }) => {
    const [prevTopic, setPrevTopic] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [anotateIndex, setAnotateIndex] = useState(undefined)
    const [isAnnotated, setIsAnnotated] = useState(false);
    const game = useGame();

    // const [startTopic, setStartTopic] = useState(game.get("startTopic")??'');

    useEffect(() => {
        const checkTopic = () => {
            let annotated = false;

            if (annotatedData){
                annotatedData.forEach((msg, i) => {
                    if (index === msg.turn_id) {
                        annotated = true;
                        setPrevTopic(msg.previous_topic);
                        setNewTopic(msg.new_topic);
                        setAnotateIndex(i + 1)
                    }
                });
            }

            setIsAnnotated(annotated);
        };

        checkTopic();

    }, [index, game, annotatedData, game.get("startTopic")]);

    const handleDelete = () => {
        annotatedData.forEach((msg,i) => {
            if (index === msg.turn_id) {
                console.log('deleted')
                removeItem(i)
                setIsAnnotated(false);
                setPrevTopic('');
                setNewTopic('');
            }
        });
    }

    const messageClass = `${currentSpeaker === speaker1 ? "bubble-left" : "bubble-right"} 
    ${clickable ? "cursor-pointer" : ""} 
    ${isMarked ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"}`;

    const handleClick = () => {
        handleMarkToggle(index);
        handleUtteranceClick(index);
    };

    return (
        <div className={`flex flex-col ${currentSpeaker === speaker1? "items-start" : "items-end"} ${index === currentIndex && 'bg-slate-200'} w-full p-4`}>
          {
            index == 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2 max-w-[80%]">
      <div className="flex-1 truncate">
        <span className="mr-2">Starting Topic: {game.get("startTopic")}</span>
      </div>
    </div>
            )
          }
  {isAnnotated && (
    <div className="flex items-center justify-between text-sm text-gray-500 mb-2 max-w-[80%]">
      <div className="flex-1 truncate">
        <span className="mr-2">{`#${anotateIndex}`} |</span>
        <span>Previous Topic: {prevTopic === '' ? game.get("startTopic") : prevTopic} | </span>
        <span>New Topic: {newTopic}</span>
      </div>
      <button 
        onClick={handleDelete}
        className="ml-2 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
      >
        ✕
      </button>
    </div>
  )}
  <div
    className={`${messageClass} ${currentSpeaker === speaker1 ? "self-start" : "self-end"}`}
    onClick={clickable ? handleClick : undefined}
  >
    <p className={`text-lg ${index === currentIndex ? 'font-bold' : ''}`}>{utterance}</p>
  </div>
</div>
    );
};

export default Message;