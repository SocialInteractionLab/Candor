import React, { useState, useEffect } from 'react';
import { useGame } from "@empirica/core/player/classic/react";

const IntroExample = ({index, data}) => {
  // const [isAnnotated, setIsAnnotated] = useState(false)
  const messageClass = `${index % 2 === 0 ? "bubble-left" : "bubble-right"}`
    return (
        <div className={`flex flex-col ${index % 2 === 0 ? "items-start" : "items-end"} ${data.Prev_Topic !== "" && 'bg-slate-200'} w-full p-4`}>
          {
            index == 0 && (
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2 max-w-[80%]">
      <div className="flex-1 truncate">
        <span className="mr-2">Starting Topic: Starting The Call</span>
      </div>
    </div>
            )
          }
  {data.Prev_Topic !== "" && (
    <div className="flex items-center justify-between text-sm text-gray-500 mb-2 max-w-[80%]">
      <div className="flex-1 truncate">
        <span className="mr-2">{`#${data.Number}`} |</span>
        <span>Previous Topic: {data.Prev_Topic} | </span>
        <span>New Topic: {data.New_Topic}</span>
      </div>
      <button 
        // onClick={handleDelete}
        className="ml-2 px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
      >
        ✕
      </button>
    </div>
  )}
  <div
    className={`${messageClass} ${index % 2 === 0 ? "self-start" : "self-end"}`}
  >
    <p className={`text-lg`}>{data.utterance}</p>
  </div>
</div>
    );
};

export default IntroExample;
