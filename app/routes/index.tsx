import React from "react";
import { useState } from "../tone-context";

export default function Index() {
  const [state, dispatch] = useState();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {state.running ? (
          <button onClick={() => dispatch({ type: "stop" })}> Stop</button>
        ) : (
          <button onClick={() => dispatch({ type: "start" })}> Start</button>
        )}
        <button onClick={() => dispatch({ type: "toggleQuarter" })}>
          {" "}
          Turn quarter {state.quarterActive ? "off" : "on"}
        </button>
        <button onClick={() => dispatch({ type: "toggleEighth" })}>
          {" "}
          Turn eighth {state.eighthActive ? "off" : "on"}
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={300}
        value={state.bpm}
        onChange={(e) =>
          dispatch({ type: "setBPM", value: Number(e.target.value) })
        }
      />
      {state.bpm}

      <pre>
        App State:
        {JSON.stringify(state, null, "\t")}
      </pre>
    </main>
  );
}
