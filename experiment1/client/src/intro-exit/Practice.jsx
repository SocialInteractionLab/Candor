import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/Button";
import { Slider } from "@mui/material";


export function Practice({ next }) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex">
        <div className="min-w-lg md:min-w-2xl mt-2 m-x-auto px-3 py-2 text-gray-500 rounded-md grid grid-cols-3 items-center border-.5">
          <div className="leading-tight ml-1">
            <div className="text-gray-600 font-semibold">Practice Round</div>
          </div>
           Timer: N/A
          <div className="flex space-x-3 items-center justify-end">
            <div className="h-11 w-11">
              <img src="../avatar1.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex flex-row">
        <div className="h-full w-full flex items-center justify-center">
          <div
            style={{
              position: "relative",
              width: "90%",
              height: "90%",
              borderRadius: "20px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundImage: 'url("/freepik.png")',
                backgroundColor: "#268b07",
                opacity: 0.7,
                borderRadius: "20px",
                zIndex: -1,
              }}
            ></div>
            {[...Array(1)].map((_, index) => (
              <span key={index} style={{ fontSize: "70px" }}>
                {"🐈🐈🐈 🐕"}
              </span>
            ))}
          </div>
        </div>
        <div className="h-full w-full flex items-center justify-center">
          <PracticeChat next={next}  />
        </div>
      </div>
    </div>
  );
}

function PracticeChat({next}) {
   const [scope, setScope] = useState([]);
  const [stage, setStage] = useState(0);
  const handleNewMessage = (text) => {
    setScope([text]);
    setTimeout(() => setStage(1), 5000);
  };

  return (
    <div className="w-100 h-full pb-1/10 pt-1/10 absolute justify-center items-center flex flex-col">
      {stage === 0 ? (
        <h2 className="align-left">
          Messages <b>sent</b>:
        </h2>
      ) : (
        <h2>
          Messages <b>received</b>:
        </h2>
      )}
      <MessagesPanel scope={scope} stage={stage}/>
      {stage === 0 ? (
        <PInputBox onNewMessage={handleNewMessage} buttonStyles="w-9 h-9 p-2 text-sm" />
      ) : (
        <POpinion toggle={1} next={next}  />
      )}
    </div>
  );
}


function MessagesPanel({ stage, scope }) {
  const scroller = useRef(null);
  const [msgCount, setMsgCount] = useState(0);


  useEffect(() => {
    
    if (scroller.current) {
      
      if (msgCount !== scope.length) {
        
        setMsgCount(scope.length);
        scroller.current.scrollTop = scroller.current.scrollHeight;
      }
    }
  }, [scroller, scope, msgCount]);

 
  if (scope.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center w-2/3 space-y-2">
          <div className="w-24 h-24 text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-current" viewBox="0 0 512 512">
              <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/>
            </svg>
          </div>
          <p className="text-gray-500 text-center">
            {stage === 0 ? "Please send a message to your new partner about the pets you see!" : "You haven't received any messages this round..."}
          </p>
        </div>
      </div>
    );
  }

 
  return (
    <div className="h-full w-full items-center overflow-auto pl-2 pr-4 pb-2" ref={scroller}>
      {scope.map((msg, i) => (
        
        <MessageComp key={i} index={i} scope={scope} stage={stage} />
      ))}
    </div>
  );
}



function MessageComp(props) {
  let { scope, index, stage} = props;
  const msgsFiltered = (stage =='0') ? scope : ['I see one dog'];
  const msg = msgsFiltered[index];
  const player = (stage =='0') ? "You" : "Neighbour";
  const avatar = (stage =='0') ? <img src="../avatar1.png" />: <img src="../avatar2.png" />;

  return (
    <div className="flex items-start my-2 shadow p-8">
      <div className="flex-shrink-0">
        {avatar}
      </div>
      <div className="ml-3 text-sm">
        <p>
          <span className="font-semibold text-gray-900 group-hover:text-gray-800">{(player)}</span>
          <span className="pl-2 text-gray-400">{"just now"}</span>
        </p>
        <p className="text-gray-900 group-hover:text-gray-800">{msg}</p>
      </div>
    </div>
  );
}

function PInputBox({ onNewMessage, buttonText, buttonStyles, buttonPosition }) {
  const [text, setText] = useState("");
  const resize = (e) => {
    const target = e.target;
    target.style.height = "inherit";
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const txt = text.trim();
    if (txt === "") {
      return;
    }
    if (txt.length > 1024) {
      e.preventDefault();
      alert("Max message length is 1024");
      return;
    }
    onNewMessage(txt);
    setText("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      handleSubmit(e);
      resize(e);
    }
  };
  const handleKeyUp = (e) => {
    resize(e);
  };
  const renderButton = () => {
    return (
      <button
        type="button"
        className={`rounded-md font-semibold shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${buttonStyles}`}
        onClick={handleSubmit}
      >
        {buttonText ? (
          buttonText
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-current" viewBox="0 0 512 512">
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        )}
      </button>
    );
  };

  const formClass =
    buttonPosition === "below"
      ? "p-2 w-full flex flex-col items-stretch gap-2 border-t"
      : "p-2 w-full flex items-stretch gap-2 border-t";
  const formText = buttonPosition === "below" ? "Enter your opinion here" : "Say something";

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <textarea
        name="message"
        id="message"
        rows={1}
        className="peer resize-none bg-transparent block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-empirica-500 sm:text-sm sm:leading-6"
        placeholder={formText}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {buttonPosition !== "below" && renderButton()}

      {buttonPosition === "below" && (
        <div className="flex justify-center mt-2">{renderButton()}</div>
      )}
    </form>
  );
}


function POpinion({next}) {
  const handleSlider = (event, value) => {
    if (value >= 0 && value <= 100) {
      alert("Congratulations, you've completed the practice!");
      next();
    } else {
      alert("Sorry, that's not quite right.");
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-center mb-5">What proportion of the population are cats?</h2>
        <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" onChangeCommitted={handleSlider} />
      </div>
    </div>
  );
}
