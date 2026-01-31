
import React, { useState, useMemo } from 'react';
import { MedicationConfig, CalculationResult, SyringeCapacity } from './types.ts';
import Syringe from './components/Syringe.tsx';
import { 
  Calculator, 
  Info, 
  Droplet, 
  Syringe as SyringeIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [syringeCapacity, setSyringeCapacity] = useState<SyringeCapacity>(100);
  const [totalMg, setTotalMg] = useState<string>("15");
  const [totalVolumeMl, setTotalVolumeMl] = useState<string>("0.5");
  const [targetDoseMg, setTargetDoseMg] = useState<string>("2.5");

  const result = useMemo<CalculationResult>(() => {
    const tMg = parseFloat(totalMg) || 0;
    const tVol = parseFloat(totalVolumeMl) || 0;
    const dMg = parseFloat(targetDoseMg) || 0;

    if (tVol === 0 || tMg === 0) {
      return { units: 0, volumeMl: 0, concentrationMgMl: 0 };
    }
    
    const concentration = tMg / tVol; // mg/ml
    const volumeNeeded = dMg / concentration; // ml
    const exactUnits = volumeNeeded * 100; // UI reais sem arredondamento
    
    let roundedUnits;
    if (syringeCapacity === 30) {
      // Seringas de 30UI permitem precisão de meio traço (0.5 UI)
      roundedUnits = Math.round(exactUnits * 2) / 2;
    } else if (syringeCapacity === 100) {
      // Seringas de 100UI geralmente são graduadas de 2 em 2 unidades
      roundedUnits = Math.round(exactUnits / 2) * 2;
    } else {
      // Seringas de 50UI são graduadas de 1 em 1 unidade
      roundedUnits = Math.round(exactUnits);
    }
    
    return {
      units: Math.min(roundedUnits, syringeCapacity),
      volumeMl: volumeNeeded,
      concentrationMgMl: concentration
    };
  }, [syringeCapacity, totalMg, totalVolumeMl, targetDoseMg]);

  // Definição técnica do valor de cada traço (tick) baseado no padrão U-100 de mercado
  const tickValue = syringeCapacity === 100 ? 2 : (syringeCapacity === 30 ? 0.5 : 1);
  const totalTicks = result.units / tickValue;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-100 flex items-center justify-center">
              <SyringeIcon className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                Calculadora de fracionamento
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Padrão U-100
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <SyringeIcon className="text-orange-500" size={22} />
              <h2 className="text-xl font-black text-slate-800">Parâmetros</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* PRIMEIRO: Dose Prescrita */}
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Dose Prescrita (MG desejado)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={targetDoseMg}
                    onChange={(e) => setTargetDoseMg(e.target.value.replace(',', '.'))}
                    className="w-full pl-14 pr-14 py-5 bg-orange-50 border-2 border-orange-200 rounded-[1.5rem] focus:border-orange-600 outline-none transition-all text-3xl font-black text-orange-900 shadow-inner"
                  />
                  <Calculator className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500" size={24} />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-600 font-black text-xs">MG</span>
                </div>
              </div>

              {/* SEGUNDO: Medicamento Total -> Quantas MG tem na ampola? */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Quantas MG tem na ampola?</label>
                <div className="relative group">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={totalMg}
                    onChange={(e) => setTotalMg(e.target.value.replace(',', '.'))}
                    className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-slate-700"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">MG</span>
                </div>
              </div>

              {/* TERCEIRO: Líquido Total -> Quantas ML ? */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Quantas ML ?</label>
                <div className="relative group">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={totalVolumeMl}
                    onChange={(e) => setTotalVolumeMl(e.target.value.replace(',', '.'))}
                    className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-slate-700"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">ML</span>
                </div>
              </div>

              {/* ÚLTIMO: Capacidade da Seringa */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Capacidade da Seringa</label>
                <div className="grid grid-cols-3 gap-4">
                  {[30, 50, 100].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSyringeCapacity(cap as SyringeCapacity)}
                      className={`py-4 px-2 rounded-2xl border-2 transition-all text-sm font-black ${
                        syringeCapacity === cap 
                        ? 'border-orange-600 bg-orange-600 text-white shadow-xl shadow-orange-200' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {cap} UI
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-orange-400">
              <Droplet size={140} />
            </div>
            
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="text-orange-500"><Droplet size={14} /></span> Resultado da Conversão
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-3 tracking-wider">Aspirar até a mark:</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black text-orange-400 leading-none">{result.units}</span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-100 leading-tight">UI</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-orange-900/40 px-3 py-1.5 rounded-full border border-orange-800/50">
                   <span className="text-xs font-black text-orange-200 uppercase tracking-tighter">
                     Escala de {tickValue} UI por traço
                   </span>
                </div>
              </div>
              
              <div className="space-y-4 md:border-l md:border-slate-800 md:pl-10">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Total de Traços:</span>
                  <span className="font-mono text-orange-200 font-black text-lg">{totalTicks.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Volume (ML):</span>
                  <span className="font-mono text-orange-200 font-black text-sm">{result.volumeMl.toFixed(3)} ml</span>
                </div>
                <div className="pt-4 mt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-orange-400/80">
                    <span className="text-orange-400"><Info size={14} /></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400/80">Conferência Visual Obrigatória</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <