import { useRef } from "react";
import { Loop } from "tone";
import { Seconds, Time } from "tone/build/esm/core/type/Units";
import { isServer } from "./utils";

export function useLoop(cb: (time: Seconds) => void, interval: Time): Loop {
  const oscillator = useRef<Loop>(
    isServer() ? ({} as Loop) : new Loop(cb, interval)
  );

  return oscillator.current;
}
