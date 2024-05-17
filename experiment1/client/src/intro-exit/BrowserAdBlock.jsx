import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
     <div className="flex items-center justify-center w-screen"><div className="w-1/2">
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Browser & AdBlock
      </h3> <br/>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-700">
       To have this game function correctly for you and your teammates, please switch to chrome/firefox and pause your adblock for the duration of the game.
        </p> 
      </div>
      <Button handleClick={next}>
        Next
      </Button>
    </div> </div> </div>
  );
}
