import React, { useState } from 'react';
import { VitalReading } from '../pages/types';
import { formatShortDate } from './format';

interface HighLowBarChartProps {
  readings: VitalReading[];
  unit: string;
  metricLabel: string;
}

export const HighLowBarChart: React.FC<HighLowBarChartProps> = ({
  readings,
  unit,
  metricLabel,
}) => {
  const [selectedReading, setSelectedReading] = useState<VitalReading | null>(null);

  if (!readings || readings.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-400)' }}>No data for selected period</div>;
  }

  // Calculate global min and max for chart vertical bounds with comfortable padding
  const allLows = readings.map((r) => r.low);
  const allHighs = readings.map((r) => r.high);
  const rawMin = Math.min(...allLows);
  const rawMax = Math.max(...allHighs);
  const padding = Math.max(2, (rawMax - rawMin) * 0.15);
  const chartMin = Math.floor(rawMin - padding);
  const chartMax = Math.ceil(rawMax + padding);
  const rangeSpan = Math.max(1, chartMax - chartMin);

  const height = 220;
  const barGap = 4;
  const barWidth = Math.max(8, Math.min(24, Math.floor((800 - readings.length * barGap) / readings.length)));
  const totalSvgWidth = Math.max(600, readings.length * (barWidth + barGap) + 40);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Active Day Readout Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--ink-500)', fontWeight: 600 }}>
            {selectedReading ? formatShortDate(selectedReading.date) : 'Recent Average'}:
          </span>
          <span style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ink-950)' }}>
            {selectedReading ? selectedReading.avg : Math.round(readings.reduce((acc, r) => acc + r.avg, 0) / readings.length)}{' '}
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontWeight: 500 }}>{unit}</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--ink-600)', fontFamily: 'var(--font-mono)' }}>
          <span>
            Low: <strong>{selectedReading ? selectedReading.low : Math.min(...allLows)}</strong>
          </span>
          <span>
            High: <strong>{selectedReading ? selectedReading.high : Math.max(...allHighs)}</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas with Horizontal Scroll for Small Screens */}
      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '0.5rem' }}>
        <svg
          viewBox={`0 0 ${totalSvgWidth} ${height}`}
          style={{ width: '100%', minWidth: `${totalSvgWidth}px`, height: `${height}px`, display: 'block' }}
        >
          {/* Reference Grid Lines */}
          {[0.25, 0.5, 0.75].map((fraction, idx) => {
            const y = height * (1 - fraction) - 20;
            const refVal = Math.round(chartMin + rangeSpan * fraction);
            return (
              <g key={idx}>
                <line
                  x1={20}
                  y1={y}
                  x2={totalSvgWidth - 20}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={10}
                  y={y + 4}
                  fontSize="9"
                  fill="var(--ink-400)"
                  fontFamily="var(--font-mono)"
                >
                  {refVal}
                </text>
              </g>
            );
          })}

          {/* Dynamic Day Bars: Range Capsule (Low to High) + Average Dot */}
          {readings.map((r, i) => {
            const x = 35 + i * (barWidth + barGap);
            const highY = height - 25 - ((r.high - chartMin) / rangeSpan) * (height - 50);
            const lowY = height - 25 - ((r.low - chartMin) / rangeSpan) * (height - 50);
            const avgY = height - 25 - ((r.avg - chartMin) / rangeSpan) * (height - 50);
            const barHeight = Math.max(6, lowY - highY);
            const isSelected = selectedReading?.id === r.id;

            return (
              <g
                key={r.id}
                className="range-bar-column"
                onClick={() => setSelectedReading(r)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background track */}
                <rect
                  x={x}
                  y={20}
                  width={barWidth}
                  height={height - 45}
                  rx={barWidth / 2}
                  fill="var(--bg-subtle)"
                  opacity={0.5}
                />
                {/* Min-Max Bar Capsule */}
                <rect
                  x={x}
                  y={highY}
                  width={barWidth}
                  height={barHeight}
                  rx={barWidth / 2}
                  fill={isSelected ? 'var(--lime)' : 'var(--ink)'}
                  style={{ transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
                {/* Average Dot Indicator */}
                <circle
                  cx={x + barWidth / 2}
                  cy={avgY}
                  r={Math.max(2.5, barWidth / 3.5)}
                  fill={isSelected ? 'var(--ink)' : 'var(--lime)'}
                  stroke={isSelected ? 'var(--lime)' : 'none'}
                  strokeWidth="1.5"
                />
                {/* Day Label */}
                {i % Math.ceil(readings.length / 10) === 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={height - 6}
                    fontSize="9"
                    fill="var(--ink-400)"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {formatShortDate(r.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Live Pulse ECG Polyline
export const LivePulseLine: React.FC<{ bpm: number }> = ({ bpm }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '80px', overflow: 'hidden' }}>
      <svg viewBox="0 0 500 80" style={{ width: '100%', height: '100%' }}>
        <path
          d="M0,40 L120,40 L130,40 L135,20 L142,65 L150,10 L158,55 L164,35 L170,40 L280,40 L290,40 L295,20 L302,65 L310,10 L318,55 L324,35 L330,40 L500,40"
          fill="none"
          stroke="var(--lime-500)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Apple-Style Concentric Activity Rings
export const ActivityRings: React.FC<{
  movePercent: number;
  exercisePercent: number;
  standPercent: number;
}> = ({ movePercent, exercisePercent, standPercent }) => {
  const size = 180;
  const center = size / 2;
  const strokeWidth = 14;

  const rings = [
    { radius: 72, percent: movePercent, color: '#ef4444', label: 'Move' },
    { radius: 54, percent: exercisePercent, color: 'var(--lime-500)', label: 'Exercise' },
    { radius: 36, percent: standPercent, color: '#0284c7', label: 'Stand' },
  ];

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size}>
        {rings.map((ring, idx) => {
          const circumference = 2 * Math.PI * ring.radius;
          const offset = circumference - (Math.min(100, ring.percent) / 100) * circumference;

          return (
            <g key={idx}>
              {/* Background ring */}
              <circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                opacity={0.2}
              />
              {/* Active stroke ring */}
              <circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Sparkline SVG component for metric cards and tiles
export const Sparkline: React.FC<{ values: number[]; className?: string; height?: number; width?: number }> = ({
  values,
  className = 'spark',
  height = 28,
  width = 80,
}) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 3;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 2 * pad) + pad;
    const y = height - pad - ((v - min) / range) * (height - 2 * pad);
    return [x, y];
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M${p[0].toFixed(1)},${p[1].toFixed(1)}` : `${acc} L${p[0].toFixed(1)},${p[1].toFixed(1)}`),
    ''
  );
  const areaD = `${pathD} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;

  return (
    <svg className={className} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path className="spark__area" d={areaD} />
      <path d={pathD} />
    </svg>
  );
};
