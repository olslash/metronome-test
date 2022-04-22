import { useRef } from "react";
import { Oscillator, ToneOscillatorType } from "tone";
import { Frequency } from "tone/build/esm/core/type/Units";
import { isServer } from "./utils";

export function useOscillator(
  freq: Frequency,
  type?: ToneOscillatorType
): Oscillator {
  const oscillator = useRef<Oscillator>(
    isServer()
      ? ({
          start: () => {},
        } as Oscillator)
      : new Oscillator(freq, type).toDestination()
  );

  return oscillator.current;
}
