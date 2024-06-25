import { useGame, useRound, useStage } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Chat } from "./components/Chat";
import { Profile } from "./components/Profile";
import { World } from "./components/World";
import { Introduction } from "./components/Introduction";

export function Game() {
  const game = useGame();
  const { playerCount } = game.get("treatment");
  const round = useRound();
  const stage = useStage();
  const [currentUtterance, setCurrentUtterance] = useState(null); // State to manage current utterance index

  const isInitialOpinionRound = round.get("name") === "Initial Opinion" || round.get("name") === "Post Opinion";
  const isIntro = round.get("name") === "Intro";

  const handleCurrentUtteranceSelect = (index) => {
    setCurrentUtterance(index);
  };

  if (isIntro) {
    return (
      <div>
        <div className="w-full flex">
          <Profile />
        </div>
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Introduction />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex">
        <Profile />
      </div>
      <div className="h-full w-full flex flex-row">
        <div className={`h-full w-full flex items-center justify-center`}>
          <World onCurrentUtteranceSelect={handleCurrentUtteranceSelect} />
        </div>
      </div>
    </div>
  );
}
