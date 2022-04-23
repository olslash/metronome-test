import React from "react";
import * as Tone from "tone";
import { program, Program } from "./example-program";
import { useLoop } from "./use-loop";
import { useOscillator } from "./use-oscillator";
import { isServer } from "./utils";

interface State {
  bpm: number;
  running: boolean;
  eighthActive: boolean;
  quarterActive: boolean;
  activeProgram?: Program;
}

interface Methods {
  startProgram: (program: Program) => void;
}

const initialState: State = {
  bpm: isServer() ? 120 : Tone.Transport.bpm.value,
  running: false,
  eighthActive: true,
  quarterActive: true,
  activeProgram: undefined,
};

const initialMethods = {
  startProgram: () => {},
};

const stateContext = React.createContext<
  [State & Methods, React.Dispatch<Action>]
>([{ ...initialState, ...initialMethods }, () => {}]);

export const useState = () => React.useContext(stateContext);

type Action =
  | { type: "start" }
  | { type: "stop" }
  | { type: "toggleQuarter" }
  | { type: "toggleEighth" }
  | { type: "stop" }
  | { type: "setBPM"; value: number }
  | { type: "startProgram"; program: Program };

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

    case "startProgram":
      return { ...state, program: action.program };
  }
}

export const ToneContext: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // const eighthOsc = useOscillator(400);
  // const quarterOsc = useOscillator(200);

  // const eighthloop = useLoop((time) => {
  //   eighthOsc!.start(time).stop(time + 0.1);
  // }, "8n");

  // const quarterLoop = useLoop((time) => {
  //   quarterOsc!.start(time).stop(time + 0.1);
  // }, "4n");

  // React.useEffect(() => {
  //   Tone.Transport.bpm.value = state.bpm;

  //   if (!state.eighthActive) {
  //     eighthloop.stop();
  //   }

  //   if (!state.quarterActive) {
  //     quarterLoop.stop();
  //   }

  //   if (state.running) {
  //     state.eighthActive && eighthloop.start(0);
  //     state.quarterActive && quarterLoop.start(0);
  //   } else {
  //     eighthloop.stop();
  //     quarterLoop.stop();
  //   }
  // }, [
  //   state.bpm,
  //   state.running,
  //   state.eighthActive,
  //   state.quarterActive,
  //   eighthloop,
  //   quarterLoop,
  // ]);

  React.useEffect(() => {
    // unsuspend audio context
    if (state.running) {
      Tone.start();
      Tone.Transport.start();

      // ******
      // hacked in program stuff. Not really meant to be here, just a convenient spot
      // ******
      const testProgramFixme: Program = [
        {
          tempo: 160,
          loops: 2,
        },
        {
          tempo: 100,
          loops: 1,
        },
        {
          tempo: 60,
          loops: 1,
        },
      ];

      // calculate what measures each loop will start at,
      // because they all get scheduled immediately
      let runningTotalLoops = 0;
      const startTimes = testProgramFixme.map(({ loops }, i) => {
        return i === 0 ? 0 : runningTotalLoops + i + loops;
      });

      console.log(startTimes);

      const allProgramParts = testProgramFixme.map((part, i) => {
        const synth = new Tone.Synth().toDestination();

        return (
          // new Tone.Sequence(
          //   (time, note) => {
          //     Tone.Transport.bpm.value = part.tempo;

          //     console.log("triger", note, time);
          //     synth.triggerAttackRelease(note, "8n", time, 1);
          //   },
          //   ["G2", "D2", "C2", "D2", "C2", "D2", "C2", "D2"]
          // )
          new Tone.Part(
            (time, value) => {
              Tone.Transport.bpm.value = part.tempo;

              console.log("trigger", value.note, time);
              synth.triggerAttackRelease(
                value.note,
                "8n",
                time,
                value.velocity
              );
            },
            [
              { time: 0, note: "G2", velocity: 0.5 },
              { time: "0:0:2", note: "D2", velocity: 0.5 },
              { time: "0:1:0", note: "C2", velocity: 0.5 },
              { time: "0:0:6", note: "D2", velocity: 0.5 },
              { time: "0:2:0", note: "C2", velocity: 0.5 },
              { time: "0:0:10", note: "D2", velocity: 0.5 },
              { time: "0:3:0", note: "C2", velocity: 0.5 },
              { time: "0:0:14", note: "D2", velocity: 0.5 },
            ]
          )
            .set({
              loop: part.loops,
              loopStart: 0,
            })
            .start(startTimes[i] + "m")
        );
      });
    }
  }, [state.running]);

  const methods = {
    startProgram: (program: Program) => {},
  };

  return (
    <stateContext.Provider value={[{ ...state, ...methods }, dispatch]}>
      {children}
    </stateContext.Provider>
  );
};
