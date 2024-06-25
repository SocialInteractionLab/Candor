import React from "react";
import { useGame, useRound, useStage, usePlayer } from "@empirica/core/player/classic/react";
import { useState, useEffect } from "react";
import { usePlayerID } from "@empirica/core/player/react";
import { Loading } from "@empirica/core/player/react";
import { InputBox } from "./InputBox";

export function World() {
  const game = useGame();
  const data = game.get("data");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedIndices, setMarkedIndices] = useState([]);
  const [selectedUtterance, setSelectedUtterance] = useState(null);

  // Check if data is defined and is an array
  if (!Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % data.length;
          setSelectedUtterance(null); // Deselect utterance when navigating
          return newIndex;
        });
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) => {
          const newIndex = (prevIndex - 1 + data.length) % data.length;
          setSelectedUtterance(null); // Deselect utterance when navigating
          return newIndex;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

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
    if (selectedUtterance === index) {
      setSelectedUtterance(null);
    } else {
      setSelectedUtterance(index);
    }
  };

  const isMarked = (index) => markedIndices.includes(index);

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="flex flex-col items-center w-1/2">
        {currentIndex > 0 && (
          <div
            className={`mb-4 p-4 border rounded shadow-md text-center ${
              isMarked(currentIndex - 1) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
            }`}
          >
            <p className="text-lg">{data[currentIndex - 1].utterance}</p>
          </div>
        )}
        <div
          className={`mb-4 p-4 border rounded shadow-md text-center cursor-pointer ${
            isMarked(currentIndex) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
          }`}
          onClick={() => {
            handleMarkToggle(currentIndex);
            handleUtteranceClick(currentIndex);
          }}
        >
          <p className="text-lg font-bold">{data[currentIndex].utterance}</p>
        </div>
        {currentIndex < data.length - 1 && (
          <div
            className={`mb-4 p-4 border rounded shadow-md text-center ${
              isMarked(currentIndex + 1) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
            }`}
          >
            <p className="text-lg">{data[currentIndex + 1].utterance}</p>
          </div>
        )}
        <div className="mt-4 p-2 bg-gray-100 rounded shadow-md">
          <p className="text-sm">
            Use the arrow keys to navigate through the utterances.
          </p>
          <div className="flex mt-2 space-x-2">
            <button
              onClick={() => setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex - 1 + data.length) % data.length;
                setSelectedUtterance(null); // Deselect utterance when navigating
                return newIndex;
              })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % data.length;
                setSelectedUtterance(null); // Deselect utterance when navigating
                return newIndex;
              })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {selectedUtterance === currentIndex && (
        <div className="w-1/2 h-full">
          <Chat currentUtterance={data[currentIndex].utterance} />
        </div>
      )}
    </div>
  );
}

function Chat({ currentUtterance }) {
  const player = usePlayer();
  const round = useRound();
  const stage = useStage();
  const game = useGame();
  const playerName = usePlayerID();
  const scope = game; // Assuming game is the scope for messages
  const attribute = "chat"; // Assuming chat is the attribute for messages

  if (!scope || !player) {
    return <Loading />;
  }

  const handleNewMessage = (text) => {
    scope.append(attribute, {
      text,
      currentUtterance, // Append current utterance to the message
      likes: {},
      time: Date.now(),
      round: round.get("idx"),
      stage: stage.get("idx"),
      recipient: player.get("recipient"),
      sender: {
        id: player.id,
        name: playerName || player.id,
        avatar: player.get("avatar"),
      },
    });
    const playerStageData = scope.getAttribute(attribute)?.items || [];
    game.set("messages", playerStageData.map((msg, i) => msg.val._value));
  };

  return (
    <div className="flex flex-col items-center justify-center ml-4 h-full w-full">
      <div className="w-full mt-4">
        <InputBox onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}
