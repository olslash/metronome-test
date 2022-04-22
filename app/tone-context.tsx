import React from "react";
import * as Tone from "tone";
import { useLoop } from "./use-loop";
import { useOscillator } from "./use-oscillator";
import { isServer } from "./utils";

interface State {
  bpm: number;
  running: boolean;
  eighthActive: boolean;
  quarterActive: boolean;
}

const initialState: State = {
  bpm: isServer() ? 120 : Tone.Transport.bpm.value,
  running: false,
  eighthActive: true,
  quarterActive: true,
};

const stateContext = React.createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => {},
]);

export const useState = () => React.useContext(stateContext);

type Action =
  | { type: "start" }
  | { type: "stop" }
  | { type: "toggleQuarter" }
  | { type: "toggleEighth" }
  | { type: "stop" }
  | { type: "setBPM"; value: number };
// | { type: "startProgram"; program: Program };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "start":
      return { ...state, running: true };

    case "stop":
      return { ...state, running: false };

    case "setBPM":
      return { ...state, bpm: action.value };

    case "toggleQuarter":
      return { ...state, quarterActive: !state.quarterActive };

    case "toggleEighth":
      return { ...state, eighthActive: !state.eighthActive };
  }
}

export const ToneContext: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const eighthOsc = useOscillator(400);
  const quarterOsc = useOscillator(200);

  const eighthloop = useLoop((time) => {
    eighthOsc!.start(time).stop(time + 0.1);
  }, "8n");

  const quarterLoop = useLoop((time) => {
    quarterOsc!.start(time).stop(time + 0.1);
  }, "4n");

  React.useEffect(() => {
    Tone.Transport.bpm.value = state.bpm;

    if (!state.eighthActive) {
      eighthloop.stop();
    }

    if (!state.quarterActive) {
      quarterLoop.stop();
    }

    if (state.running) {
      state.eighthActive && eighthloop.start(0);
      state.quarterActive && quarterLoop.start(0);
    } else {
      eighthloop.stop();
      quarterLoop.stop();
    }
  }, [
    state.bpm,
    state.running,
    state.eighthActive,
    state.quarterActive,
    eighthloop,
    quarterLoop,
  ]);

  React.useEffect(() => {
    // unsuspend audio context
    if (state.running) {
      Tone.start();
      Tone.Transport.start();
    }
  }, [state.running]);

  return (
    <stateContext.Provider value={[state, dispatch]}>
      {children}
    </stateContext.Provider>
  );
};
