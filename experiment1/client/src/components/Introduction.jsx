import React from "react";
import { Button } from "./Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import {useState} from "react";
export function Introduction() {
  const player = usePlayer();
  const game = useGame();
  let tweet = player.get("tweet");
  //remove period from end of tweet
  tweet = tweet.slice(0, -1);
  //add quotes around tweet
  tweet = '"' + tweet + '"';

  const [isSubmitted, setIsSubmitted] = useState(false);
  function handleSubmit(){
    player.stage.set("submit", true);
    setIsSubmitted(true);
  }

  return (
     <div className="flex items-center justify-center w-screen"><div className="w-1/2">
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Overview
      </h3> <br/>
      <div className="mt-2 mb-6">
        <h1>
       Please read the instructions carefully.<br/>
       </h1>
        <br/>    
        <h2> 
        Now you will be interacting with other people on Mini-Twitter, a small social media site where you can write tweets so others can view them, and can view tweets written by others. <br></br> <br></br> You will use the platform to discuss whether it is true that {tweet} Write tweets that reflect your honest belief, and read tweets written by others.
        Throughout the experiment please do not search for information on the internet or talk to others about the topic except via the Mini-Twitter interface.
        </h2>
        
      <br/>

      <b>You will be discussing about the topic: {tweet} in this experiment</b>

      </div>
      {isSubmitted ? (
            <div className = "text-green-500 text-center my-2">Please wait for other users.</div>
          ) : (
            <Button handleClick={handleSubmit} disabled={isSubmitted}>
              Next
            </Button>
          )}
    </div> </div> </div>
  );
}
