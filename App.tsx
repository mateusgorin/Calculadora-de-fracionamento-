
import React, { useState, useMemo, useEffect } from 'react';
import { CalculationResult, SyringeCapacity } from './types.ts';
import Syringe from './components/Syringe.tsx';
import { 
  Calculator, 
  Droplet, 
  Syringe as SyringeIcon,
  X,
  HelpCircle,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity
} from 'lucide-react';

const App: React.FC = () => {
  const [syringeCapacity, setSyringeCapacity] = useState<SyringeCapacity>(100);
  const [totalMg, setTotalMg] = useState<string>("");
  const [totalVolumeMl, setTotalVolumeMl] = useState<string>("");
  const [targetDoseMg, setTargetDoseMg] = useState<string>("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSyringeHelpModalOpen, setIsSyringeHelpModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(true);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [hasAcceptedTermsCheckbox, setHasAcceptedTermsCheckbox] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [isScienceOpen, setIsScienceOpen] = useState(false);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);

  const referenceImageUrl = "https://i.postimg.cc/zvTRZnJg/IMG-20260201-WA0049.jpg";
  const syringeGuideUrl = "https://i.postimg.cc/bvXN2Sj4/file-0000000094b871f5bf0a8a73aa2e41f6-(1).png";

  useEffect(() => {
    const preloadImages = [referenceImageUrl, syringeGuideUrl];
    preloadImages.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const handleVerifyPassword = () => {
    if (passwordInput === "1989") {
      setIsPasswordVerified(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleAcceptTerms = () => {
    if (hasAcceptedTermsCheckbox) {
      setIsEntryModalOpen(false);
    }
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
    const roundedUnits = Math.round(exactUnits * 10) / 10;
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
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-6 mt-12 flex flex-col items-center gap-12">
        
        <div className="w-full space-y-8 max-w-2xl">
          
          {/* AVISO LEGAL EXPANSÍVEL */}
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300">
            <button 
              onClick={() => setIsLegalNoticeOpen(!isLegalNoticeOpen)}
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
              {isLegalNoticeOpen ? <ChevronUp className="text-amber-400" /> : <ChevronDown className="text-amber-400" />}
            </button>
            {isLegalNoticeOpen && (
              <div className="px-6 pb-8 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-amber-800 text-[12px] md:text-[13px] leading-relaxed font-medium">
                <p>Esta aplicação consiste em um auxílio matemático, de caráter educacional e informativo, destinado ao apoio no cálculo de fracionamento de medicamentos.</p>
                <p>A aplicação não realiza diagnóstico, prescrição, indicação terapêutica ou tomada de decisão clínica, nem substitui a avaliação, prescrição ou orientação de um profissional de saúde legalmente habilitado.</p>
                <p>A dose prescrita, a concentração do medicamento, a forma de aplicação e o volume final devem ser definidos e confirmados por profissional habilitado, sendo responsabilidade do usuário a verificação da exatidão dos dados inseridos.</p>
                <p>Os resultados apresentados não devem ser utilizados como única referência para o preparo ou a administração de medicamentos, devendo sempre ser conferidos por meio de cálculo independente.</p>
                <p>Medicamentos podem apresentar variações de concentração, volume e apresentação entre fabricantes e lotes, sendo indispensável a conferência do rótulo, bula e prescrição vigente.</p>
                <p>Esta aplicação não se enquadra como serviço de saúde, nos termos da legislação brasileira, e seu uso ocorre por conta e risco do usuário, dentro das finalidades educacionais aqui descritas.</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-6">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-800">Parâmetros do Cálculo</h2>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3 text-center">
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Dose Prescrita (MG desejado)</label>
                <div className="relative group max-w-sm mx-auto">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={targetDoseMg}
                    onChange={(e) => setTargetDoseMg(e.target.value.replace(',', '.'))}
                    placeholder="0.0"
                    className="w-full pl-16 pr-16 py-6 bg-slate-50/50 border-2 border-slate-100 rounded-[1.8rem] focus:border-orange-500 focus:bg-white focus:shadow-xl focus:shadow-orange-50 outline-none transition-all text-4xl font-black text-slate-800 text-center"
                  />
                  <Calculator className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors" size={28} />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xs uppercase tracking-widest">mg</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-4 max-w-sm mx-auto">
                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">MG na ampola</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={totalMg}
                      onChange={(e) => setTotalMg(e.target.value.replace(',', '.'))}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center"
                    />
                  </div>
                  <div className="pb-4 text-slate-200 font-light text-4xl">/</div>
                  <div className="flex-1 space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Total em ML</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={totalVolumeMl}
                      onChange={(e) => setTotalVolumeMl(e.target.value.replace(',', '.'))}
                      placeholder="0.0"
                      className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => { setImageLoading(true); setIsHelpModalOpen(true); }}
                  className="flex items-center justify-center gap-2 group w-full"
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
                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Capacidade da Seringa (UI)</label>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
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
                  className="flex items-center justify-center gap-2 group w-full"
                >
                  <div className="p-1 bg-orange-50 rounded-md group-hover:bg-orange-100 transition-colors">
                    <HelpCircle size={14} className="text-orange-500" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                    Dúvidas de qual é a sua seringa, clique aqui para ajuda visual
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RESULTADO DA CONVERSÃO ATUALIZADO */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-orange-500 transition-transform duration-1000 group-hover:scale-110">
              <Droplet size={260} />
            </div>
            
            <div className="flex flex-col mb-12">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[1px] bg-orange-500/50"></span>
                Resultado da Conversão
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Activity size={14} className="text-orange-500" />
                <span className="text-[11px] font-black text-orange-200 uppercase tracking-widest">Cálculo Preciso</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center gap-8">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">Aspirar até a marca:</p>
                <div className="flex items-baseline justify-center gap-4">
                  <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 leading-none drop-shadow-sm">
                    {result.units}
                  </span>
                  <span className="text-2xl font-black text-slate-400 uppercase tracking-tighter">UI</span>
                </div>
                <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl w-fit mx-auto">
                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">
                     Escala de {tickValue} UI por traço
                   </span>
                </div>
              </div>
              
              <div className="w-full max-w-sm grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-1 group/traços hover:bg-white/10 transition-all duration-300">
                  <span className="text-orange-400 text-[9px] font-black uppercase tracking-[0.1em]">Traços Físicos</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-black text-3xl md:text-4xl leading-none">
                      {totalTicks.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Contar na seringa</span>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center justify-center gap-1 group/volume hover:bg-white/10 transition-all duration-300">
                  <span className="text-sky-400 text-[9px] font-black uppercase tracking-[0.1em]">Volume Exato</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-black text-xl md:text-2xl leading-none">
                      {result.volumeMl.toFixed(3)}
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">ml</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Confirme na seringa</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest animate-pulse mt-2">
                Confirme visualmente na seringa
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center py-10">
          <div className="w-full max-w-[360px]">
            <Syringe capacity={syringeCapacity} currentUI={result.units} />
          </div>
        </div>

      </main>

      <section className="max-w-2xl mx-auto px-6 mt-20 space-y-12">
        {/* FUNDAMENTAÇÃO E MÉTODO DE CÁLCULO ATUALIZADO */}
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
                Fundamentação e método de cálculo
              </span>
            </div>
            {isScienceOpen ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-indigo-400" />}
          </button>
          {isScienceOpen && (
            <div className="px-6 pb-8 pt-2 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 text-[13px] md:text-sm text-indigo-800 leading-relaxed font-medium">
              <div className="space-y-4">
                <p>Os cálculos realizados por esta aplicação fundamentam-se em princípios matemáticos e farmacológicos amplamente consolidados na prática da área da saúde, especialmente na relação entre dose prescrita, concentração do medicamento e volume a ser administrado.</p>
                <p>A metodologia adotada baseia-se na Regra de Três Simples, procedimento aritmético universalmente utilizado para o fracionamento de medicamentos. Esse método é ensinado de forma padronizada em cursos de enfermagem, farmácia e medicina, sendo empregado rotineiramente em ambientes assistenciais como apoio ao preparo e à conferência de doses.</p>
                <p>O sistema considera exclusivamente valores previamente definidos por prescrição profissional, não realizando qualquer interpretação clínica, ajuste terapêutico ou tomada de decisão em saúde. Trata-se, portanto, de um auxílio matemático, destinado à organização e conferência de informações já estabelecidas por profissional legalmente habilitado.</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Lógica do cálculo</h4>
                <p>O cálculo utiliza três informações básicas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Concentração do medicamento (ex: 15 mg em 0,5 mL)</li>
                  <li>Dose prescrita (ex: 2,5 mg)</li>
                  <li>Volume necessário, calculado proporcionalmente</li>
                </ul>
                <div className="bg-white/40 p-4 rounded-2xl border border-indigo-100 mt-2">
                  <p className="font-bold mb-1">Exemplo:</p>
                  <p>Se 15 mg estão em 0,5 mL, então 2,5 mg correspondem a 0,083 mL.</p>
                  <p className="mt-1">Esse volume é convertido para Unidades Internacionais (UI) conforme o padrão U-100, no qual:</p>
                  <p className="font-bold">1 mL = 100 UI → Resultado: 8,3 UI.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Precisão das seringas</h4>
                <p>A conversão de UI para “traços” respeita as escalas reais das seringas disponíveis no mercado:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Seringa de 100 UI: 2 UI por traço</li>
                  <li>Seringa de 50 UI: 1 UI por traço</li>
                  <li>Seringa de 30 UI: 0,5 UI por traço</li>
                </ul>
                <p>O sistema ajusta automaticamente os valores conforme o modelo de seringa selecionado.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Arredondamento e segurança</h4>
                <p>O valor final em UI é arredondado para uma casa decimal, garantindo equilíbrio entre precisão matemática e viabilidade prática, já que valores menores não são passíveis de mensuração visual confiável.</p>
                <p>O volume exato em mL é exibido com três casas decimais, permitindo conferência detalhada antes do preparo.</p>
              </div>

              <div className="space-y-3 border-t border-indigo-200 pt-4">
                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Conclusão</h4>
                <p>Os cálculos apresentados são matematicamente corretos, seguros e compatíveis com a prática clínica real.</p>
                <p className="font-bold">Ressalta-se que o uso de ferramentas matemáticas não substitui a conferência profissional, sendo obrigatória a validação dos resultados antes de qualquer preparo ou administração de medicamentos.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE ENTRADA (SENHA E TERMOS) */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 transition-opacity duration-500">
          {!isPasswordVerified ? (
            /* PASSO 1: SENHA */
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 p-10 md:p-14 flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300">
              <div className="bg-orange-500 p-4 rounded-3xl shadow-lg shadow-orange-200">
                <SyringeIcon className="text-white" size={32} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Acesso Restrito</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Digite a senha para continuar</p>
              </div>
              <div className="w-full space-y-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                  placeholder="Senha de acesso"
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center text-xl tracking-widest"
                  autoFocus
                />
                <button 
                  onClick={handleVerifyPassword}
                  className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-orange-200 active:scale-95 transition-all"
                >
                  Entrar
                </button>
              </div>
            </div>
          ) : (
            /* PASSO 2: TERMOS */
            <div className="bg-white w-full max-w-2xl h-auto max-h-[85vh] rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col p-6 md:p-14 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden relative">
              <div className="flex flex-col items-center gap-6 flex-1 overflow-hidden">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight text-center flex items-center justify-center gap-3">
                  ⚠️ Termos de Uso e Responsabilidades
                </h2>
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 text-slate-600 text-[11px] md:text-[13px] leading-relaxed font-medium pb-8 text-left w-full">
                   <div className="space-y-6">
                     <p className="font-bold uppercase text-[10px] tracking-widest text-slate-400">TERMOS DE USO</p>
                     <p>Ao acessar ou utilizar esta aplicação, o usuário declara que leu, compreendeu e concorda integralmente com os presentes Termos de Uso. Caso não concorde com qualquer condição aqui descrita, não deverá utilizar a ferramenta.</p>
                     
                     <p className="font-black text-slate-800">1. Finalidade da aplicação</p>
                     <p>Esta aplicação possui finalidade exclusivamente educacional e informativa, atuando como auxílio matemático para cálculos relacionados ao fracionamento de medicamentos.</p>
                     <p>A ferramenta não substitui, em hipótese alguma, a avaliação, prescrição, orientação ou decisão de um médico ou de qualquer outro profissional de saúde legalmente habilitado.</p>
                     
                     <p className="font-black text-slate-800">2. Não prestação de serviços de saúde</p>
                     <p>O desenvolvedor não presta serviços médicos, farmacêuticos, de enfermagem ou de qualquer outra área da saúde, não realizando diagnóstico, prescrição, indicação de medicamentos ou definição de condutas clínicas.</p>
                     <p>O uso desta aplicação não caracteriza relação profissional de saúde entre o usuário e o desenvolvedor.</p>
                     
                     <p className="font-black text-slate-800">3. Responsabilidade do usuário</p>
                     <p>O usuário declara estar ciente de que:</p>
                     <ul className="list-disc pl-5 space-y-2">
                       <li>A dose prescrita, a concentração do medicamento, a forma de aplicação e o volume final devem ser confirmados com um profissional de saúde legalmente habilitado.</li>
                       <li>Os resultados apresentados dependem exclusivamente da exatidão dos dados inseridos.</li>
                       <li>É de sua responsabilidade verificar se os valores em mg e mL correspondem exatamente à ampola, frasco ou apresentação do medicamento utilizada.</li>
                       <li>Qualquer decisão clínica tomada com base nos resultados é de inteira responsabilidade do profissional habilitado.</li>
                     </ul>
                     
                     <p className="font-black text-slate-800">4. Limitação de responsabilidade</p>
                     <p>O desenvolvedor não se responsabiliza por:</p>
                     <ul className="list-disc pl-5 space-y-2">
                       <li>Erros decorrentes do preenchimento incorreto dos dados pelo usuário.</li>
                       <li>Interpretação inadequada dos resultados apresentados.</li>
                       <li>Uso da ferramenta como única referência para decisões clínicas.</li>
                       <li>Danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso da aplicação.</li>
                     </ul>
                     <p>O uso da ferramenta ocorre por conta e risco do usuário, respeitadas as finalidades educacionais aqui descritas.</p>
                     
                     <p className="font-black text-slate-800">5. Público-alvo e uso adequado</p>
                     <p>Esta aplicação é destinada exclusivamente a estudantes e profissionais da área da saúde, para fins de estudo, apoio matemático, conferência e organization de cálculos.</p>
                     <p>O uso por pessoas leigas, sem acompanhamento profissional, não é recomendado.</p>
                     
                     <p className="font-black text-slate-800">6. Conformidade legal</p>
                     <p>Esta aplicação não se enquadra como serviço de saúde, nos termos da legislação brasileira vigente, não realizando atos privativos de profissionais regulamentados, nem substituindo práticas assistenciais.</p>
                     
                     <p className="font-black text-slate-800">7. Proteção de dados e privacidade</p>
                     <p>Esta aplicação não armazena, trata, compartilha ou comercializa dados pessoais ou dados sensíveis dos usuários.</p>
                     <p>Caso futuras atualizações envolvam coleta de dados, uma Política de Privacidade específica será disponibilizada.</p>
                     
                     <p className="font-black text-slate-800">8. Alterações dos Termos</p>
                     <p>O desenvolvedor poderá alterar estes Termos de Uso a qualquer momento. Recomenda-se que o usuário revise periodicamente este conteúdo. A continuidade do uso da aplicação após alterações implica concordância com os novos termos.</p>
                     
                     <p className="font-black text-slate-800">9. Aceitação dos Termos</p>
                     <p>Ao utilizar a aplicação e/ou marcar a opção “Li e aceito os Termos de Uso”, o usuário declara estar plenamente ciente e de acordo com todas as condições estabelecidas.</p>
                   </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={hasAcceptedTermsCheckbox}
                        onChange={(e) => setHasAcceptedTermsCheckbox(e.target.checked)}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${hasAcceptedTermsCheckbox ? 'bg-orange-600 border-orange-600' : 'bg-white border-slate-300'}`}>
                        {hasAcceptedTermsCheckbox && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <span className="text-[11px] font-black text-slate-600 uppercase">Li e aceito os Termos de Uso</span>
                    </label>
                  </div>
                  <button 
                    disabled={!hasAcceptedTermsCheckbox}
                    onClick={handleAcceptTerms}
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all ${hasAcceptedTermsCheckbox ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                  >
                    Acessar Ferramenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAIS DE AJUDA */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={() => setIsHelpModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full z-20">
              <X size={20} />
            </button>
            <div className="p-10 pb-6 text-center overflow-y-auto">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-center gap-3">
                <HelpCircle className="text-orange-500" /> Onde ver os valores?
              </h3>
              
              <div className="rounded-[2.5rem] overflow-hidden bg-slate-50/50 relative min-h-[220px] flex items-center justify-center border border-slate-100/50">
                 {imageLoading && (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                     <Loader2 className="animate-spin text-orange-500" />
                   </div>
                 )}
                 <img 
                   src={referenceImageUrl} 
                   alt="Medicamento Exemplo" 
                   className={`max-w-[85%] max-h-[200px] object-contain block mx-auto transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`} 
                   onLoad={() => setImageLoading(false)} 
                 />
              </div>

              <div className="mt-8 text-left space-y-4 px-2">
                <div className="space-y-1">
                  <p className="text-slate-800 text-sm font-black uppercase tracking-tight">Esses dados você encontra na própria caixa do medicamento.</p>
                  <p className="text-slate-500 text-[13px] font-medium leading-relaxed italic">Verifique as informações na embalagem original.</p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-slate-700 text-xs md:text-sm font-bold leading-relaxed">
                    É só olhar o rótulo onde aparece a <span className="text-slate-900 font-black">dosagem (mg)</span> e a <span className="text-slate-900 font-black">concentração (mg/mL)</span>.
                  </p>
                  <p className="text-slate-700 text-xs md:text-sm font-medium leading-relaxed">
                    No exemplo da imagem, está escrito <span className="font-bold text-orange-600">15 mg em 0,5 mL</span>.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
                   <span className="text-lg shrink-0">⚠️</span>
                   <p className="text-orange-900 text-[11px] font-black uppercase leading-tight tracking-tight">
                     Essas informações são obrigatórias para fazer o cálculo correto.
                   </p>
                </div>
              </div>
            </div>
            <div className="p-10 pt-4 text-center">
              <button onClick={() => setIsHelpModalOpen(false)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px]">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {isSyringeHelpModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col max-h-[90vh]">
            <button onClick={() => setIsSyringeHelpModalOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full z-20">
              <X size={20} />
            </button>
            <div className="p-10 pb-6 text-center overflow-y-auto">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-center gap-3"><HelpCircle className="text-orange-500" /> Tipos de Seringa</h3>
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative min-h-[250px] p-4">
                 {imageLoading && <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10"><Loader2 className="animate-spin text-orange-500" /></div>}
                 <img src={syringeGuideUrl} alt="Syringe Guide" className={`max-w-full max-h-full block mx-auto object-contain ${imageLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} />
              </div>
              
              <div className="mt-8 text-left space-y-4 px-2">
                <div className="space-y-1">
                  <p className="text-slate-800 text-sm font-black uppercase tracking-tight">Olhe para os números impressos na seringa</p>
                  <p className="text-slate-500 text-[13px] font-medium leading-relaxed italic">Ignore o tamanho físico e foque nos números.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-slate-700 text-xs md:text-sm font-bold leading-relaxed">Veja qual é o <span className="text-orange-600 uppercase font-black">MAIOR</span> número que aparece na escala:</p>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 text-orange-500">➡️</span>
                      <span>Se o último número for <span className="font-bold">30</span>: a seringa é de <span className="font-bold text-slate-900">30 unidades (0,3 mL)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 text-orange-500">➡️</span>
                      <span>Se o último número for <span className="font-bold">50</span>: a seringa é de <span className="font-bold text-slate-900">50 unidades (0,5 mL)</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="shrink-0 text-orange-500">➡️</span>
                      <span>Se o último número for <span className="font-bold">100</span>: a seringa é de <span className="font-bold text-slate-900">100 unidades (1 mL)</span></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
                   <span className="text-lg shrink-0">📌</span>
                   <p className="text-orange-900 text-[11px] font-black uppercase leading-tight tracking-tight">
                     O último número sempre indica a capacidade total da seringa.
                   </p>
                </div>
              </div>
            </div>
            <div className="p-10 pt-4 text-center">
              <button onClick={() => setIsSyringeHelpModalOpen(false)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px]">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
