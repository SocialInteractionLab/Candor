import { useGame, useRound, useStage } from "@empirica/core/player/classic/react";

import React from "react";
import { Chat } from "./components/Chat"
import { Profile } from "./components/Profile"
import { World } from "./components/World";
import { useState } from "react";
import { Introduction } from "./components/Introduction";
import {Intermediate} from "./components/Intermediate";

export function Game() {
  const game = useGame();
  const { playerCount } = game.get("treatment");
  const round = useRound();
  const stage = useStage();

  const isInitialOpinionRound = round.get("name") === "Initial Opinion" || round.get("name") === "Post Opinion";
  const isIntro = round.get("name") === "Intro";
  const intermediary = stage.get("name") === "Intermediary";

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
  if (intermediary) {
    return (
      <div>
      <div className="w-full flex">
        <Profile />
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Intermediate/>
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
        <div className={`h-full ${isInitialOpinionRound ? "w-1/3" : "w-full"} flex items-center justify-center`}>
          <World />
        </div>
        <div className={`h-full ${isInitialOpinionRound ? "w-2/3" : "w-full"} min-w-0`}>
  <Chat scope={game} attribute="chat" />
</div>

      </div>
    </div>
  );
}
