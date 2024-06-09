import React from "react";
import { Button } from "./Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import {useState} from "react";
export function Introduction() {
  const player = usePlayer();
  const game = useGame();

  const [isSubmitted, setIsSubmitted] = useState(false);
  function handleSubmit(){
    player.stage.set("submit", true);
    setIsSubmitted(true);
  }

  return (
     <div className="flex items-center justify-center w-screen"></div>
  );
}
