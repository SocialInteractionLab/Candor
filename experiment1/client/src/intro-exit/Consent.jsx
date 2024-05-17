import React from "react";
import { Button } from "../components/Button";

export function Consent({ next }) {
  return (
    <div className="flex items-center justify-center w-screen">
      <div className="w-1/2 mt-3 sm:mt-5 p-20">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Consent</h3>
        <div className="instructions">
          <div className="smallimage">
            <center>
              <img width="300px" src="./madison.png" alt="Madison" />
            </center>
          </div>
          <p>
            Please read this consent agreement carefully before deciding whether to
            participate in this experiment. 
          </p><br/>
          <p>
            <strong>What you will do in this research:</strong> You will play a series of communication 
            games with other participants: describing the amount of animals you see, 
            with the goal of all agreeing on how relatively many there are.
          </p> <br/>
          <p>
            <strong>Time required:</strong> This study will take approximately twenty minutes.
          </p><br/>
          <p>
            <strong>Purpose of the research:</strong> The purpose is to understand how an agreement is reached in a networked community.
          </p><br/>
          <p>
            <strong>Risks:</strong> There are no anticipated risks associated with participating in this study. The effects should be comparable to viewing a computer monitor and using a mouse for the duration of the experiment.
          </p><br/>
          <p>
            <strong>Compensation:</strong> You will receive x for completing the experiment and a performance bonus of up to x.
          </p><br/>
          <p>
            <strong>Confidentiality:</strong> Your participation in this study will remain confidential. No personally identifiable information will be collected. Your anonymous data may be shared with other researchers and used in future projects.
          </p><br/>
          <p>
            <strong>Participation and withdrawal:</strong> Your participation in this study is completely voluntary and you may refuse to participate or choose to withdraw at any time without penalty or loss of benefits to which you are otherwise entitled.
          </p><br/>
          <p>
            <strong>How to contact the researcher:</strong> f you have questions or
        concerns about your participation or payment, or want to request a
        summary of research findings, please contact  <a href="mailto:yzubak@wisc.edu">yzubak@wisc.edu</a>.
          </p><br/>
          <p>
            <strong>Who to contact about your rights in this research:</strong> For
        questions, concerns, suggestions, or complaints that have not been or
        cannot be addressed by the researcher, or to report research-related
        harm, please contact the University of Wisconsin-Madison Human Research Protection Program at 608-890-4399 or <a href="mailto:compliance@research.wisc.edu">compliance@research.wisc.edu</a>.
          </p><br/>
        </div>
        <Button handleClick={next} autoFocus>
          <p>Next</p>
        </Button>
      </div>
    </div>
  );
}
