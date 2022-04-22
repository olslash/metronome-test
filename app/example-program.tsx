interface ProgramSegment {
  tempo: number;
  loops: number;
}

export type Program = ProgramSegment[];

// this would be in state in a real app:
export const program: Program = [
  {
    tempo: 160,
    loops: 2,
  },
  {
    tempo: 100,
    loops: 1,
  },
  {
    tempo: 80,
    loops: 3,
  },
];
