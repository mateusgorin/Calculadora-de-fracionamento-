
import React, { useState, useMemo, useEffect } from 'react';
import { MedicationConfig, CalculationResult, SyringeCapacity } from './types.ts';
import Syringe from './components/Syringe.tsx';
import { 
  Calculator, 
  Info, 
  Droplet, 
  Syringe as SyringeIcon,
  X,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';

const App: React.FC = () => {
  const [syringeCapacity, setSyringeCapacity] = useState<SyringeCapacity>(100);
  const [totalMg, setTotalMg] = useState<string>("15");
  const [totalVolumeMl, setTotalVolumeMl] = useState<string>("0.5");
  const [targetDoseMg, setTargetDoseMg] = useState<string>("2.5");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  
  // Estado inicial verifica o localStorage imediatamente para evitar que o site apareça antes do aviso
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('calc_fracionamento_accepted');
    }
    return true;
  });
  
  const [hasAcceptedTermsCheckbox, setHasAcceptedTermsCheckbox] = useState(false);

  const pixKey = "mateusmirandaamaral@gmail.com";

  const handleAcceptTerms = () => {
    if (hasAcceptedTermsCheckbox) {
      localStorage.setItem('calc_fracionamento_accepted', 'true');
      setIsEntryModalOpen(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const result = useMemo<CalculationResult>(() => {
    const tMg = parseFloat(totalMg) || 0;
    const tVol = parseFloat(totalVolumeMl) || 0;
    const dMg = parseFloat(targetDoseMg) || 0;

    if (tVol === 0 || tMg === 0) {
      return { units: 0, volumeMl: 0, concentrationMgMl: 0 };
    }
    
    const concentration = tMg / tVol; // mg/ml
    const volumeNeeded = dMg / concentration; // ml
    const exactUnits = volumeNeeded * 100; // UI reais
    
    let roundedUnits;
    if (syringeCapacity === 30) {
      roundedUnits = Math.round(exactUnits * 2) / 2;
    } else if (syringeCapacity === 100) {
      roundedUnits = Math.round(exactUnits / 2) * 2;
    } else {
      roundedUnits = Math.round(exactUnits);
    }
    
    const finalUnits = Math.min(roundedUnits, syringeCapacity);
    
    return {
      units: finalUnits,
      volumeMl: volumeNeeded,
      concentrationMgMl: concentration
    };
  }, [syringeCapacity, totalMg, totalVolumeMl, targetDoseMg]);

  const tickValue = syringeCapacity === 100 ? 2 : (syringeCapacity === 30 ? 0.5 : 1);
  const totalTicks = result.units / tickValue;

  return (
    <div className={`min-h-screen bg-slate-50 pb-12 w-full overflow-x-hidden ${isEntryModalOpen ? 'max-h-screen overflow-hidden' : ''}`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm w-full">
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
        
        <div className="lg:col-span-7 space-y-6 w-full">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <SyringeIcon className="text-orange-500" size={22} />
              <h2 className="text-xl font-black text-slate-800">Parâmetros</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* PRIMEIRO: Dose Prescrita */}
              <div className="space-y-2">
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

              {/* SEGUNDO E TERCEIRO LADO A LADO */}
              <div className="space-y-3">
                <div className="flex items-end gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">MG na ampola?</label>
                    <div className="relative group">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={totalMg}
                        onChange={(e) => setTotalMg(e.target.value.replace(',', '.'))}
                        className="w-full pl-4 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-slate-700 text-sm md:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[9px]">MG</span>
                    </div>
                  </div>

                  <div className="pb-4 text-slate-300 font-black text-2xl select-none">/</div>

                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Por quantas ML?</label>
                    <div className="relative group">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={totalVolumeMl}
                        onChange={(e) => setTotalVolumeMl(e.target.value.replace(',', '.'))}
                        className="w-full pl-4 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-slate-700 text-sm md:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[9px]">ML</span>
                    </div>
                  </div>
                </div>
                
                {/* Link de Ajuda */}
                <button 
                  onClick={() => setIsHelpModalOpen(true)}
                  className="flex items-center gap-1.5 text-left group"
                >
                  <HelpCircle size={14} className="text-orange-500" />
                  <span className="text-[11px] font-medium text-slate-500 group-hover:text-orange-600 transition-colors underline decoration-slate-300 underline-offset-2">
                    Ficou em dúvida? Clique aqui e veja como verificar a MG e ML do seu medicamento.
                  </span>
                </button>
              </div>

              {/* ÚLTIMO: Capacidade da Seringa */}
              <div>
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

          {/* Resultado Card */}
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden w-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-orange-400">
              <Droplet size={140} />
            </div>
            
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="text-orange-500"><Droplet size={14} /></span> Resultado da Conversão
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-3 tracking-wider">Aspirar até a marca:</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-7xl font-black text-orange-400 leading-none">{result.units}</span>
                  <div className="flex flex-col">
                    <span className="text-xl md:text-2xl font-black text-slate-100 leading-tight">UI</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-orange-900/40 px-3 py-1.5 rounded-full border border-orange-800/50">
                   <span className="text-[10px] md:text-xs font-black text-orange-200 uppercase tracking-tighter">
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

        {/* Visualização da Seringa */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="sticky top-24 w-full max-w-[340px]">
            <Syringe capacity={syringeCapacity} currentUI={result.units} />
            <div className="mt-8 p-6 bg-slate-900/5 backdrop-blur-sm rounded-3xl border border-slate-200 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-tighter italic">
                Aviso: Esta é uma ferramenta de apoio visual. Confirme sempre com um profissional de saúde.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Seção do Desenvolvedor */}
      <section className="max-w-5xl mx-auto px-4 mt-16 w-full">
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-orange-100 shadow-xl shadow-orange-50/50 overflow-hidden relative w-full">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-orange-500 hidden sm:block">
            <Heart size={120} />
          </div>
          
          <div className="p-6 md:p-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-600 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
                <Smartphone className="text-white" size={28} />
              </div>
              
              <div className="flex-1 space-y-5 text-center md:text-left w-full overflow-hidden">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Olá, pessoal!</h2>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base">
                    Me chamo <span className="text-orange-600 font-black">Mateus Miranda</span> e sou o desenvolvedor do aplicativo Calculadora de Fracionamento.
                  </p>
                </div>

                <div className="space-y-4 text-slate-600 leading-relaxed text-xs md:text-sm lg:text-base">
                  <p>
                    O aplicativo ainda está em fase de testes e, em breve, pretendo adicionar novas funcionalidades para torná-lo ainda mais prático e completo.
                  </p>
                  <p>
                    No momento, ele não possui um domínio próprio. Se você gostou do aplicativo e quiser colaborar com qualquer valor para ajudar no seu desenvolvimento, toda contribuição via Pix, de qualquer quantia, será recebida com muita gratidão.
                  </p>
                  <p className="italic text-slate-500">
                    A ideia é hospedar o aplicativo em um servidor de qualidade, registrar um domínio para facilitar o acesso e seguir evoluindo o projeto.
                  </p>
                  <p className="font-bold text-orange-600">
                    Sua contribuição faz a diferença.
                  </p>
                </div>

                <div className="pt-4 flex flex-col items-center md:items-start gap-4 w-full">
                  <div className="w-full flex justify-center md:justify-start">
                    <div className="bg-slate-50 border-2 border-slate-100 p-3 md:p-4 rounded-2xl flex items-center justify-between gap-3 group hover:border-orange-200 transition-all w-full max-w-full sm:max-w-md">
                      <div className="flex flex-col text-left overflow-hidden w-full">
                        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Minha chave pix</span>
                        <span className="text-[10px] md:text-sm font-black text-slate-700 truncate block w-full">{pixKey}</span>
                      </div>
                      <button 
                        onClick={copyPix}
                        className="p-2 md:p-3 bg-white border border-slate-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all text-slate-400 hover:text-orange-600 shrink-0"
                        title="Copiar chave Pix"
                      >
                        {pixCopied ? <Check size={16} className="text-green-500 md:size-18" /> : <Copy size={16} className="md:size-18" />}
                      </button>
                    </div>
                  </div>
                  
                  {pixCopied && (
                    <p className="text-[10px] font-black text-green-600 uppercase animate-bounce">Chave copiada com sucesso!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de Aviso Inicial - Bottom Sheet Persistente */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/40 backdrop-blur-[4px] p-0 transition-opacity duration-300">
          <div className="bg-white w-full max-w-5xl h-[75vh] md:h-auto rounded-t-[2.5rem] md:rounded-[2.5rem] md:mb-8 md:mx-4 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] border-t border-slate-100 flex flex-col p-6 md:p-10 transform transition-transform duration-500 ease-out translate-y-0">
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12 flex-1 overflow-hidden">
              <div className="hidden lg:flex w-20 h-20 bg-orange-50 rounded-[1.5rem] items-center justify-center shrink-0">
                <AlertTriangle className="text-orange-600" size={40} />
              </div>

              <div className="flex-1 w-full flex flex-col overflow-hidden">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4 flex items-center gap-3 justify-center lg:justify-start shrink-0">
                  <AlertTriangle className="text-orange-600 lg:hidden" size={28} />
                  Aviso Importante
                </h2>

                <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed overflow-y-auto pr-3 custom-scrollbar text-center lg:text-left">
                  <p className="font-extrabold text-slate-900 text-base">Este aplicativo tem finalidade exclusivamente informativa.</p>
                  <div className="space-y-2">
                    <p>Não vendemos, não indicamos, não prescrevemos e não comercializamos qualquer medicamento.</p>
                    <p>As informações apresentadas não substituem consulta médica. Qualquer decisão deve ser feita somente com orientação de um médico.</p>
                    <p>O visitante assume total responsabilidade por suas escolhas. Não nos responsabilizamos pelo uso indevido das informações deste aplicativo.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[400px] flex flex-col gap-5 pt-4 lg:pt-0 shrink-0">
                <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-100 group transition-all hover:border-orange-100">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="relative mt-1 shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={hasAcceptedTermsCheckbox}
                        onChange={(e) => setHasAcceptedTermsCheckbox(e.target.checked)}
                      />
                      <div className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center ${
                        hasAcceptedTermsCheckbox 
                        ? 'bg-orange-600 border-orange-600 shadow-lg shadow-orange-100' 
                        : 'bg-white border-slate-300 group-hover:border-orange-400'
                      }`}>
                        {hasAcceptedTermsCheckbox && <CheckCircle2 size={18} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-[12px] md:text-sm font-bold text-slate-600 select-none leading-tight text-left">
                      Li, compreendo e concordo integralmente com os termos informados para utilizar a ferramenta.
                    </span>
                  </label>
                </div>

                <button 
                  disabled={!hasAcceptedTermsCheckbox}
                  onClick={handleAcceptTerms}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${
                    hasAcceptedTermsCheckbox 
                    ? 'bg-orange-600 text-white shadow-orange-100 hover:bg-orange-700 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  Concordar e Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ajuda (MG e ML) */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div 
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-slate-600" />
            </button>

            <div className="p-8 pb-4">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <HelpCircle className="text-orange-500" /> 
                Como identificar MG e ML?
              </h3>
              
              <div className="rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 aspect-video flex items-center justify-center relative">
                 <img 
                  src="https://i.postimg.cc/zvTRZnJg/IMG-20260201-WA0049.jpg" 
                  alt="Exemplo de Medicamento" 
                  className="w-full h-full object-contain scale-[1.35] transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://img.icons8.com/clouds/500/pill.png";
                  }}
                 />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center font-medium italic">
                Medicamento meramente ilustrativo
              </p>
            </div>

            <div className="p-8 pt-4 overflow-y-auto">
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  Veja que no medicamento ele informa que tem <span className="font-bold text-orange-600">15MG</span> a cada <span className="font-bold text-orange-600">0.5ML</span> da ampola.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-orange-500 font-medium italic">
                  "Ou seja, uma ampola de 2ML contém 60mg do medicamento."
                </div>
                <p className="font-bold text-slate-800">
                  Se o seu medicamento tem 15mg por 0.5ml, você deve colocar esses exatos números nos campos MG e ML da calculadora.
                </p>
              </div>
              
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="w-full mt-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all uppercase tracking-widest text-xs"
              >
                Entendi, voltar ao cálculo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
