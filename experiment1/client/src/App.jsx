import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { PlayerCreate } from "./PlayerCreate.jsx";



import {Consent }from "./intro-exit/Consent.jsx";
import {Practice} from "./intro-exit/Practice.jsx";
import { Quiz } from "./intro-exit/IndividualQuiz.jsx";
import { Last } from "./intro-exit/LastPage.jsx";



export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Consent,];
  }
  function exitSteps({ game, player }) {
    return [ExitSurvey, Last];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext playerCreate = {PlayerCreate} introSteps={introSteps} exitSteps={exitSteps}>
              <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}

