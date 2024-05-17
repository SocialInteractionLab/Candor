import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Overview
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          In this task, you will be part of a team with {treatment.playerCount+1} other people. 
          In this game, you and the other players are neighbours in the same area, using a semi-anonymous forum to talk. 

 <img> diagram of network </img>

          Your neighbourhood has quite a lot of wildlife, particularly rabbits and squirrels. 
          You and your neighbours want to figure out if there's roughly more rabbits or squirrels.Ie, is the ratio 50/50, 1 rabbit for each 1 squirrel, or is it more like 70/30, 2 rabbits for each squirrel?

          Everyone on the team has a window they're looking out of, which looks something like this:
          <img> </img>
          
          The app you're using is semi-anonymous, so you never quite know who's going to see your message, or whose message you're going to see, but there is an established culture of friendliness. You're going to post a review of what you see out of your window. Following this, you will read someone else's review, and make a judgment of the ratio of rabbits to squirrels using the sider:
         <img> </img>
         
          This process will repeat several times, as you continue sharing with your neighbours how many rabbits and squirrels you see, and as such what proportion of your total neighbourhood wildlife is rabbits or squirrels. If, by the end of the game, all of you are in agreement as to the ratio of critters, you will recieve a bonus (x). 
        </p>
      </div>
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
