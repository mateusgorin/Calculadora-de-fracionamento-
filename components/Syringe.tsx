
import React from 'react';
import { Droplet } from 'lucide-react';
import { SyringeCapacity } from '../types';

interface SyringeProps {
  capacity: SyringeCapacity;
  currentUI: number;
}

const Syringe: React.FC<SyringeProps> = ({ capacity, currentUI }) => {
  const height = 780;
  const width = 320; 
  const barrelWidth = 36;
  const barrelX = 160; // Centralizado para permitir legendas em ambos os lados
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

      // Traço da escala
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

      // Números de contagem (1º, 2º...) - Voltaram para o lado ESQUERDO
      if (i > 0 && i <= currentUI) {
        const tickNumber = Math.round(i / tickStep);
        ticks.push(
          <text
            key={`count-${i}`}
            x={barrelX - 12}
            y={y}
            fontSize="11"
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

      // Números da escala fixa (10, 20, 30...) - Lado DIREITO
      if (isLabeled && i > 0) {
        ticks.push(
          <text
            key={`label-${i}`}
            x={barrelX + barrelWidth + 10}
            y={y}
            fontSize="16"
            fill="#1e293b"
            className="font-black select-none"
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

  const stopperCenterY = barrelYStart;
  const tickValue = maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1);
  const totalTicksCount = currentUI / tickValue;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 w-full group">
      <div className="relative overflow-visible">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-xl overflow-visible">
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
          
          <path
            d={`M ${barrelX + barrelWidth/2 - 8} ${barrelYStart} L ${barrelX + barrelWidth/2 + 8} ${barrelYStart} L ${barrelX + barrelWidth/2 + 6} ${barrelYStart - 14} L ${barrelX + barrelWidth/2 - 6} ${barrelYStart - 14} Z`}
            fill="#cbd5e1"
          />
          <line
            x1={barrelX + barrelWidth/2}
            y1={barrelYStart - 14}
            x2={barrelX + barrelWidth/2}
            y2={barrelYStart - 90}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <rect
            x={barrelX + barrelWidth/2 - 5}
            y={barrelYStart + plungerPos}
            width="10"
            height={height - (barrelYStart + plungerPos) - 40}
            fill="#f1f5f9"
            stroke="#e2e8f0"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          />

          <g transform={`translate(${barrelX - 32}, ${barrelYStart + totalBarrelHeight})`}>
            <rect x="0" y="0" width={barrelWidth + 64} height="10" rx="4" fill="#f1f5f9" stroke="#e2e8f0" />
          </g>

          <rect
            x={barrelX + 1}
            y={barrelYStart}
            width={barrelWidth - 2}
            height={plungerPos}
            fill="url(#liquidGradient)"
            fillOpacity="0.9"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
          />

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

          <rect x={barrelX + 4} y={barrelYStart} width="4" height={totalBarrelHeight} fill="#fff" fillOpacity="0.4" rx="2" />

          <g className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ transform: `translateY(${plungerPos}px)` }}>
             <path
               d={`M ${barrelX + 1} ${barrelYStart} 
                  Q ${barrelX + barrelWidth/2} ${barrelYStart - 5} ${barrelX + barrelWidth - 1} ${barrelYStart}
                  L ${barrelX + barrelWidth - 1} ${barrelYStart + 18}
                  L ${barrelX + 1} ${barrelYStart + 18} Z`}
               fill="url(#stopperGradient)"
             />
          </g>

          {renderTicks()}

          <ellipse
            cx={barrelX + barrelWidth/2}
            cy={height - 40}
            rx="35"
            ry="8"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
            style={{ transform: `translateY(${plungerPos}px)`, transformOrigin: 'center top' }}
          />

          {currentUI > 0 && (
            <g className="transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ transform: `translateY(${plungerPos}px)` }}>
              {/* Balão de dosagem posicionado mais à esquerda para não cobrir a contagem (1º, 2º...) */}
              <rect x={20} y={stopperCenterY - 14} width="70" height="28" rx="8" fill="#ea580c" className="shadow-lg" />
              <text x={55} y={stopperCenterY} textAnchor="middle" fill="white" fontSize="13" className="font-black" dominantBaseline="middle">
                {currentUI} UI
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 w-full">
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
        
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-3 bg-slate-900 px-8 py-3 rounded-full shadow-lg border border-slate-800 justify-center w-fit">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">U-100</span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
            <span className="text-[11px] font-black text-white tracking-widest uppercase">{capacity} UI</span>
          </div>
          
          <p className="text-[9px] text-slate-400 leading-relaxed uppercase font-black tracking-wider italic text-center opacity-80 max-w-[280px]">
            Representação visual auxiliar. Confirme a dosagem com o seu médico ou farmacêutico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Syringe;
