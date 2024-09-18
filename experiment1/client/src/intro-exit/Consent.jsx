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
            <strong>What you will do in this research:</strong> You will read and annotate a transcript of a conversation. You will label shifts in topic in the conversation.
          </p> <br/>
          <p>
            <strong>Time required:</strong> This study will take approximately twenty (20) minutes.
          </p><br/>
          <p>
            <strong>Purpose of the research:</strong> The purpose is to understand how people navigate topics in conversation with strangers. Your annotations will help us characterize the topics in these previously recorded conversations.
          </p><br/>
          <p>
            <strong>Risks:</strong> There are no anticipated risks associated with participating in this study. The effects should be comparable to viewing a computer monitor and using a mouse for the duration of the experiment.
             If you find the content of the conversation upsetting in any way, you can end the study at any time.
          </p><br/>
          <p>
            <strong>Compensation:</strong> You will receive $5 for completing the experiment.
          </p><br/>
          <p>
            <strong>Confidentiality:</strong> Your participation in this study will remain confidential. No personally identifiable information will be collected. Your anonymous data may be shared with other researchers and used in future projects.
          </p><br/>
          <p>
            <strong>Participation and withdrawal:</strong> Your participation in this study is completely voluntary and you may refuse to participate or choose to withdraw at any time without penalty or loss of benefits to which you are otherwise entitled.
          </p><br/>
          <p>
            <strong>How to contact the researcher:</strong> If you have questions or concerns about your participation or payment, or want to request a
        summary of research findings, please contact  <a href="mailto:czhou249@wisc.edu">czhou249@wisc.edu</a>.
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
