import {usePlayer, useStage, useRound, useGame} from "@empirica/core/player/classic/react";
import { usePlayerID } from "@empirica/core/player/react";
import { Loading } from "@empirica/core/player/react";
import React, {useState, useRef, useEffect } from "react";
import { Opinion } from "./Opinion";
import { InputBox } from "./InputBox";
import {Avatar} from "./Avatar";
import { useSpring, animated } from 'react-spring';

//import RangeSlider from 'react-range-slider-input';
//import 'react-range-slider-input/dist/style.css';

export function Chat({ scope, attribute, loading}) {
    const player = usePlayer();
    const round = useRound();
    const stage = useStage();
    const game = useGame();
    const playerName = usePlayerID();

    if (!scope || !player) {
        return <LoadingComp />;
    }
    const handleNewMessage = (text) => {
        scope.append(attribute, {
            text,
            likes : {},
            time: Date.now(),
            round: round.get('idx'),
            stage: stage.get('idx'),
            recipient: player.get("recipient"),
            sender: {
                id: player.id,
                name: playerName || player.id,
                avatar: player.get("avatar"),
            },
        });
        const playerStageData = scope.getAttribute(attribute)?.items || [];
        game.set("messages", playerStageData.map((msg, i) => msg.val._value));
    };

    let msgs = scope.getAttribute(attribute)?.items || [];
    return (
        //render right side of screen depending on what stage the game is in
        <div className="h-full justify-center flex flex-col">
        {
            stage.get('name') == 'send' ?
            <h2 className="align-left"> Messages <b>sent</b>:</h2> :
            <div></div>
        }
        {
            stage.get('name') == 'observe' ?
            <h2 className="align-left"> Messages <b>received</b>:</h2> :
            <div></div>
        }
        {
            stage.get('name') == 'send' || stage.get('name') == 'observe' || stage.get('name') == 'chat' ?
            <MessagesPanel scope={scope} msgs={msgs} stage={stage}
                           round={round} player={player}/> :
                           <div></div>
        }
        {
            stage.get("name") == 'Cycle' ?
            <InputBox onNewMessage={handleNewMessage} buttonStyles='w-9 h-9 p-2 text-sm' toggle={0}/>  : <div></div>
        }
        </div>
    );
}

function Message(props) {
    const animationProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <animated.div style={animationProps}>
            <MessageComp {...props} />
        </animated.div>
    );
}

function MessagesPanel(props) {
    let {player, stage, round, scope, msgs } = props;
    const scroller = useRef(null);
    const [msgCount, setMsgCount] = useState(0);
    
    const msgsFiltered = (
        stage.get('name') === 'send' ?
        msgs.filter((msg) => msg.value.sender.id === player.id || (msg.value.recipient === player.id && msg.value.stage < parseInt(stage.get('idx'), 10))) :
        msgs.filter((msg) => msg.value.sender.id === player.id || msg.value.recipient === player.id) 
    ).filter(msg => msg.value.round == round.get('idx')).reverse();

    // Handle case before any messages are sent this round
    if (msgsFiltered.length === 0) {
        return (<div className="h-full w-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center w-2/3 space-y-2">
          <div className="w-24 h-24 text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-current" viewBox="0 0 512 512">
              <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/>
            </svg>
          </div>

          <p className="text-gray-500 text-center">
              {stage.get("name") == 'send' ?
               "Please send a tweet to your new partner!" :
               "You haven't received any messages this round..."}
          </p>
        </div>
    </div>);
    }

    // Filter messages based on stage
    return (
        <div className="h-full w-full items-center overflow-auto pl-2 pr-4 pb-2" ref={scroller}>
            {msgsFiltered.map((msg, i) => (
                <Message 
                    key={msg.id} 
                    index={i} 
                    player={player} 
                    scope={scope} 
                    attribute={msg} 
                />
            ))}
        </div>
    );
}

//*
// MessageComp is the component showing an individual message
//*


function MessageComp(props) {
    let {player, scope, attribute, index} = props;
    const msg = attribute.value;
    const ts = attribute.createdAt;

    const isSender = player.id === msg.sender.id;

    // Apply a conditional class based on whether the player is the sender
    const messageContainerClass = isSender ? "flex-row" : "flex-row-reverse";
    const messageAlignmentClass = isSender ? "pr-6" : "pl-6"; // Adjust padding based on the sender
    const textAlignmentClass = isSender ? "text-left" : "text-right"; // Adjust text alignment based on the sender

    return (
        <div className="h-full w-full overflow-auto pt-2" style={{ maxHeight: '90vh' }}>
            <div className={`flex flex-col bg-gray-50 space-y-4 ${messageContainerClass}`}>
                <div className={`flex rounded items-start ${messageContainerClass}`}>
                    <div className={`flex-shrink-0 ${messageAlignmentClass}`}>
                        <Avatar seed={msg.sender.id}/>
                    </div>
                    <div className={`flex-1 min-w-0 ${textAlignmentClass}`}> 
                        <p className="font-semibold">{msg.sender.name} <span className="text-gray-400 text-sm">{new Date(ts).toLocaleTimeString()}</span></p>
                        <p className="break-words overflow-hidden">{msg.text}</p> 
                    </div>
                </div>
            </div>
        </div>
    );
}

//*
// relTime is a function that formats the time since the given post (e.g. 2 min ago)
//*
function relTime(date) {
    const difference = (new Date().getTime() - date.getTime()) / 1000;
    if (difference < 60) {
        return `now`;
    }
    else if (difference < 3600) {
        return `${Math.floor(difference / 60)}m`;
    }
    else if (difference < 86400) {
        return `${Math.floor(difference / 3600)}h`;
    }
    else if (difference < 2620800) {
        return `${Math.floor(difference / 86400)} days ago`;
    }
    else if (difference < 31449600) {
        return `${Math.floor(difference / 2620800)} months ago`;
    }
    else {
        return `${Math.floor(difference / 31449600)} years ago`;
    }
}
