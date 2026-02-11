
import React from 'react';
// Import Droplet from lucide-react to fix the reference error on line 220
import { Droplet } from 'lucide-react';
import { SyringeCapacity } from '../types';

interface SyringeProps {
  capacity: SyringeCapacity;
  currentUI: number;
}

const Syringe: React.FC<SyringeProps> = ({ capacity, currentUI }) => {
  const height = 780;
  const width = 180;
  const barrelWidth = 36;
  const barrelX = (width - barrelWidth) / 2;
  const barrelYStart = 100;
  const scaleHeight = 560; 
  const barrelExtension = 40; 
  const totalBarrelHeight = scaleHeight + barrelExtension;
  const maxUI = capacity;
  const fillPercentage = Math.min(100, Math.max(0, (currentUI / maxUI) * 100));
  const plungerPos = (fillPercentage / 100) * scaleHeight;

  const renderTicks = () => {
    const ticks = [];
    const tickStep = maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1);
    const labelStep = maxUI === 100 ? 10 : 5;

    for (let i = 0; i <= maxUI; i += tickStep) {
      const y = barrelYStart + (i / maxUI) * scaleHeight;
      const isLabeled = i % labelStep === 0; 
      const isHalfUnit = maxUI === 30 && i % 1 !== 0;
      
      let tickLength = 8;
      if (isLabeled) tickLength = 16;
      else if (!isHalfUnit) tickLength = 12;
      else tickLength = 6;

      // Desenha a linha do traço
      ticks.push(
        <line
          key={`tick-${i}`}
          x1={barrelX}
          y1={y}
          x2={barrelX + tickLength}
          y2={y}
          stroke={isLabeled ? "#0f172a" : "#64748b"}
          strokeWidth={isLabeled ? "1.5" : "1"}
        />
      );

      // Numeração do traço (1º, 2º, 3º...) conforme solicitado pelo usuário
      if (i > 0 && i <= currentUI) {
        const tickNumber = Math.round(i / tickStep);
        ticks.push(
          <text
            key={`count-${i}`}
            x={barrelX - 6}
            y={y}
            fontSize="8"
            fill="#f97316"
            className="font-bold select-none"
            textAnchor="end"
            dominantBaseline="middle"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {tickNumber}º
          </text>
        );
      }

      // Rótulos da escala UI (10, 20, 30...)
      if (isLabeled && i > 0) {
        ticks.push(
          <text
            key={`label-${i}`}
            x={barrelX + 22}
            y={y}
            fontSize="14"
            fill="#1e293b"
            className="font-bold select-none"
            textAnchor="start"
            dominantBaseline="middle"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {i}
          </text>
        );
      }
    }
    return ticks;
  };

  const stopperCenterY = barrelYStart + 9;
  const tickValue = maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1);
  const totalTicksCount = currentUI / tickValue;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 w-full group">
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-xl">
          <defs>
            <linearGradient id="barrelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="stopperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          
          {/* Agulha */}
          <path
            d={`M ${width/2 - 8} ${barrelYStart} L ${width/2 + 8} ${barrelYStart} L ${width/2 + 6} ${barrelYStart - 14} L ${width/2 - 6} ${barrelYStart - 14} Z`}
            fill="#cbd5e1"
          />
          <line
            x1={width/2}
            y1={barrelYStart - 14}
            x2={width/2}
            y2={barrelYStart - 90}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Haste do Êmbolo */}
          <rect
            x={width/2 - 5}
            y={barrelYStart + plungerPos}
            width="10"
            height={height - (barrelYStart + plungerPos) - 40}
            fill="#f1f5f9"
            stroke="#e2e8f0"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          />

          {/* Finger Flange */}
          <g transform={`translate(0, ${barrelYStart + totalBarrelHeight})`}>
            <rect x={barrelX - 40} y="0" width={barrelWidth + 80} height="10" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
          </g>

          {/* Líquido */}
          <rect
            x={barrelX + 1}
            y={barrelYStart}
            width={barrelWidth - 2}
            height={plungerPos + 10}
            fill="url(#liquidGradient)"
            fillOpacity="0.9"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          />

          {/* Cilindro (Barrel) */}
          <rect
            x={barrelX}
            y={barrelYStart}
            width={barrelWidth}
            height={totalBarrelHeight}
            fill="url(#barrelGradient)"
            fillOpacity="0.4"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            rx="2"
          />

          {/* Brilho do Vidro */}
          <rect x={barrelX + 4} y={barrelYStart} width="4" height={totalBarrelHeight} fill="#fff" fillOpacity="0.4" rx="2" />

          {/* Stopper */}
          <g className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ transform: `translateY(${plungerPos}px)` }}>
             <path
               d={`M ${barrelX + 1} ${barrelYStart + 6} 
                  Q ${width/2} ${barrelYStart - 2} ${barrelX + barrelWidth - 1} ${barrelYStart + 6}
                  L ${barrelX + barrelWidth - 1} ${barrelYStart + 20}
                  L ${barrelX + 1} ${barrelYStart + 20} Z`}
               fill="url(#stopperGradient)"
             />
          </g>

          {renderTicks()}

          {/* Plunger Button */}
          <ellipse
            cx={width/2}
            cy={height - 40}
            rx="35"
            ry="8"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
            style={{ transform: `translateY(${plungerPos}px)`, transformOrigin: 'center top' }}
          />

          {/* Valor Atual Label */}
          {currentUI > 0 && (
            <g className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ transform: `translateY(${plungerPos}px)` }}>
              <rect x={barrelX - 85} y={stopperCenterY - 14} width="70" height="28" rx="8" fill="#ea580c" className="shadow-lg" />
              <text x={barrelX - 50} y={stopperCenterY} textAnchor="middle" fill="white" fontSize="13" className="font-black" dominantBaseline="middle">
                {currentUI} UI
              </text>
              <path d={`M ${barrelX} ${stopperCenterY} L ${barrelX - 15} ${stopperCenterY - 6} L ${barrelX - 15} ${stopperCenterY + 6} Z`} fill="#ea580c" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 w-full">
        {/* Guia de Contagem com Evidência Máxima */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-[2rem] w-full text-center shadow-xl shadow-orange-200 border border-orange-500 relative overflow-hidden group/guide">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white pointer-events-none group-hover/guide:scale-110 transition-transform duration-500">
            <Droplet size={60} />
          </div>
          
          <p className="text-[10px] font-black text-orange-200 uppercase tracking-[0.2em] mb-4">Guia de Contagem</p>
          
          <div className="flex flex-col items-center justify-center gap-1 mb-4">
            <span className="text-[11px] font-bold text-orange-100 uppercase tracking-tight">Conte</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white leading-none">
                {totalTicksCount.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-xl font-black text-orange-200 uppercase">traços</span>
            </div>
          </div>

          <div className="bg-orange-800/30 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-orange-500/30 inline-block w-full">
            <p className="text-[11px] font-black text-orange-100 uppercase tracking-widest">
              Escala: 1 traço = {tickValue} UI
            </p>
          </div>
        </div>
        
        {/* Detalhe da Seringa */}
        <div className="flex items-center gap-2 bg-slate-900 px-6 py-3 rounded-2xl shadow-lg border border-slate-800 w-full justify-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">U-100</span>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
          <span className="text-[11px] font-black text-white tracking-widest uppercase">{capacity} UI</span>
        </div>
      </div>
    </div>
  );
};

export default Syringe;
