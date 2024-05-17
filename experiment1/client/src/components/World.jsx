import React from "react";
import { useGame, usePlayer, useStage} from "@empirica/core/player/classic/react";
import { usePlayerID } from "@empirica/core/player/react";
import _ from "lodash";

export function World() {
  const game = useGame();
  const player = usePlayer();
  const playerName = usePlayerID();
  const stage = useStage();
  const tweet = player.get("tweet") != null ? player.get("tweet") : "No tweet";
  //game.set(player.id, playerName[1]);
  const otherUser = game.get(player.get("recipient"));
  
  let content;

  switch (stage.get("name")) {
    case "send":
      content = (
        <h2>
          You are chatting with {otherUser}. Please write a tweet about the statement: "{tweet}" The tweet should reflect your honest belief about the truth/falsity of this statement.
        </h2>
      );
      break;
    case "observe":
      content = <h2>Now, you will see tweets from the other user: {otherUser} </h2>;
      break;
    case "opinion":
      content = (
        <h2>
          Please write your honest opinion (2-3 sentences) about the statement: "{tweet}" Indicate to what extent you agree/disagree with the statement and explain why.
        </h2>
      );
      break;
    default:
      content = <h2>Discuss this topic with your partner {otherUser}: "{tweet}"</h2>;
  }

  return (
    <div>
            <p className="text-3xl pl-10 font-semibold text-center font-sans"
         style={{ 
           textDecoration: 'underline',
           textDecorationColor: 'rgba(0,0,0,0.5)',
           color: 'rgba(0,0,0,0.8)' 
         }}>
        {content}
      </p>
    </div>
  );
}
