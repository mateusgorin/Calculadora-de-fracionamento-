
import React from 'react';
import { SyringeCapacity } from '../types';

interface SyringeProps {
  capacity: SyringeCapacity;
  currentUI: number;
}

const Syringe: React.FC<SyringeProps> = ({ capacity, currentUI }) => {
  // Dimensões do SVG
  const height = 780;
  const width = 160;
  
  // Dimensões do corpo (barrel)
  const barrelWidth = 34;
  const barrelX = (width - barrelWidth) / 2;
  const barrelYStart = 100;
  
  const scaleHeight = 560; 
  const barrelExtension = 40; 
  const totalBarrelHeight = scaleHeight + barrelExtension;
  
  const maxUI = capacity;
  const fillPercentage = Math.min(100, Math.max(0, (currentUI / maxUI) * 100));
  const plungerPos = (fillPercentage / 100) * scaleHeight;

  // Renderização dos traços baseada na norma técnica ISO para seringas U-100
  const renderTicks = () => {
    const ticks = [];
    
    // Valor de cada traço físico na seringa
    const tickStep = maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1);
    
    // Intervalo de numeração no corpo da seringa
    const labelStep = maxUI === 100 ? 10 : 5;

    for (let i = 0; i <= maxUI; i += tickStep) {
      const y = barrelYStart + (i / maxUI) * scaleHeight;
      
      const isLabeled = i % labelStep === 0; 
      const isHalfUnit = maxUI === 30 && i % 1 !== 0; // Traços de 0.5 na seringa de 30UI
      
      let tickLength = 7;
      if (isLabeled) tickLength = 15;
      else if (!isHalfUnit) tickLength = 11;
      else tickLength = 6;

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={barrelX}
          y1={y}
          x2={barrelX + tickLength}
          y2={y}
          stroke="#334155"
          strokeWidth={isLabeled ? "1.5" : (isHalfUnit ? "0.8" : "1.2")}
        />
      );

      // Rótulos Numéricos (Padrão: 5, 10, 15... ou 10, 20, 30...)
      if (isLabeled && i > 0) {
        ticks.push(
          <text
            key={`label-${i}`}
            x={barrelX + 19}
            y={y}
            fontSize="15"
            fill="#1e293b"
            className="font-black select-none"
            textAnchor="start"
            dominantBaseline="middle"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {i}
          </text>
        );
      }
    }
    return ticks;
  };

  const stopperCenterY = barrelYStart + 9;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full">
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-sm">
          
          {/* Agulha (Padrão 31G/32G) */}
          <path
            d={`M ${width/2 - 7} ${barrelYStart} L ${width/2 + 7} ${barrelYStart} L ${width/2 + 5} ${barrelYStart - 12} L ${width/2 - 5} ${barrelYStart - 12} Z`}
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <line
            x1={width/2}
            y1={barrelYStart - 12}
            x2={width/2}
            y2={barrelYStart - 85}
            stroke="#94a3b8"
            strokeWidth="1.2"
          />

          {/* Haste do Êmbolo */}
          <rect
            x={width/2 - 6}
            y={barrelYStart + plungerPos}
            width="12"
            height={height - (barrelYStart + plungerPos) - 40}
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="1"
            className="transition-all duration-700 ease-out"
          />

          {/* Base do Corpo (Finger Flange) */}
          <g transform={`translate(0, ${barrelYStart + totalBarrelHeight})`}>
            <path
              d={`M ${barrelX - 35} 0 
                 L ${barrelX + barrelWidth + 35} 0
                 L ${barrelX + barrelWidth + 35} 8
                 L ${barrelX - 35} 8 Z`}
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <rect x={barrelX} y="-5" width={barrelWidth} height="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* Líquido de Medicação */}
          <rect
            x={barrelX + 1}
            y={barrelYStart}
            width={barrelWidth - 2}
            height={plungerPos + 10}
            fill="#A2D2FF"
            fillOpacity="0.8"
            className="transition-all duration-700 ease-out"
          />

          {/* Cilindro (Barrel) */}
          <rect
            x={barrelX}
            y={barrelYStart}
            width={barrelWidth}
            height={totalBarrelHeight}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            rx="1"
          />

          {/* Vedação de Borracha (Stopper) */}
          <g className="transition-all duration-700 ease-out" style={{ transform: `translateY(${plungerPos}px)` }}>
             <path
               d={`M ${barrelX + 1} ${barrelYStart + 6} 
                  Q ${width/2} ${barrelYStart} ${barrelX + barrelWidth - 1} ${barrelYStart + 6}
                  L ${barrelX + barrelWidth - 1} ${barrelYStart + 18}
                  L ${barrelX + 1} ${barrelYStart + 18} Z`}
               fill="#0f172a"
             />
             <rect x={barrelX + 1} y={barrelYStart + 10} width={barrelWidth - 2} height="2" fill="rgba(255,255,255,0.1)" />
          </g>

          {/* Escala Graduada */}
          {renderTicks()}

          {/* Botão de Pressão do Êmbolo */}
          <ellipse
            cx={width/2}
            cy={height - 40}
            rx="30"
            ry="6"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            className="transition-all duration-700 ease-out"
            style={{ transform: `translateY(${plungerPos}px)`, transformOrigin: 'center top' }}
          />

          {/* Indicador de Valor Atual */}
          {currentUI > 0 && (
            <g className="transition-all duration-700 ease-out" style={{ transform: `translateY(${plungerPos}px)` }}>
              <rect 
                x={barrelX - 75} 
                y={stopperCenterY - 12} 
                width="60" 
                height="24" 
                rx="6" 
                fill="#f97316" 
              />
              <text 
                x={barrelX - 45} 
                y={stopperCenterY} 
                textAnchor="middle" 
                fill="white" 
                fontSize="12" 
                className="font-bold"
                dominantBaseline="middle"
              >
                {currentUI} UI
              </text>
              <path d={`M ${barrelX} ${stopperCenterY} L ${barrelX - 15} ${stopperCenterY - 5} L ${barrelX - 15} ${stopperCenterY + 5} Z`} fill="#f97316" />
            </g>
          )}
        </svg>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-[280px]">
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 w-full text-center">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Guia de Contagem:</p>
          <p className="text-sm font-black text-orange-700">
            Conte <span className="text-xl underline decoration-2">{(currentUI / (maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1))).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span> traços físicos
          </p>
          <p className="text-[9px] text-orange-600/70 mt-1 italic">
            *Nesta escala, cada traço = {maxUI === 100 ? 2 : (maxUI === 30 ? 0.5 : 1)} UI
          </p>
        </div>
        
        <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
          U-100 | {capacity} UI
        </span>
      </div>
    </div>
  );
};

export default Syringe;
