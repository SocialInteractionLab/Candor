import React from "react";
import { Button } from "./Button";
import {
  usePlayer,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
import { useState } from "react";

import IntroExample from "./IntroExample"

export function Introduction() {
  const player = usePlayer();
  const game = useGame();
  const round = useRound();

  const example_data = round.get('example')

  console.log(example_data)

  return (
    <div className="flex flex-col items-center justify-center w-screen p-6 space-y-6 bg-gray-100">
      <p className="text-lg text-center mb-4">
        In this experiment, you will be reading an online conversation between two people and marking points in the 
        conversation when they switch which topic they’re talking about.
      </p>

      <p className="text-lg text-red-500 text-center mb-4">
        *Ignore the timers on all the following examples, you are not being timed in this experiment
      </p>

      <h1 className="text-2xl font-bold mb-4">Experiment Interface</h1>
      <div className="flex flex-col items-center mb-4">
        <img
          className="w-full max-w-4xl mb-4"
          src="/Starting_Interface.png"
          alt="Experiment Interface"
        />
        <img
          className="w-full max-w-4xl"
          src="/side_panel.png"
          alt="Finish Interface"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Annotating an Utterance</h1>
      <img
        className="w-full max-w-4xl mb-4"
        src="/interface_explain.png"
        alt="Annotation Flow"
      />

      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">
        When you see a point in the conversation when a new topic is introduced, 
        click on the message you want to annotate. An input box will appear on the side. Type in the new topic and click Submit.
        </li>
        <li className="mb-2">
        Annotated history will appear above the utterance once it has been annotated. To delete an annotation, 
        click the ‘x’ mark next to the annotated history.
        </li>
        <li>To change an annotation, simply submit a new annotation.</li>
      </ul>

      <img
        className="w-full max-w-4xl mb-4"
        src="/Intro_flow.png"
        alt="Annotation Flow"
      />

      <p className="text-lg text-center mb-4">
        Here is a gif showing this process.
        </p>
      <img
        className="w-full max-w-4xl mb-4"
        src="/annotation.gif"
        alt="Annotation animate"
      />


      <h1 className="text-2xl font-bold mb-4">Finish</h1>
        <p className="text-lg text-center mb-4">
        Once you have finished annotating the entire conversation, scroll to the end. If you haven’t already, a 'Finish' button will appear.
        Click the 'Finish' button, which will take you to an exit-survey.
        </p>

        <img
        className="w-full max-w-4xl mb-4"
        src="/Intro_finish.png"
        alt="Annotation Flow"
      />

      <h1 className="text-2xl font-bold mb-4">General Rule of Thumb</h1>
      <ul className="list-disc list-inside">
        <li className="mb-2">
          Some utterances won’t make sense due to transcription errors; try your best to comprehend them.
        </li>
        <li className="mb-2">
        Annotate only the new topic—the topic to which the conversation is shifting. 
        The previous topic is provided as a reminder of your previous annotations.
        </li>
        <li className="mb-2">
        Ensure that the topic labels are clear and concise. Try to provide topic labels that are one or two words, rather than sentences. 
        Avoid over-annotating.
        </li>
        <li>
          A "Finish" button will appear once you have scrolled through the entire conversation.
        </li>
      </ul>

      <h1 className="text-2xl font-bold mb-4">Annotated Example</h1>
      <p className="text-lg text-center mb-4">
        Here is an annotated example of an short conversation
      </p>
      <div
        className="bg-white p-4 rounded shadow-lg w-1/2 h-[50vh] overflow-y-auto">
        {example_data.map((d, index) => (
          <div key={d.turn_id} className="message-item">
            <IntroExample
              index={d.turn_id}
              data={d}
            />
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          player.stage.set("submit", true);
        }}
      >
        Next
      </button>
    </div>
  );
}
