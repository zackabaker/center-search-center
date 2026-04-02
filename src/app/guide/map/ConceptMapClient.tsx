'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MAP_NODES, MAP_EDGES, MapNode } from '@/data/guide/concept-map-data';

const TIER_STYLES = {
  core:      { r: 28, fill: '#111827', text: '#fff',    stroke: '#111827' },
  primary:   { r: 22, fill: '#1d4ed8', text: '#fff',    stroke: '#1d4ed8' },
  secondary: { r: 18, fill: '#fff',    text: '#374151', stroke: '#9ca3af' },
};

const EDGE_STYLES = {
  dependency:  { stroke: '#6b7280', dash: '',      width: 1.5 },
  elaboration: { stroke: '#3b82f6', dash: '',      width: 1.5 },
  tension:     { stroke: '#f59e0b', dash: '4 3',   width: 1.5 },
  sequence:    { stroke: '#10b981', dash: '2 2',   width: 1   },
};

export default function ConceptMapClient({ width, height }: { width: number; height: number }) {
  const [active, setActive] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ node: MapNode; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const pad = 60;
  const mapW = width  - pad * 2;
  const mapH = height - pad * 2;

  // Map normalized coords to SVG coords
  const toX = (nx: number) => pad + nx * mapW;
  const toY = (ny: number) => pad + ny * mapH;

  const activeNode = active ? MAP_NODES.find((n) => n.id === active) : null;
  const activeEdges = active
    ? MAP_EDGES.filter((e) => e.source === active || e.target === active)
    : [];
  const activeNeighborIds = new Set(activeEdges.flatMap((e) => [e.source, e.target]));

  const handleNodeClick = useCallback((id: string) => {
    setActive((prev) => (prev === id ? null : id));
    setTooltip(null);
  }, []);

  // Wrap text to fit inside node circle
  function wrapLabel(label: string, r: number): string[] {
    const maxW = r * 1.5;
    const words = label.split(' ');
    const lines: string[] = [];
    let cur = '';
    for (const word of words) {
      const test = cur ? `${cur} ${word}` : word;
      if (test.length * 6 > maxW && cur) { lines.push(cur); cur = word; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }

  return (
    <div className="relative select-none">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full"
        viewBox={`0 0 ${width} ${height}`}
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* Arrow markers */}
          {(['dependency', 'elaboration', 'tension', 'sequence'] as const).map((type) => (
            <marker
              key={type}
              id={`arrow-${type}`}
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 z" fill={EDGE_STYLES[type].stroke} />
            </marker>
          ))}
        </defs>

        {/* Edges */}
        {MAP_EDGES.map((edge, i) => {
          const src = MAP_NODES.find((n) => n.id === edge.source)!;
          const tgt = MAP_NODES.find((n) => n.id === edge.target)!;
          if (!src || !tgt) return null;
          const style = EDGE_STYLES[edge.type];
          const isActive = active ? (edge.source === active || edge.target === active) : false;
          const isDimmed = active && !isActive;
          const x1 = toX(src.x), y1 = toY(src.y);
          const x2 = toX(tgt.x), y2 = toY(tgt.y);
          // Slightly curve edges
          const mx = (x1 + x2) / 2 + (y2 - y1) * 0.1;
          const my = (y1 + y2) / 2 - (x2 - x1) * 0.1;
          return (
            <path
              key={i}
              d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
              stroke={style.stroke}
              strokeWidth={isActive ? style.width + 1 : style.width}
              strokeDasharray={style.dash}
              fill="none"
              opacity={isDimmed ? 0.08 : isActive ? 0.9 : 0.3}
              markerEnd={`url(#arrow-${edge.type})`}
            />
          );
        })}

        {/* Nodes */}
        {MAP_NODES.map((node) => {
          const style = TIER_STYLES[node.tier];
          const cx = toX(node.x);
          const cy = toY(node.y);
          const isActive = node.id === active;
          const isNeighbor = active ? activeNeighborIds.has(node.id) : false;
          const isDimmed = active && !isActive && !isNeighbor;
          const lines = wrapLabel(node.label, style.r);
          const fontSize = node.tier === 'core' ? 9 : node.tier === 'primary' ? 8 : 7.5;

          return (
            <g
              key={node.id}
              transform={`translate(${cx},${cy})`}
              className="cursor-pointer"
              onClick={() => handleNodeClick(node.id)}
              opacity={isDimmed ? 0.2 : 1}
            >
              <circle
                r={isActive ? style.r + 5 : style.r}
                fill={style.fill}
                stroke={isActive ? '#f59e0b' : style.stroke}
                strokeWidth={isActive ? 3 : 1.5}
                className="transition-all"
              />
              {lines.map((line, i) => (
                <text
                  key={i}
                  textAnchor="middle"
                  y={lines.length === 1 ? '0.35em' : (i - (lines.length - 1) / 2) * (fontSize + 1.5) + 4}
                  fontSize={fontSize}
                  fill={style.text}
                  fontWeight={node.tier === 'core' ? '700' : '600'}
                  className="pointer-events-none"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Active node info panel */}
      {activeNode && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">{activeNode.label}</h3>
              <p className="text-sm text-gray-500 mb-3">{activeNode.description}</p>
              {activeEdges.length > 0 && (
                <div className="space-y-1 mb-3">
                  {activeEdges.slice(0, 5).map((e, i) => {
                    const other = MAP_NODES.find((n) => n.id === (e.source === activeNode.id ? e.target : e.source));
                    if (!other) return null;
                    const dir = e.source === activeNode.id ? '→' : '←';
                    return (
                      <p key={i} className="text-xs text-gray-400">
                        <span className="font-mono text-gray-500">{dir}</span> {e.label || e.type} <strong className="text-gray-600">{other.label}</strong>
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                href={`/guide/concepts/${activeNode.id}`}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Concept page →
              </Link>
              <button
                onClick={() => setActive(null)}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {!active && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Click any node to explore connections
        </p>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-px bg-gray-400" />dependency
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-px bg-blue-400" />elaboration
        </div>
        <div className="flex items-center gap-1.5" style={{ '--dash': '4 3' } as React.CSSProperties}>
          <span className="inline-block w-4 h-px bg-amber-400" style={{ borderTop: '1px dashed' }} />tension
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-px bg-green-400" style={{ borderTop: '1px dashed' }} />sequence
        </div>
      </div>
    </div>
  );
}
