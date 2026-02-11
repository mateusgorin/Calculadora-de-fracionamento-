
import React, { useState, useMemo } from 'react';
import { CalculationResult, SyringeCapacity } from './types.ts';
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
  const [isSyringeHelpModalOpen, setIsSyringeHelpModalOpen] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(true);
  const [hasAcceptedTermsCheckbox, setHasAcceptedTermsCheckbox] = useState(false);

  const pixKey = "mateusmirandaamaral@gmail.com";

  const handleAcceptTerms = () => {
    if (hasAcceptedTermsCheckbox) {
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
    
    const concentration = tMg / tVol;
    const volumeNeeded = dMg / concentration;
    const exactUnits = volumeNeeded * 100;
    
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
    <div className={`min-h-screen bg-[#fcfdfe] pb-20 w-full overflow-x-hidden ${isEntryModalOpen ? 'max-h-screen overflow-hidden' : ''}`}>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-2xl shadow-lg shadow-orange-200/50 flex items-center justify-center">
              <SyringeIcon className="text-white" size={22} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Calculadora de fracionamento
            </h1>
          </div>
          <div className="hidden sm:block">
            <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Standard U-100 Scale
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-7 space-y-8 w-full">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-800">Parâmetros do Cálculo</h2>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Dose Prescrita (MG desejado)</label>
                <div className="relative group">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={targetDoseMg}
                    onChange={(e) => setTargetDoseMg(e.target.value.replace(',', '.'))}
                    className="w-full pl-16 pr-16 py-6 bg-slate-50/50 border-2 border-slate-100 rounded-[1.8rem] focus:border-orange-500 focus:bg-white focus:shadow-xl focus:shadow-orange-50 outline-none transition-all text-4xl font-black text-slate-800"
                  />
                  <Calculator className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" size={28} />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-widest">mg</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">MG na ampola</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={totalMg}
                        onChange={(e) => setTotalMg(e.target.value.replace(',', '.'))}
                        className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="pb-4 text-slate-200 font-light text-4xl">/</div>

                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Total em ML</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={totalVolumeMl}
                        onChange={(e) => setTotalVolumeMl(e.target.value.replace(',', '.'))}
                        className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsHelpModalOpen(true)}
                  className="flex items-center gap-2 group ml-1"
                >
                  <div className="p-1 bg-orange-50 rounded-md group-hover:bg-orange-100 transition-colors">
                    <HelpCircle size={14} className="text-orange-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                    Dúvida sobre os valores da ampola? Clique para ajuda visual.
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Capacidade da Seringa (UI)</label>
                <div className="grid grid-cols-3 gap-4">
                  {[30, 50, 100].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setSyringeCapacity(cap as SyringeCapacity)}
                      className={`py-5 rounded-[1.2rem] border-2 transition-all text-sm font-black tracking-widest ${
                        syringeCapacity === cap 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100' 
                        : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {cap} UI
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setIsSyringeHelpModalOpen(true)}
                  className="flex items-center gap-2 group ml-1"
                >
                  <div className="p-1 bg-orange-50 rounded-md group-hover:bg-orange-100 transition-colors">
                    <HelpCircle size={14} className="text-orange-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                    Dúvidas de qual é a sua seringa, clique aqui
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-orange-500 transition-transform duration-1000 group-hover:scale-110">
              <Droplet size={260} />
            </div>
            
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-orange-500/50"></span>
                Resultado da Conversão
              </h3>
              <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                <span className="text-orange-400 text-[9px] font-black uppercase tracking-widest">Cálculo Preciso</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">Aspirar até a marca:</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 leading-none drop-shadow-sm">
                    {result.units}
                  </span>
                  <span className="text-2xl font-black text-slate-400 uppercase tracking-tighter">UI</span>
                </div>
                <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl w-fit">
                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                     Escala de {tickValue} UI por traço
                   </span>
                </div>
              </div>
              
              <div className="space-y-5 md:border-l md:border-white/10 md:pl-12">
                <div className="flex justify-between items-center group/item">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">Traços Físicos:</span>
                  <span className="font-mono text-orange-300 font-black text-2xl">{totalTicks.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}</span>
                </div>
                <div className="flex justify-between items-center group/item">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">Volume Exato:</span>
                  <span className="font-mono text-slate-300 font-black text-base">{result.volumeMl.toFixed(3)} <span className="text-[10px] text-slate-500">ml</span></span>
                </div>
                <div className="pt-6 mt-2 border-t border-white/5">
                  <div className="flex items-center gap-3 text-orange-400/60">
                    <Info size={16} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">
                      Confirme visualmente na seringa ao lado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="sticky top-28 w-full max-w-[360px]">
            <Syringe capacity={syringeCapacity} currentUI={result.units} />
            <div className="mt-8 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-wider italic">
                Representação visual auxiliar. Confirme a dosagem com o seu médico ou farmacêutico.
              </p>
            </div>
          </div>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 mt-20 w-full">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative w-full">
          <div className="p-8 md:p-14">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-orange-200">
                <Smartphone className="text-white" size={32} />
              </div>
              
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Olá, pessoal!</h2>
                  <p className="text-slate-500 font-medium">
                    Me chamo <span className="text-orange-600 font-black uppercase tracking-wider">Mateus Miranda</span> e sou o desenvolvedor do aplicativo Calculadora de Fracionamento.
                  </p>
                </div>

                <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base max-w-3xl font-medium">
                  <p>
                    O aplicativo ainda está em desenvolvimento, em breve, pretendo adicionar novas funcionalidades para torná-lo ainda mais prático e completo.
                  </p>
                  <p>
                    No momento, ele não possui um domínio próprio. Se você gostou do aplicativo e quiser colaborar com qualquer valor para ajudar no seu desenvolvimento, toda contribuição via Pix, de qualquer quantia, será recebida com muita gratidão.
                  </p>
                  <p>
                    A ideia é hospedar o aplicativo em um servidor de qualidade, registrar um domínio para facilitar o acesso e seguir evoluindo o projeto.
                  </p>
                  <p className="font-black text-orange-600">
                    Sua contribuição faz a diferença.
                  </p>
                </div>

                <div className="pt-6 flex flex-col items-center md:items-start gap-5">
                  <div className="w-full flex justify-center md:justify-start">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-[1.5rem] flex items-center justify-between gap-6 group hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all w-full max-w-md">
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Chave Pix de Apoio</span>
                        <span className="text-sm font-black text-slate-700 truncate">{pixKey}</span>
                      </div>
                      <button 
                        onClick={copyPix}
                        className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all text-slate-400 shadow-sm"
                      >
                        {pixCopied ? <Check size={18} className="text-green-500 group-hover:text-white" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  {pixCopied && (
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-pulse">Copiado com sucesso!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isEntryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/60 backdrop-blur-md p-0 transition-opacity duration-500">
          <div className="bg-white w-full max-w-6xl h-auto max-h-[55vh] md:max-h-[60vh] rounded-t-[3rem] shadow-[0_-30px_100px_-20px_rgba(0,0,0,0.5)] border-t border-slate-100 flex flex-col p-6 md:p-14 transform transition-transform duration-500 translate-y-0 overflow-hidden relative">
            
            <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0 md:mb-10"></div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-16 flex-1 overflow-hidden">
              <div className="hidden lg:flex w-20 h-20 bg-orange-50 rounded-[2rem] items-center justify-center shrink-0">
                <AlertTriangle className="text-orange-600" size={36} />
              </div>

              <div className="flex-1 w-full flex flex-col overflow-hidden">
                <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight mb-4 md:mb-6 flex items-center gap-4 justify-center lg:justify-start">
                  <AlertTriangle className="text-orange-600 lg:hidden" size={24} />
                  Termos e Responsabilidades
                </h2>

                <div className="space-y-3 md:space-y-4 text-slate-500 text-[11px] md:text-base leading-snug md:leading-relaxed overflow-y-auto pr-2 custom-scrollbar text-center lg:text-left font-medium">
                  <p className="font-black text-slate-900 text-xs md:text-lg">Esta ferramenta possui fins estritamente educacionais e informativos.</p>
                  <p>Não prestamos assessoria médica, não vendemos e não indicamos substâncias.</p>
                  <p>A precisão dos cálculos depende da exatidão dos valores inseridos pelo usuário. Sempre valide os resultados com a orientação de um profissional de saúde qualificado antes de qualquer procedimento.</p>
                  <p>Ao utilizar este sistema, você declara estar ciente de que o desenvolvedor não se responsabiliza por eventuais erros de aplicação ou interpretação dos dados.</p>
                </div>
              </div>

              <div className="w-full lg:w-[400px] flex flex-col gap-4 md:gap-6 pt-4 lg:pt-0 shrink-0">
                <div className="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <label className="flex items-center gap-3 md:gap-4 cursor-pointer">
                    <div className="relative shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={hasAcceptedTermsCheckbox}
                        onChange={(e) => setHasAcceptedTermsCheckbox(e.target.checked)}
                      />
                      <div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl border-2 transition-all flex items-center justify-center ${
                        hasAcceptedTermsCheckbox 
                        ? 'bg-orange-600 border-orange-600 shadow-lg shadow-orange-100' 
                        : 'bg-white border-slate-300'
                      }`}>
                        {hasAcceptedTermsCheckbox && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-[10px] md:text-sm font-black text-slate-600 select-none leading-tight">
                      Confirmo que li e aceito os termos.
                    </span>
                  </label>
                </div>

                <button 
                  disabled={!hasAcceptedTermsCheckbox}
                  onClick={handleAcceptTerms}
                  className={`w-full py-4 md:py-6 rounded-[1rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-2xl ${
                    hasAcceptedTermsCheckbox 
                    ? 'bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  Acessar Ferramenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div 
            className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20"
            >
              <X size={20} className="text-slate-600" />
            </button>

            <div className="p-10 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <HelpCircle className="text-orange-500" /> 
                Guia de Referência
              </h3>
              
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 aspect-video flex items-center justify-center relative group">
                 <img 
                  src="https://i.postimg.cc/zvTRZnJg/IMG-20260201-WA0049.jpg" 
                  alt="Referência" 
                  className="w-full h-full object-contain scale-[1.25] group-hover:scale-[1.3] transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://img.icons8.com/clouds/500/pill.png";
                  }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center font-black uppercase tracking-widest italic">
                Exemplo meramente ilustrativo para localização de dados
              </p>
            </div>

            <div className="p-10 pt-4 overflow-y-auto">
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  Observe o rótulo do seu medicamento. Geralmente a concentração é expressa como <span className="text-orange-600 font-black">X mg em Y ml</span>.
                </p>
                <div className="bg-orange-50/50 p-6 rounded-[1.5rem] border-l-4 border-orange-500 italic font-bold text-slate-700">
                  Exemplo: Se o frasco diz "15mg / 0.5ml", você deve inserir 15 no campo MG e 0.5 no campo ML.
                </div>
                <p className="text-sm">
                  Esses dados são cruciais para que o cálculo de UI (Unidades Internacionais) na seringa seja proporcional à dose que você deseja administrar.
                </p>
              </div>
              
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="w-full mt-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Voltar ao Cálculo
              </button>
            </div>
          </div>
        </div>
      )}

      {isSyringeHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div 
            className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsSyringeHelpModalOpen(false)}
              className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20"
            >
              <X size={20} className="text-slate-600" />
            </button>

            <div className="p-10 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <HelpCircle className="text-orange-500" /> 
                Qual é a sua seringa?
              </h3>
              
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 aspect-[4/5] flex items-center justify-center relative group">
                 <img 
                  src="https://i.postimg.cc/bvXN2Sj4/file-0000000094b871f5bf0a8a73aa2e41f6-(1).png" 
                  alt="Guia de Seringas" 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://img.icons8.com/clouds/500/syringe.png";
                  }}
                 />
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center font-black uppercase tracking-widest italic leading-relaxed">
                Compare o bico e as graduações para identificar seu modelo
              </p>
            </div>

            <div className="p-10 pt-4 overflow-y-auto">
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p>
                  As seringas de insulina variam em capacidade total e na escala dos traços. Identificar corretamente o modelo garante que a dosagem aspirada corresponda ao cálculo.
                </p>
                <div className="bg-orange-50/50 p-6 rounded-[1.5rem] border-l-4 border-orange-500 italic font-bold text-slate-700">
                  Observe se sua seringa é de 30 UI, 50 UI ou 100 UI e selecione a opção correspondente no aplicativo.
                </div>
              </div>
              
              <button 
                onClick={() => setIsSyringeHelpModalOpen(false)}
                className="w-full mt-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]"
              >
                Voltar ao Cálculo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
