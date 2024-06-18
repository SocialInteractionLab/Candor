import React from "react";
import { useGame } from "@empirica/core/player/classic/react";
import { useState, useEffect } from "react";

export function World() {
  const game = useGame();
  const data = game.get("data");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedIndices, setMarkedIndices] = useState([]);

  // Check if data is defined and is an array
  if (!Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      } else if (event.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
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

  const isMarked = (index) => markedIndices.includes(index);

  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      {prevIndex >= 0 && (
        <div
          className={`mb-4 p-4 border rounded shadow-md text-center cursor-pointer ${
            isMarked(prevIndex) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
          }`}
          onClick={() => handleMarkToggle(prevIndex)}
        >
          <p className="text-lg">{data[prevIndex].utterance}</p>
        </div>
      )}
      <div
        className={`mb-4 p-4 border rounded shadow-md text-center cursor-pointer ${
          isMarked(currentIndex) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
        }`}
        onClick={() => handleMarkToggle(currentIndex)}
      >
        <p className="text-lg font-bold">{data[currentIndex].utterance}</p>
      </div>
      {nextIndex < data.length && (
        <div
          className={`mb-4 p-4 border rounded shadow-md text-center cursor-pointer ${
            isMarked(nextIndex) ? "bg-gray-200 text-red-500 transform translate-y-1 shadow-inner" : "bg-white"
          }`}
          onClick={() => handleMarkToggle(nextIndex)}
        >
          <p className="text-lg">{data[nextIndex].utterance}</p>
        </div>
      )}
      <div className="mt-4 p-2 bg-gray-100 rounded shadow-md">
        <p className="text-sm">
          Use the arrow keys to navigate through the utterances or click here to cycle through them.
        </p>
        <div className="flex mt-2 space-x-2">
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
