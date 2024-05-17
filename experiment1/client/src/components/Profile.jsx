import {
  usePlayer,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import React from "react";
import { Avatar } from "./Avatar";
import { Timer } from "./Timer";

export function Profile() {
  const player = usePlayer();
  const round = useRound();
  const stage = useStage();

  return (
    <div className="min-w-lg md:min-w-2xl mt-2 m-x-auto px-3 py-2 text-gray-500 rounded-md grid grid-cols-3 items-center border-.5">
      <div className="leading-tight ml-1">
        <div className="text-gray-600 font-semibold">
          {round ? round.get("name") : ""}
        </div>
        <div className="text-empirica-500 font-medium">
          {stage ? stage.get("name") : ""}
        </div>
      </div>

      <Timer />

      <div className="flex space-x-3 items-center justify-end">
        <div className="flex flex-col items-center">
          
          
        </div>
        <div className="h-16 w-16">
          <Avatar seed={player.id} />
        </div>
      </div>
    </div>
  );
}
