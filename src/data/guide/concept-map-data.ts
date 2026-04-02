export interface MapNode {
  id: string;
  label: string;
  x: number;  // normalized 0-1
  y: number;
  tier: 'core' | 'primary' | 'secondary';
  description: string;
}

export interface MapEdge {
  source: string;
  target: string;
  type: 'dependency' | 'elaboration' | 'tension' | 'sequence';
  label?: string;
}

// Nodes arranged concentrically: originary-scene at center, then radiating outward
export const MAP_NODES: MapNode[] = [
  // Core — center of the map
  { id: 'originary-scene',           label: 'Originary Scene',         x: 0.5,   y: 0.5,   tier: 'core',      description: 'The minimal hypothetical: sign as deferral of violence' },
  // Primary ring
  { id: 'the-center',                label: 'The Center',              x: 0.5,   y: 0.22,  tier: 'primary',   description: 'Signifying vs. occupied center' },
  { id: 'deferral',                  label: 'Deferral',                x: 0.78,  y: 0.31,  tier: 'primary',   description: 'Language as ongoing suspension of violence' },
  { id: 'the-sacred',                label: 'The Sacred',              x: 0.82,  y: 0.6,   tier: 'primary',   description: 'Minimal binding force — makes a sign bind all' },
  { id: 'ostensive-imperative-declarative', label: 'Ostensive / Imperative / Declarative', x: 0.62, y: 0.82, tier: 'primary', description: 'The three originary linguistic forms' },
  { id: 'nomos',                     label: 'Nomos',                   x: 0.3,   y: 0.8,   tier: 'primary',   description: 'Originary distribution — rights require obligations' },
  { id: 'resentment-victimary',      label: 'Resentment / Victimary',  x: 0.18,  y: 0.55,  tier: 'primary',   description: 'Structural consequence of centeredness' },
  // Secondary ring
  { id: 'succession',                label: 'Succession',              x: 0.78,  y: 0.18,  tier: 'secondary', description: 'Singularized succession in perpetuity' },
  { id: 'debt-and-credit',           label: 'Debt and Credit',         x: 0.92,  y: 0.45,  tier: 'secondary', description: 'No economy — only debt to the center' },
  { id: 'scenic-design',             label: 'Scenic Design',           x: 0.88,  y: 0.78,  tier: 'secondary', description: 'Construction of scenes for adequate deferral' },
  { id: 'originary-grammar',         label: 'Originary Grammar',       x: 0.5,   y: 0.88,  tier: 'secondary', description: 'Infralinguistic grammar of the scene' },
  { id: 'the-juridical',             label: 'The Juridical',           x: 0.16,  y: 0.78,  tier: 'secondary', description: 'Capacity to judge what the center demands' },
  { id: 'anthropomorphics',          label: 'Anthropomorphics',        x: 0.12,  y: 0.38,  tier: 'secondary', description: 'Grammar of constituted personhood' },
  { id: 'pointman-uninsurable',      label: 'Pointman / Uninsurable',  x: 0.24,  y: 0.2,   tier: 'secondary', description: 'Marginal figure who models deferral' },
];

export const MAP_EDGES: MapEdge[] = [
  // From originary scene outward
  { source: 'originary-scene', target: 'the-center',        type: 'dependency',  label: 'constitutes' },
  { source: 'originary-scene', target: 'deferral',          type: 'elaboration', label: 'is' },
  { source: 'originary-scene', target: 'the-sacred',        type: 'dependency',  label: 'generates' },
  { source: 'originary-scene', target: 'ostensive-imperative-declarative', type: 'sequence', label: 'produces' },
  { source: 'originary-scene', target: 'nomos',             type: 'sequence',    label: 'first instance of' },
  { source: 'originary-scene', target: 'resentment-victimary', type: 'dependency', label: 'structural consequence' },
  // Primary interconnections
  { source: 'the-center',      target: 'succession',        type: 'dependency',  label: 'requires' },
  { source: 'the-center',      target: 'resentment-victimary', type: 'tension',  label: 'generates' },
  { source: 'deferral',        target: 'scenic-design',     type: 'elaboration', label: 'requires' },
  { source: 'deferral',        target: 'originary-grammar', type: 'elaboration', label: 'formalizes as' },
  { source: 'the-sacred',      target: 'debt-and-credit',   type: 'elaboration', label: 'grounds' },
  { source: 'the-sacred',      target: 'the-juridical',     type: 'dependency',  label: 'authorizes' },
  { source: 'nomos',           target: 'the-juridical',     type: 'dependency',  label: 'precedes' },
  { source: 'nomos',           target: 'debt-and-credit',   type: 'elaboration', label: 'distributes as' },
  { source: 'ostensive-imperative-declarative', target: 'originary-grammar', type: 'dependency' },
  { source: 'ostensive-imperative-declarative', target: 'scenic-design',     type: 'dependency' },
  // Secondary interconnections
  { source: 'succession',      target: 'the-juridical',     type: 'dependency',  label: 'adjudicated by' },
  { source: 'succession',      target: 'scenic-design',     type: 'elaboration', label: 'requires' },
  { source: 'debt-and-credit', target: 'the-juridical',     type: 'elaboration', label: 'administered by' },
  { source: 'anthropomorphics',target: 'originary-grammar', type: 'elaboration', label: 'produces' },
  { source: 'anthropomorphics',target: 'the-center',        type: 'dependency',  label: 'constituted by' },
  { source: 'pointman-uninsurable', target: 'the-center',   type: 'sequence',    label: 'oriented toward' },
  { source: 'pointman-uninsurable', target: 'resentment-victimary', type: 'tension', label: 'transcends' },
  { source: 'resentment-victimary', target: 'the-juridical', type: 'tension',    label: 'expands pathologically into' },
];
