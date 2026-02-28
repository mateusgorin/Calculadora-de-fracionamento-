
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculationResult, ScaleCapacity } from './types.ts';
import Scale from './components/Scale.tsx';
import { 
  Calculator, 
  Droplet, 
  Ruler,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity,
  Download,
  Heart,
  Coffee,
  Copy,
  Check
} from 'lucide-react';

const App: React.FC = () => {
  const [scaleCapacity, setScaleCapacity] = useState<ScaleCapacity>(100);
  const [totalMass, setTotalMass] = useState<string>("");
  const [totalVolume, setTotalVolume] = useState<string>("");
  const [targetMass, setTargetMass] = useState<string>("");
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasAcceptedTerms') !== 'true';
    }
    return true;
  });
  const [hasAcceptedTermsCheckbox, setHasAcceptedTermsCheckbox] = useState(false);
  const [isScienceOpen, setIsScienceOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("mateusmirandaamaral@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptTerms = () => {
    if (hasAcceptedTermsCheckbox) {
      setIsEntryModalOpen(false);
      localStorage.setItem('hasAcceptedTerms', 'true');
    }
  };

  const result = useMemo<CalculationResult>(() => {
    const tMass = parseFloat(totalMass.replace(',', '.')) || 0;
    const tVol = parseFloat(totalVolume.replace(',', '.')) || 0;
    const dMass = parseFloat(targetMass.replace(',', '.')) || 0;

    if (tVol === 0 || tMass === 0) {
      return { units: 0, volume: 0, ratio: 0 };
    }
    
    const ratio = tMass / tVol;
    const volumeNeeded = dMass / ratio;
    
    const exactUnits = volumeNeeded * 100;
    const roundedUnits = Math.round(exactUnits * 10) / 10;
    const finalUnits = Math.min(roundedUnits, scaleCapacity);
    
    return {
      units: finalUnits,
      volume: volumeNeeded,
      ratio: ratio
    };
  }, [scaleCapacity, totalMass, totalVolume, targetMass]);

  const tickValue = scaleCapacity === 100 ? 2 : (scaleCapacity === 30 ? 0.5 : 1);
  const totalTicks = result.units / tickValue;

  return (
    <div className={`min-h-screen bg-[#fcfdfe] pb-20 w-full overflow-x-hidden ${isEntryModalOpen ? 'max-h-screen overflow-hidden' : ''}`}>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 w-full">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-2xl shadow-lg shadow-orange-200/50 flex items-center justify-center">
              <Ruler className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Calculadora de Proporções
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {deferredPrompt && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: 0,
                    y: [0, -4, 0]
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
                >
                  <Download size={14} className="animate-bounce" />
                  <span className="hidden sm:inline">Instalar aplicativo</span>
                  <span className="sm:hidden">Instalar aplicativo</span>
                </motion.button>
              )}
            </AnimatePresence>
            <div className="hidden md:block">
              <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Escala Padrão 100U
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-6 flex flex-col items-center gap-6">
        
        <div className="w-full space-y-6 max-w-2xl">
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-800">Parâmetros de Cálculo</h2>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3 text-center">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Valor Desejado (Unidade Base)</label>
                <div className="relative group max-w-sm mx-auto">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={targetMass}
                    onChange={(e) => setTargetMass(e.target.value)}
                    placeholder="0.0"
                    className="w-full pl-14 pr-14 py-6 bg-slate-50/50 border-2 border-slate-100 rounded-[1.8rem] focus:border-orange-500 focus:bg-white focus:shadow-xl focus:shadow-orange-50 outline-none transition-all text-4xl font-black text-slate-800 text-center"
                  />
                  <Calculator className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" size={24} />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-widest">un</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-4 max-w-sm mx-auto">
                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Valor Total</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={totalMass}
                      onChange={(e) => setTotalMass(e.target.value)}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center"
                    />
                  </div>
                  <div className="pb-4 text-slate-200 font-light text-4xl">/</div>
                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Volume Total</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={totalVolume}
                      onChange={(e) => setTotalVolume(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Escala de Referência (Unidades)</label>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {[30, 50, 100].map((cap) => (
                    <button
                      key={cap}
                      onClick={() => setScaleCapacity(cap as ScaleCapacity)}
                      className={`py-5 rounded-[1.2rem] border-2 transition-all text-sm font-black tracking-widest ${
                        scaleCapacity === cap 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100' 
                        : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {cap} U
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RESULTADO DA PROPORÇÃO ATUALIZADO */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-orange-500 transition-transform duration-1000 group-hover:scale-110">
              <Droplet size={260} />
            </div>
            
            <div className="flex flex-col mb-6">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
                <span className="w-5 h-[1px] bg-orange-500/50"></span>
                Resultado da Proporção
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Activity size={12} className="text-orange-500" />
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Processamento Matemático</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center gap-8">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">Nível na Escala:</p>
                <div className="flex items-baseline justify-center gap-4">
                  <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 leading-none drop-shadow-sm">
                    {result.units.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                  <span className="text-2xl font-black text-slate-400 uppercase tracking-tighter">U</span>
                </div>
                <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl w-fit mx-auto">
                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                     Escala de {tickValue} U por divisão
                   </span>
                </div>
              </div>
              
              <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-1 group/traços hover:bg-white/10 transition-all duration-300">
                  <span className="text-orange-400 text-[9px] font-black uppercase tracking-[0.1em]">Divisões da Escala</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-black text-3xl md:text-4xl leading-none">
                      {totalTicks.toLocaleString('en-US', { maximumFractionDigits: 1 })}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Contar divisões</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-1 group/volume hover:bg-white/10 transition-all duration-300">
                  <span className="text-sky-400 text-[9px] font-black uppercase tracking-[0.1em]">Volume Calculado</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-black text-xl md:text-2xl leading-none">
                      {result.volume.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">vol</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Confirme no instrumento</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest animate-pulse mt-2">
                Referência visual na escala
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[400px]">
            <Scale capacity={scaleCapacity} currentUnits={result.units} />
          </div>
        </div>

      </main>

      <section className="max-w-2xl mx-auto px-6 mt-6 space-y-6">
        {/* FUNDAMENTAÇÃO E MÉTODO DE CÁLCULO */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300">
          <button 
            onClick={() => setIsScienceOpen(!isScienceOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-indigo-100/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <BookOpen className="text-indigo-600" size={18} />
              </div>
              <span className="text-[11px] md:text-xs font-black text-indigo-900 uppercase tracking-widest">
                Fundamentação e método de cálculo
              </span>
            </div>
            {isScienceOpen ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-indigo-400" />}
          </button>
          {isScienceOpen && (
            <div className="px-6 pb-8 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 text-[13px] md:text-sm text-indigo-800 leading-relaxed font-medium">
              <div className="space-y-4">
                <p>Os cálculos realizados por esta aplicação fundamentam-se em princípios matemáticos de proporcionalidade, estabelecendo a relação entre um valor alvo e uma escala de referência volumétrica.</p>
                <p>A metodologia adotada baseia-se na Regra de Três Simples, um procedimento aritmético universal para a determinação de valores desconhecidos em proporções diretas. Esse método permite a conversão entre grandezas proporcionais, como massa, volume e unidades de escala, de forma objetiva e precisa.</p>
                <p>A aplicação processa exclusivamente valores inseridos manualmente pelo usuário, não realizando qualquer tipo de recomendação técnica, validação de dados ou orientação de uso. Trata-se de um processador matemático destinado à organização e visualização de relações quantitativas.</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Lógica do processamento</h4>
                <p>O cálculo utiliza três variáveis básicas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Valor de referência (ex: 15 unidades em 0,5 de volume)</li>
                  <li>Valor alvo (ex: 2,5 unidades)</li>
                  <li>Volume correspondente, calculado proporcionalmente</li>
                </ul>
                <div className="bg-white/40 p-4 rounded-2xl border border-indigo-100 mt-2">
                  <p className="font-bold mb-1">Exemplo:</p>
                  <p>Se 15 unidades estão associadas a 0,5 de volume, então 2,5 unidades correspondem a 0,083 de volume.</p>
                  <p className="mt-1">Esse volume é projetado em uma escala de referência de 100 unidades (U), onde:</p>
                  <p className="font-bold">1 unidade de volume = 100 U → Resultado: 8,3 U.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Resolução da Escala</h4>
                <p>A representação visual considera resoluções padrão de escalas lineares:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Escala de 100 U: 2 U por divisão</li>
                  <li>Escala de 50 U: 1 U por divisão</li>
                  <li>Escala de 30 U: 0,5 U por divisão</li>
                </ul>
                <p>A visualização é ajustada automaticamente conforme a capacidade da escala selecionada.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Arredondamento e Precisão</h4>
                <p>O valor final apresentado na escala é arredondado para uma casa decimal, visando facilitar a leitura visual. O volume proporcional exato é exibido com três casas decimais para conferência numérica detalhada.</p>
              </div>

              <div className="space-y-3 border-t border-indigo-200 pt-4">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Conclusão</h4>
                <p>Os resultados apresentados representam relações matemáticas exatas, calculadas com base exclusivamente nos dados fornecidos pelo usuário.</p>
                <p className="font-bold">O uso de ferramentas matemáticas não substitui a conferência independente dos valores, sendo responsabilidade do usuário a validação dos resultados antes de qualquer utilização prática.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="max-w-2xl mx-auto px-6 mt-6 pb-12">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <Heart className="text-rose-500 animate-pulse" size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Apoie o Desenvolvedor</h3>
            <p className="text-[12px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
              Se esta ferramenta matemática foi útil para você, considere apoiar a manutenção e criação de novos projetos.
            </p>
          </div>
          <button 
            onClick={handleCopyPix}
            className="bg-white px-6 py-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-2 w-full max-w-[360px] hover:border-orange-200 hover:shadow-md transition-all group relative"
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chave PIX (E-mail)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-bold text-slate-700 select-all">mateusmirandaamaral@gmail.com</span>
              {copied ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Copy size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
              )}
            </div>
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2">
                Copiado!
              </span>
            )}
          </button>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Coffee size={12} />
            <span>Feito com dedicação</span>
          </div>
        </div>
      </footer>

      {/* MODAL DE ENTRADA (AVISO LEGAL) - BOTTOM SHEET SEMI-TRANSPARENTE */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/15 backdrop-blur-[6px] flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-3xl h-[60vh] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border-t border-white/20"
            >
              {/* Handle bar for bottom sheet feel */}
              <div className="w-full flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8 md:px-12">
                <div className="flex flex-col items-center gap-4 w-full mb-8">
                  <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
                    <Ruler className="text-white" size={24} />
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight text-center">
                    Aviso legal
                  </h2>
                </div>
                
                <div className="space-y-5 text-slate-600 text-sm md:text-base leading-relaxed font-medium text-center max-w-xl mx-auto">
                  <p>Esta aplicação é uma ferramenta de apoio matemático, com finalidade educacional, destinada exclusivamente ao cálculo de proporções e conversões entre unidades e escalas numéricas.</p>
                  <p>A ferramenta não realiza recomendações, orientações de uso, instruções técnicas ou qualquer tipo de indicação prática, limitando-se ao processamento matemático de valores informados manualmente pelo usuário.</p>
                  <p>A definição dos valores, proporções e parâmetros utilizados é de inteira responsabilidade do usuário, bem como a verificação da exatidão e adequação dos dados inseridos.</p>
                  <p>Os resultados apresentados representam apenas relações matemáticas e não devem ser utilizados como única referência para qualquer finalidade prática sem validação independente.</p>
                  <p>Esta aplicação não se caracteriza como serviço especializado, sendo seu uso de responsabilidade exclusiva do usuário, restrito às finalidades de visualização e cálculo matemático aqui descritas.</p>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 w-full">
                <div className="w-full flex flex-col gap-4 max-w-md mx-auto">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={hasAcceptedTermsCheckbox}
                      onChange={(e) => setHasAcceptedTermsCheckbox(e.target.checked)}
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${hasAcceptedTermsCheckbox ? 'bg-orange-600 border-orange-600 shadow-lg shadow-orange-200' : 'bg-white border-slate-300 group-hover:border-orange-400'}`}>
                      {hasAcceptedTermsCheckbox && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                    <span className="text-[11px] md:text-xs font-black text-slate-700 uppercase tracking-wide">Li e aceito o Aviso Legal</span>
                  </label>
                  
                  <button 
                    disabled={!hasAcceptedTermsCheckbox}
                    onClick={handleAcceptTerms}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] md:text-xs transition-all active:scale-[0.98] ${hasAcceptedTermsCheckbox ? 'bg-orange-600 text-white shadow-2xl shadow-orange-200 hover:bg-orange-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Acessar Ferramenta
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
