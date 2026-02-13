
import React, { useState, useMemo, useEffect } from 'react';
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
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Milestone,
  BookOpen,
  Scale,
  Heart
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
  const [imageLoading, setImageLoading] = useState(true);
  const [isAttentionOpen, setIsAttentionOpen] = useState(false);
  const [isScienceOpen, setIsScienceOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const pixKey = "mateusmirandaamaral@gmail.com";

  const referenceImageUrl = "https://i.postimg.cc/zvTRZnJg/IMG-20260201-WA0049.jpg";
  const syringeGuideUrl = "https://i.postimg.cc/bvXN2Sj4/file-0000000094b871f5bf0a8a73aa2e41f6-(1).png";

  useEffect(() => {
    const preloadImages = [referenceImageUrl, syringeGuideUrl];
    preloadImages.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

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
          {/* SEÇÃO DE AVISO LEGAL */}
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300">
            <button 
              onClick={() => setIsAttentionOpen(!isAttentionOpen)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-amber-100/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-2.5 rounded-xl">
                  <AlertCircle className="text-amber-600" size={20} />
                </div>
                <span className="text-sm font-black text-amber-900 uppercase tracking-widest">
                  Aviso legal
                </span>
              </div>
              {isAttentionOpen ? <ChevronUp className="text-amber-400" /> : <ChevronDown className="text-amber-400" />}
            </button>
            {isAttentionOpen && (
              <div className="px-6 pb-8 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-amber-200 w-full mb-4"></div>
                <div className="space-y-4 text-amber-800 text-[13px] md:text-sm leading-relaxed font-medium">
                  <p>Esta aplicação consiste em um auxílio matemático, de caráter educacional e informativo, destinado ao apoio no cálculo de fracionamento de medicamentos.</p>
                  <p>A aplicação não realiza diagnóstico, prescrição, indicação terapêutica ou tomada de decisão clínica, nem substitui a avaliação, prescrição ou orientação de um profissional de saúde legalmente habilitado.</p>
                  <p>A dose prescrita, a concentração do medicamento, a forma de aplicação e o volume final devem ser definidos e confirmados por profissional habilitado, sendo responsabilidade do usuário a verificação da exatidão dos dados inseridos.</p>
                  <p>Os resultados apresentados não devem ser utilizados como única referência para o preparo ou a administração de medicamentos, devendo sempre ser conferidos por meio de cálculo independente.</p>
                  <p>Medicamentos podem apresentar variações de concentração, volume e apresentação entre fabricantes e lotes, sendo indispensável a conferência do rótulo, bula e prescrição vigente.</p>
                  <p>Esta aplicação não se enquadra como serviço de saúde, nos termos da legislação brasileira, e seu uso ocorre por conta e risco do usuário, dentro das finalidades educacionais aqui descritas.</p>
                </div>
              </div>
            )}
          </div>

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
                  onClick={() => { setImageLoading(true); setIsHelpModalOpen(true); }}
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
                  onClick={() => { setImageLoading(true); setIsSyringeHelpModalOpen(true); }}
                  className="flex items-center gap-2 group ml-1"
                >
                  <div className="p-1 bg-orange-50 rounded-md group-hover:bg-orange-100 transition-colors">
                    <HelpCircle size={14} className="text-orange-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-600 transition-colors text-left">
                    Dúvidas de qual é a sua seringa, clique aqui para ajuda visual
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
              
              <div className="space-y-6 md:border-l md:border-white/10 md:pl-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2 group/traços hover:bg-white/10 transition-all duration-300">
                  <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">Traços Físicos</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-white font-black text-6xl leading-none">
                      {totalTicks.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contar na seringa</span>
                </div>

                <div className="flex justify-between items-center px-2 group/item">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">Volume Exato:</span>
                  <span className="font-mono text-slate-300 font-black text-base">{result.volumeMl.toFixed(3)} <span className="text-[10px] text-slate-500">ml</span></span>
                </div>
                
                <div className="pt-2 px-2">
                  <div className="flex items-center gap-3 text-orange-400/60">
                    <Info size={16} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-tight">
                      Confirme visualmente na seringa
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
          </div>
        </div>
      </main>

      <section className="max-w-6xl mx-auto px-6 mt-20 w-full space-y-12">
        {/* SEÇÃO DE BASE CIENTÍFICA (MODO COLAPSÁVEL) */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300">
          <button 
            onClick={() => setIsScienceOpen(!isScienceOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-indigo-100/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2.5 rounded-xl">
                <BookOpen className="text-indigo-600" size={20} />
              </div>
              <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">
                Base Científica do Cálculo
              </span>
            </div>
            {isScienceOpen ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-indigo-400" />}
          </button>
          {isScienceOpen && (
            <div className="px-6 pb-8 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="h-px bg-indigo-200 w-full mb-4"></div>
              <div className="space-y-4 text-indigo-800 text-[13px] md:text-sm leading-relaxed font-medium">
                <p>Os cálculos realizados por esta aplicação fundamentam-se em princípios matemáticos e farmacológicos amplamente consolidados na prática da área da saúde, especialmente na relação entre dose prescrita, concentration do medicamento e volume a ser administrado.</p>
                <p>A metodologia utilizada baseia-se na <strong>regra de três simples</strong>, procedimento aritmético universalmente adotado para o fracionamento de medicamentos. Esse método é ensinado de forma padronizada em cursos de formação em enfermagem, farmácia e medicina, além de ser empregado rotineiramente em ambientes assistenciais como apoio ao preparo e conferência de doses.</p>
                <p>O cálculo considera exclusivamente valores previamente definidos por prescrição profissional, não realizando qualquer interpretação clínica, ajuste terapêutico ou tomada de decisão sobre conduta em saúde. Dessa forma, trata-se de um auxílio matemático, destinado à organização e conferência de informações já estabelecidas por profissional legalmente habilitado.</p>
                <p className="font-bold text-indigo-900 italic">Ressalta-se que o uso de ferramentas matemáticas não substitui a conferência profissional, sendo obrigatória a validação dos resultados antes de qualquer preparo ou administração de medicamentos.</p>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO DE APOIO AO DESENVOLVEDOR (MODO COLAPSÁVEL) */}
        <div className="bg-orange-50 border border-orange-200 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300">
          <button 
            onClick={() => setIsSupportOpen(!isSupportOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-orange-100/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-2.5 rounded-xl">
                <Heart className="text-orange-600" size={20} />
              </div>
              <span className="text-sm font-black text-orange-900 uppercase tracking-widest">
                Apoio ao Desenvolvedor
              </span>
            </div>
            {isSupportOpen ? <ChevronUp className="text-orange-400" /> : <ChevronDown className="text-orange-400" />}
          </button>
          {isSupportOpen && (
            <div className="px-6 pb-8 pt-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="h-px bg-orange-200 w-full"></div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-orange-200">
                  <Smartphone className="text-white" size={32} />
                </div>
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Olá, pessoal!</h2>
                    <p className="text-slate-600 font-medium text-sm md:text-base">
                      Me chamo <span className="text-orange-600 font-black uppercase tracking-wider">Mateus Miranda</span> e sou o desenvolvedor do aplicativo Calculadora de Fracionamento.
                    </p>
                  </div>
                  <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                    <p>O aplicativo ainda está em desenvolvimento e, em breve, pretendo adicionar novas funcionalidades para torná-lo ainda mais prático e completo.</p>
                    <p>No momento, ele não possui um domínio próprio. Se você gostou do aplicativo e quiser colaborar com qualquer valor para ajudar no seu desenvolvimento, toda contribuição via Pix será recebida com muita gratidão.</p>
                    <p>A ideia é hospedar o aplicativo em um servidor de qualidade, registrar um domínio para facilitar o acesso e seguir evoluindo o projeto.</p>
                    <p className="font-black text-orange-600">Sua contribuição faz toda a diferença para o crescimento deste projeto!</p>
                  </div>
                  
                  <div className="pt-4 flex flex-col items-center md:items-start gap-4">
                    <div className="w-full max-w-md bg-white border border-orange-200 p-4 rounded-[1.8rem] flex items-center justify-between gap-4 group hover:shadow-xl hover:border-orange-400 transition-all duration-300">
                      <div className="flex flex-col text-left overflow-hidden ml-2">
                        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Chave Pix de Apoio</span>
                        <span className="text-sm font-black text-slate-700 truncate">{pixKey}</span>
                      </div>
                      <button 
                        onClick={copyPix}
                        className="p-4 bg-orange-50 border border-orange-100 rounded-2xl hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all text-orange-600 shadow-sm shrink-0"
                      >
                        {pixCopied ? <Check size={18} className="text-green-500 group-hover:text-white" /> : <Copy size={18} />}
                      </button>
                    </div>
                    {pixCopied && (
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] animate-bounce">
                        Chave copiada com sucesso!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE ENTRADA (TERMOS) */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/60 backdrop-blur-md p-0 transition-opacity duration-500">
          <div className="bg-white w-full max-w-6xl h-auto max-h-[85vh] rounded-t-[3rem] shadow-[0_-30px_100px_-20px_rgba(0,0,0,0.5)] border-t border-slate-100 flex flex-col p-6 md:p-14 transform transition-transform duration-500 translate-y-0 overflow-hidden relative">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0 md:mb-8"></div>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-16 flex-1 overflow-hidden">
              <div className="hidden lg:flex w-20 h-20 bg-orange-50 rounded-[2rem] items-center justify-center shrink-0">
                <AlertTriangle className="text-orange-600" size={36} />
              </div>
              <div className="flex-1 w-full flex flex-col overflow-hidden h-full">
                <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight mb-3 md:mb-6 flex items-center gap-4 justify-center lg:justify-start">
                  <AlertTriangle className="text-orange-600 lg:hidden" size={24} />
                  Termos e Responsabilidades
                </h2>
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 text-slate-600 text-[11px] md:text-[14px] leading-relaxed font-medium pb-8">
                  <div className="space-y-4">
                    <h3 className="text-slate-900 font-black uppercase text-sm tracking-wider">TERMOS DE USO</h3>
                    <p>Ao acessar ou utilizar esta aplicação, o usuário declara que leu, compreendeu e concorda integralmente com os presentes Termos de Uso. Caso não concorde com qualquer condição aqui descrita, não deverá utilizar a ferramenta.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">1. Finalidade da aplicação</p>
                    <p>Esta aplicação possui finalidade exclusivamente educacional e informativa, atuando como auxílio matemático para cálculos relacionados ao fracionamento de medicamentos.</p>
                    <p>A ferramenta não substitui, em hipótese alguma, a avaliação, prescrição, orientação ou decisão de um médico ou de qualquer outro profissional de saúde legalmente habilitado.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">2. Não prestação de serviços de saúde</p>
                    <p>O desenvolvedor não presta serviços médicos, farmacêuticos, de enfermagem ou de qualquer outra área da saúde, não realizando diagnóstico, prescrição, indicação de medicamentos ou definition de condutas clínicas.</p>
                    <p>O uso desta aplicação não caracteriza relação profissional de saúde entre o usuário e o desenvolvedor.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">3. Responsabilidade do usuário</p>
                    <p>O usuário declara estar ciente de que:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>A dose prescrita, a concentração do medicamento, a forma de aplicação e o volume final devem ser confirmados com um profissional de saúde legalmente habilitado.</li>
                      <li>Os resultados apresentados dependem exclusivamente da exatidão dos dados inseridos.</li>
                      <li>É de sua responsabilidade verificar se os valores em mg e mL correspondem exatamente à ampola, frasco ou apresentação do medicamento utilizada.</li>
                      <li>Qualquer decisão clínica tomada com base nos resultados é de inteira responsabilidade do profissional habilitado.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">4. Limitação de responsabilidade</p>
                    <p>O desenvolvedor não se responsabiliza por:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Erros decorrentes do preenchimento incorreto dos dados pelo usuário.</li>
                      <li>Interpretação inadequada dos resultados apresentados.</li>
                      <li>Uso da ferramenta como única referência para decisões clínicas.</li>
                      <li>Danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso da aplicação.</li>
                    </ul>
                    <p>O uso da ferramenta ocorre por conta e risco do usuário, respeitadas as finalidades educacionais aqui descritas.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">5. Público-alvo e uso adequado</p>
                    <p>Esta aplicação é destinada exclusivamente a estudantes e profissionais da área da saúde, para fins de estudo, apoio matemático, conferência e organização de cálculos.</p>
                    <p>O uso por pessoas leigas, sem acompanhamento profissional, não é recomendado.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">6. Conformidade legal</p>
                    <p>Esta aplicação não se enquadra como serviço de saúde, nos termos da legislação brasileira vigente, não realizando atos privativos de profissionais regulamentados, nem substituindo práticas assistenciais.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">7. Proteção de dados e privacidade</p>
                    <p>Esta aplicação não armazena, trata, compartilha ou comercializa dados pessoal ou dados sensíveis dos usuários.</p>
                    <p>Caso futuras atualizações envolvam coleta de dados, uma Política de Privacidade específica será disponibilizada.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">8. Alterações dos Termos</p>
                    <p>O desenvolvedor poderá alterar estes Termos de Uso a qualquer momento. Recomenda-se que o usuário revise periodicamente este conteúdo. A continuidade do uso da aplicação após alterações implica concordância com os novos termos.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-black text-slate-800 uppercase text-[12px] tracking-wide">9. Aceitação dos Termos</p>
                    <p>Ao utilizar a aplicação e/ou marcar a opção “Li e aceito os Termos de Uso”, o usuário declara estar plenamente ciente e de acordo com todas as condições aqui estabelecidas.</p>
                  </div>
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
                    <span className="text-[11px] md:text-sm font-black text-slate-600 select-none leading-tight">Li e aceito os Termos de Uso.</span>
                  </label>
                </div>
                <button 
                  disabled={!hasAcceptedTermsCheckbox}
                  onClick={handleAcceptTerms}
                  className={`w-full py-4 md:py-6 rounded-[1rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] md:text-xs transition-all shadow-2xl ${
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

      {/* MODAL DE DÚVIDAS AMPOLA */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={() => setIsHelpModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20">
              <X size={20} className="text-slate-600" />
            </button>
            <div className="p-10 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3"><HelpCircle className="text-orange-500" /> Guia de Referência</h3>
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 aspect-video flex items-center justify-center relative group min-h-[200px]">
                 {imageLoading && <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>}
                 <img src={referenceImageUrl} alt="Referência" className={`w-full h-full object-contain scale-[1.25] group-hover:scale-[1.3] transition-all duration-700 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center font-black uppercase tracking-widest italic">Exemplo meramente ilustrativo</p>
            </div>
            <div className="p-10 pt-4 overflow-y-auto">
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>Observe o rótulo do seu medicamento. Geralmente a concentração é expressa como <span className="text-orange-600 font-black">X mg em Y ml</span>.</p>
                <div className="bg-orange-50/50 p-6 rounded-[1.5rem] border-l-4 border-orange-500 italic font-bold text-slate-700">Exemplo: Se o frasco diz "15mg / 0.5ml", você deve inserir 15 no campo MG e 0.5 no campo ML.</div>
              </div>
              <button onClick={() => setIsHelpModalOpen(false)} className="w-full mt-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]">Voltar ao Cálculo</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DÚVIDAS SERINGA */}
      {isSyringeHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={() => setIsSyringeHelpModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20">
              <X size={20} className="text-slate-600" />
            </button>
            <div className="p-10 pb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3"><HelpCircle className="text-orange-500" /> Qual é a sua seringa?</h3>
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 aspect-[4/5] flex items-center justify-center relative group min-h-[250px]">
                 {imageLoading && <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>}
                 <img src={syringeGuideUrl} alt="Guia de Seringas" className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} />
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center font-black uppercase tracking-widest italic">Compare o bico e as graduações</p>
            </div>
            <div className="p-10 pt-4 overflow-y-auto">
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p>As seringas de insulina variam em capacidade total e na escala dos traços.</p>
                <div className="bg-orange-50/50 p-6 rounded-[1.5rem] border-l-4 border-orange-500 italic font-bold text-slate-700">Identifique se sua seringa é de 30 UI, 50 UI ou 100 UI.</div>
              </div>
              <button onClick={() => setIsSyringeHelpModalOpen(false)} className="w-full mt-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em] text-[10px]">Voltar ao Cálculo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
