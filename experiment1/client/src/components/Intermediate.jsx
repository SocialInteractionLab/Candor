import React from "react";
import { Button } from "./Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import {useState} from "react";
import { usePlayerID } from "@empirica/core/player/react";
import { Avatar } from "./Avatar";

export function Intermediate() {
  const player = usePlayer();
  const playerName = usePlayerID();
  const game = useGame();
  let tweet = player.get("tweet");
  //remove period from end of tweet
  tweet = tweet.slice(0, -1);
  //add quotes around tweet
  tweet = '"' + tweet + '"';
  game.set(player.id, playerName[1]);
  const otherUserId = player.get("recipient");
  const otherUser = game.get(player.get("recipient"));

  const [isSubmitted, setIsSubmitted] = useState(false);
  function handleSubmit(){
    player.stage.set("submit", true);
    setIsSubmitted(true);
  }

  return (
     <div className="flex items-center justify-center w-screen"><div className="w-1/2">
    <div className="mt-3 sm:mt-5 p-20">
      <div className="mt-2 mb-6">
        <h1>
       <b> You will be talking to {otherUser} <div className = "w-16 h-16"><Avatar seed = {otherUserId}/></div> <div></div>now about the topic {tweet}</b> <br/>
       </h1>

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
