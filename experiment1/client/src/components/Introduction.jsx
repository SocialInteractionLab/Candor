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
        In this experiment, you will be annotating an online conversation
        between two people and marking the change in the topic within this
        conversation.
      </p>

      <h1 className="text-2xl font-bold mb-4">Experiment Interface</h1>
      <div className="flex flex-col items-center mb-4">
        <img
          className="w-full max-w-4xl mb-4"
          src="/Intro_interface.png"
          alt="Experiment Interface"
        />
        <img
          className="w-full max-w-4xl"
          src="/Intro_finish.png"
          alt="Finish Interface"
        />
      </div>

      <h1 className="text-2xl font-bold mb-4">Annotating an Utterance</h1>
      <ul className="list-disc list-inside mb-4">
        <li className="mb-2">
          Click on the utterance you want to annotate. An input box will appear
          on the side. Type in the topic shift and click Submit.
        </li>
        <li className="mb-2">
          Annotated history will appear above the utterance once it has been
          annotated. To delete an annotation, click the ‘x’ mark next to the
          annotated history.
        </li>
        <li>To change an annotation, simply submit a new annotation.</li>
      </ul>

      <img
        className="w-full max-w-4xl mb-4"
        src="/Intro_flow.png"
        alt="Annotation Flow"
      />

      <h1 className="text-2xl font-bold mb-4">General Rule of Thumb</h1>
      <ul className="list-disc list-inside">
        <li>
          It is normal for some utterances to not make sense; try your best to
          comprehend them.
        </li>
        <li className="mb-2">
          Annotate only the new topic—the topic to which the conversation is
          shifting. The previous topic is provided for reference only.
        </li>
        <li className="mb-2">
          Ensure that your topic input is clear and concise. Avoid
          over-annotating.
        </li>
        <li>
          A "Finish" button will appear once you have scrolled through the
          entire conversation.
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
