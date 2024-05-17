import React from "react";
import {InputBox} from "./InputBox";
import {usePlayer, useRound, useGame } from "@empirica/core/player/classic/react";
import { useState } from "react";
export function Opinion({ scope, attribute}){
    const round = useRound();
    const player = usePlayer();
    const game = useGame();
    const isFinal = round.get("name") === "Post Opinion";
    const [sliderValue, setSliderValue] = useState(3);
    const [isSliderChanged, setIsSliderChanged] = useState(false); //track if slider has changed for submit

    //set component to appropiate opinion input based on treatment
    const toggle = game.get("treatment")["opinion"] === "slider" ? 1 : 0 ;

    //set users text value to their opinion and their slider value for the topic for current round
    const handleNewMessage = (text) => {
        player.stage.set("opinion", text);
        handleSubmit();
    };
    
    const handleSubmit = () => {
        player.stage.set("slider", sliderValue);
        player.stage.set("submit", true);
    };
    //return opinion input based on treatment
    return(
            <div className = "px-30">
                {isFinal && <h2 className="align-center text-gray-700 text-xl text-center">In light of the conversation you just had...</h2>}
                <h2 className="align-center text-gray-500 text-center" style={{ marginBottom: '20px' }}>Enter your opinions about this topic</h2>
                <InputBox onNewMessage ={handleNewMessage} setSliderValue={setSliderValue} setIsSliderChanged={setIsSliderChanged} buttonPosition="below" buttonText="Submit" buttonStyles='w-auto h-auto py-2 px-4 text-base' toggle={1}/>
            </div>

    )
}
