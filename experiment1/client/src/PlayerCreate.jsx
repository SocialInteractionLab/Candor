import React, { useState, useEffect } from "react";

export function PlayerCreate({ onPlayerID, connecting }) {
  // For the text input field.
  const [playerID, setPlayerID] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const paramsObj = Object.fromEntries(urlParams?.entries());

  // Change to Prolific stuff
  const key = paramsObj?.PROLIFIC_PID || undefined;
  // const key = undefined;

  if (!key){
    const handleSubmit = (e) => {
      e.preventDefault();
      onPlayerID(playerID);
      console.log(`manual input id: ${playerID}`)
    }

    return <>
          <div>
        <div id="root">
          <div className="h-screen relative">
            <div className="backdrop-blur-md bg-gray-200/50 rounded fixed z-20 flex space-x-1 text-gray-500 bottom-0 left-0 mb-2 ml-2">
              {/* Other buttons, like Empirica logo, New Participant, etc., can go here */}
            </div>
            <div className="h-full overflow-auto">
              <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Enter your Player Identifier
                  </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
                      <fieldset disabled = {connecting}>
                        <div>
                          <label htmlFor="playerID" className="block text-sm font-medium text-gray-700">
                            Identifier
                          </label>
                          <div className="mt-1">
                            <input
                              id="playerID"
                              name="playerID"
                              type="text"
                              autoComplete="off"
                              required
                              autoFocus
                              value={playerID}
                              onChange = {e => setPlayerID(e.target.value)}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <p className="mt-2 text-sm text-gray-500" id="playerID-description">
                              This should be given to you. E.g. email, code...
                            </p>
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Enter
                          </button>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
  }

  useEffect(() => {
    console.log(`Auto-submitting ID ${key} from URL parameter`);
    onPlayerID(key);
  }, [key]);
  
  return null
}