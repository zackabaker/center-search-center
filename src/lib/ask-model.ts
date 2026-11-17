// The model that writes Ask answers. One definition, used by the API route
// (which model to call) and by the page (which model to name while the
// answer is being written), so the label can never drift from the call.
//
// Chosen for speed first (owner direction, 2026-11-17: "price is fine … speed
// really matters"). Measured side by side on three real Ask prompts:
//
//                                 first sentence   whole answer
//   Sonnet 5.5, default settings      ~11 s           ~18 s
//   Sonnet 5.5, low effort            ~1.5 s          ~8.5 s   (shorter answers)
//   Opus 5.5, low effort              ~1–8 s          ~19 s
//   Opus 5.5, low effort, fast mode   ~2–4 s          ~7.5 s   ← this
//   Fable 5.2, low effort, fast mode  ~1–5 s          ~7.5 s   (twice the price)
//
// The default effort makes these models think for ten seconds or more before
// the first word; low effort removes most of that wait. Fast mode is the same
// model at a higher output speed and a higher price ($8 / $40 per million
// tokens instead of $4 / $20). Re-measure before changing any of the three.
export const ASK_MODEL_ID = 'claude-opus-5-5';
export const ASK_MODEL_LABEL = 'Claude Opus 5.5';
export const ASK_EFFORT = 'low' as const;
export const ASK_FAST = true;
