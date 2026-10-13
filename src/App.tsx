import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle, 
  Globe, 
  Lock, 
  TrendingUp, 
  Gift, 
  Phone, 
  Mail, 
  ArrowRight, 
  Menu, 
  X as CloseIcon,
  Sparkles
} from 'lucide-react';

// Logo vetorial da Osborn S.A. mantendo a cor Azul Ciano exclusiva (#00E5FF)
const OsbornLogo = ({ className = "w-8 h-8", cyanColor = "#00E5FF" }) => (
  <svg 
    viewBox="0 0 100 80" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Pico Esquerdo Secundário em Tom Grafite */}
    <path 
      d="M32 30 L8 72 L42 72 Z" 
      fill="#334155" 
      stroke="#64748B" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    <path 
      d="M32 30 L42 72 L26 72 Z" 
      fill="#1E293B" 
    />
    
    {/* Pico Central Principal com Gradiente Azul Ciano da Marca */}
    <path 
      d="M48 8 L18 72 L78 72 Z" 
      fill="#0F172A" 
      stroke={cyanColor} 
      strokeWidth="3" 
      strokeLinejoin="round" 
    />
    <path 
      d="M48 8 L78 72 L48 72 Z" 
      fill="url(#osborn-cyan-gradient)" 
      opacity="0.9" 
    />

    {/* Pico Direito Secundário */}
    <path 
      d="M68 22 L45 72 L92 72 Z" 
      fill="#1E293B" 
      stroke="#475569" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    <path 
      d="M68 22 L92 72 L62 72 Z" 
      fill="#020617" 
    />

    <defs>
      <linearGradient id="osborn-cyan-gradient" x1="48" y1="8" x2="78" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor={cyanColor} />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
    </defs>
  </svg>
);

// Componente de Cartão com Efeito 3D Tilt Ultraleve, Brilho Holográfico e Fallback SVG de Alta Resolução
interface Interactive3DCardProps {
  id: string;
  name: string;
  tier?: string;
  imgPaths?: any;
  fallbackBg?: string;
  chipColor?: string;
}

const Interactive3DCard: React.FC<Interactive3DCardProps> = ({ id, name, tier, imgPaths, fallbackBg, chipColor = "gold" }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [imgIndex, setImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Efeito de Inclinação 3D Fluida baseado no cursor do mouse (sem lag de GPU)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Cálculo leve da rotação (máximo 12 graus)
    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);

    // Posição do brilho holográfico
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.4 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  // Tenta carregar as imagens anexadas (ex: Black_2.jpg, black.jpg, etc)
  const handleImageError = () => {
    if (imgIndex < imgPaths.length - 1) {
      setImgIndex(prev => prev + 1);
    } else {
      setImgError(true);
    }
  };

  return (
    <div 
      className="perspective-1000 w-full max-w-md mx-auto py-2"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: rotateX === 0 ? 'transform 0.5s ease-out' : 'none'
        }}
        className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-950 transform-gpu cursor-pointer group select-none"
      >
        {/* Renderização da Imagem Real fornecida pelo usuário */}
        {!imgError ? (
          <img 
            src={imgPaths[imgIndex]} 
            alt={name} 
            onError={handleImageError}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Renderização Vetorial Executiva Fallback (Prata/Grafite/Ouro) */
          <div className={`w-full h-full p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden ${fallbackBg}`}>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <OsbornLogo className="w-7 h-7" />
                <span className="font-mono font-bold tracking-wider text-sm text-slate-200">OSBORN S.A.</span>
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300 font-semibold">
                {tier}
              </span>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-11 h-8 rounded-md border flex items-center justify-between px-2 shadow-inner ${
                chipColor === 'gold' 
                  ? 'bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border-amber-500/50' 
                  : 'bg-gradient-to-tr from-slate-200 via-slate-400 to-slate-100 border-slate-400'
              }`}>
                <div className="w-full h-[1px] bg-slate-800/40"></div>
              </div>
              <svg className="w-5 h-5 text-slate-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A5 5 0 0 1 8.5 9.5" />
                <path d="M11.5 17.5A9 9 0 0 0 11.5 6.5" />
                <path d="M14.5 20.5A13 13 0 0 0 14.5 3.5" />
              </svg>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="font-mono text-base sm:text-xl tracking-widest text-slate-100 font-medium">
                4512 8765 4321 0987
              </div>
              <div className="flex justify-between items-end text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
                <div>
                  <span className="block text-[8px] text-slate-500">TITULAR</span>
                  <span className="text-slate-200 font-semibold">LUIS S. RIBEIRO</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500">VALIDADE</span>
                  <span className="text-slate-200 font-semibold">09/30</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camada Holográfica Prata/Glassmorphism Dinâmica */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)`,
            mixBlendMode: 'overlay'
          }}
        ></div>

        {/* Borda Prata Metálica Interna */}
        <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none group-hover:border-slate-300/40 transition-colors"></div>
      </div>
    </div>
  );
};

// Lista dos 3 Cartões Corporativos Osborn S.A.
const CARDS = [
  {
    id: 'black',
    name: 'Osborn Black Elite',
    tier: 'BLACK ELITE',
    tagline: 'O ápice da soberania financeira para executivos e grandes patrimônios.',
    imgPaths: ['Black_2.jpg', 'black.jpg'],
    fallbackBg: 'bg-gradient-to-br from-zinc-950 via-slate-900 to-black text-slate-100',
    chipColor: 'silver',
    badge: 'MÁXIMO PRIVILÉGIO',
    cashback: '3.5%',
    lounge: 'Acesso Ilimitado + 4 Convidados',
    points: '4.2 pontos por dólar',
    limit: 'Superior a R$ 500.000',
    iof: 'Isenção Total (100% restituído)',
    benefits: [
      'Acesso ilimitado às salas VIP Priority Pass, LoungeKey e Centurion no mundo todo',
      'Atendimento prioritário com gestor privado via WhatsApp e linha direta 24/7',
      'Seguro de viagem executivo com cobertura de até US$ 2.000.000',
      'Isenção total de anuidade com gastos mensais acima de R$ 20.000',
      'Transferência imediata de pontos sem expiração para as principais cias aéreas'
    ]
  },
  {
    id: 'platinum',
    name: 'Osborn Platinum Infinity',
    tier: 'PLATINUM INFINITY',
    tagline: 'Equilíbrio perfeito entre alta performance, milhas e flexibilidade corporativa.',
    imgPaths: ['Platinum_2.jpg', 'platinum.jpg'],
    fallbackBg: 'bg-gradient-to-br from-slate-900 via-zinc-800 to-slate-950 text-slate-200',
    chipColor: 'silver',
    badge: 'ALTA PERFORMANCE',
    cashback: '2.5%',
    lounge: '12 Acessos anuais à Sala VIP',
    points: '2.8 pontos por dólar',
    limit: 'Até R$ 200.000',
    iof: 'Desconto de 70% na alíquota',
    benefits: [
      '12 acessos anuais às salas VIP LoungeKey nos principais aeroportos internacionais',
      'Proteção estendida de compra e garantia original multiplicada',
      'Sem cobrança de taxas em saques internacionais de emergência',
      'Isenção total de anuidade com gastos mensais acima de R$ 10.000',
      'Tags de pedágio e estacionamentos parceiros isentos de mensalidade'
    ]
  },
  {
    id: 'gold',
    name: 'Osborn Gold Prestige',
    tier: 'GOLD PRESTIGE',
    tagline: 'Solidez e vantagens estruturadas para alavancar suas conquistas corporativas.',
    imgPaths: ['Gold_2.jpg', 'gold.jpg'],
    fallbackBg: 'bg-gradient-to-br from-amber-950/60 via-stone-900 to-zinc-950 text-amber-100',
    chipColor: 'gold',
    badge: 'ENTRADA CORPORATIVA',
    cashback: '1.5%',
    lounge: '4 Acessos anuais à Sala VIP',
    points: '1.8 pontos por dólar',
    limit: 'Até R$ 50.000',
    iof: 'Desconto de 30% na alíquota',
    benefits: [
      '4 acessos anuais gratuitos às salas VIP corporativas nacionais',
      'Programa de Cashback automático creditado mensalmente na fatura',
      'Geração de cartões virtuais temporários com chave de segurança única',
      'Isenção total de anuidade com gastos mensais acima de R$ 3.000',
      'Seguro contra roubo em caixa eletrônico e proteção de preço contratado'
    ]
  }
];

// Respostas simuladas do Assistente de IA
const BOT_KNOWLEDGE = {
  limite: "Os limites da Osborn S.A. são definidos após análise patrimonial. O modelo Gold oferece limite de até R$ 50.000, o Platinum até R$ 200.000, e a linha Black Elite ultrapassa R$ 500.000.",
  anuidade: "Todos os cartões contam com Isenção Progressiva. Atingindo os gastos mensais da categoria (R$ 3k no Gold, R$ 10k no Platinum e R$ 20k no Black Elite), a parcela da anuidade é isenta.",
  vip: "Acesso às salas VIP globais: O cartão Gold oferece 4 acessos/ano, o Platinum inclui 12 acessos/ano, e o Black Elite garante acesso ILIMITADO para o titular e até 4 convidados.",
  solicitar: "Para submeter sua proposta, preencha o formulário em destaque 'Submeta sua proposta privada' ou clique no botão de atendimento via WhatsApp.",
  default: "Olá, sou a Helena, assistente executiva da Osborn S.A. Como posso orientá-lo em relação aos nossos cartões, limites ou serviços corporativos?"
};

export default function App() {
  const [monthlySpend, setMonthlySpend] = useState(15000);
  const [selectedCalcCard, setSelectedCalcCard] = useState('black');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Bem-vindo à Osborn S.A. Sou a Helena, sua consultora executiva virtual. Como posso auxiliar sua gestão financeira hoje?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = BOT_KNOWLEDGE.default;

      if (lower.includes('limite') || lower.includes('crédito') || lower.includes('valor')) {
        reply = BOT_KNOWLEDGE.limite;
      } else if (lower.includes('anuidade') || lower.includes('taxa') || lower.includes('pago')) {
        reply = BOT_KNOWLEDGE.anuidade;
      } else if (lower.includes('vip') || lower.includes('sala') || lower.includes('lounge') || lower.includes('aeroporto')) {
        reply = BOT_KNOWLEDGE.vip;
      } else if (lower.includes('pedir') || lower.includes('solicitar') || lower.includes('abrir')) {
        reply = BOT_KNOWLEDGE.solicitar;
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  // Cálculos do simulador de recompensas
  const multiplier = selectedCalcCard === 'black' ? 4.2 : selectedCalcCard === 'platinum' ? 2.8 : 1.8;
  const cashbackPercent = selectedCalcCard === 'black' ? 0.035 : selectedCalcCard === 'platinum' ? 0.025 : 0.015;
  const yearlyPoints = Math.round((monthlySpend / 5.2) * multiplier * 12);
  const yearlyCashback = Math.round(monthlySpend * cashbackPercent * 12);

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 font-sans selection:bg-slate-300 selection:text-black overflow-x-hidden">
      
      {/* Estilos e Classes Utilitárias Prata / Sóbrias */}
      <style>{`
        .glass-header {
          background: rgba(5, 7, 11, 0.90);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .glass-box-silver {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(203, 213, 225, 0.12);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .metallic-text {
          background: linear-gradient(135deg, #FFFFFF 0%, #94A3B8 50%, #E2E8F0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {}
      {/* CABEÇALHO FIXO NO TOPO (ALWAYS VISIBLE) */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-slate-800/90 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Oficial Osborn S.A. em Azul Ciano */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 group-hover:border-slate-600 transition-colors">
              <OsbornLogo className="w-7 h-7" cyanColor="#00E5FF" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider font-mono text-white">
                OSBORN<span className="text-[#00E5FF]"> S.A.</span>
              </span>
              <span className="text-[9px] tracking-widest text-slate-400 uppercase font-semibold">
                INSTITUIÇÃO FINANCEIRA
              </span>
            </div>
          </a>

          {/* Menu de Navegação Executivo em Prata/Cinza */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase text-slate-300">
            <a href="#hero" className="hover:text-slate-100 transition-colors">Início</a>
            <a href="#cartoes" className="hover:text-slate-100 transition-colors">Cartões Executivos</a>
            <a href="#tecnologia" className="hover:text-slate-100 transition-colors">Segurança</a>
            <a href="#calculadora" className="hover:text-slate-100 transition-colors">Simulador</a>
            <a href="#comparativo" className="hover:text-slate-100 transition-colors">Comparativo</a>
            <a href="#proposta" className="hover:text-[#00E5FF] transition-colors">Proposta</a>
          </nav>

          {/* Botão de Ação em Prata Metálico / Slate */}
          <div className="hidden md:flex items-center">
            <a 
              href="#proposta"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 hover:brightness-110 rounded-lg shadow-md shadow-white/5 transition-all flex items-center gap-2"
            >
              Abra Sua Conta
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </a>
          </div>

          {/* Botão do Menu Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Alternar Menu"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Início</a>
            <a href="#cartoes" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Cartões Executivos</a>
            <a href="#tecnologia" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Segurança</a>
            <a href="#calculadora" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Simulador</a>
            <a href="#comparativo" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Comparativo</a>
            <a href="#proposta" onClick={() => setMobileMenuOpen(false)} className="block text-center py-3 bg-slate-200 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider">
              Submeter Proposta
            </a>
          </div>
        )}
      </header>

      {}
      {/* SEÇÃO HERO */}
      <section id="hero" className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        {/* Luzes de Fundo Sóbrias e Prata */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-slate-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Apresentação Principal */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-slate-300" />
                <span>EXCELÊNCIA FINANCEIRA CORPORATIVA</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Soluções de Crédito de Alta Performance <br />
                <span className="metallic-text font-mono">
                  Para Grandes Líderes.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                A Osborn S.A. oferece um ecossistema exclusivo de crédito, segurança quântica de dados e assessoria privada dedicada para otimizar sua gestão financeira global.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  href="#cartoes"
                  className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-slate-950 bg-slate-200 hover:bg-white shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider"
                >
                  Conhecer os Cartões
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <a 
                  href="#proposta"
                  className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Submeter Proposta
                </a>
              </div>

              {/* Estatísticas Institucionais */}
              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 font-mono">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">R$ 15B+</div>
                  <div className="text-[11px] text-slate-400 mt-1 uppercase font-sans">Ativos Sob Gestão</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-200">100%</div>
                  <div className="text-[11px] text-slate-400 mt-1 uppercase font-sans">Isenção IOF Black</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-300">24/7</div>
                  <div className="text-[11px] text-slate-400 mt-1 uppercase font-sans">Concierge Privado</div>
                </div>
              </div>

            </div>

            {/* Exibição do Cartão Flagship com Efeito 3D Tilt */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <Interactive3DCard 
                id="black" 
                name="Osborn Black Elite" 
                tier="BLACK ELITE" 
                imgPaths={CARDS[0].imgPaths}
                fallbackBg={CARDS[0].fallbackBg}
                chipColor={CARDS[0].chipColor}
              />
            </div>

          </div>
        </div>
      </section>

      {}
      {/* SEÇÃO DOS CARTÕES EXECUTIVOS (3 SEÇÕES INDIVIDUAIS VERTICAIS) */}
      <section id="cartoes" className="py-16 bg-[#030508] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase px-3 py-1 rounded bg-slate-900 border border-slate-800">
              PORTFÓLIO DE CARTÕES EXECUTIVOS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Linha Corporativa Completa
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Passe o cursor sobre os cartões para interagir com o reflexo holográfico em 3D.
            </p>
          </div>

          {/* ITERAÇÃO DOS 3 CARTÕES EM SEÇÕES VERTICAIS EXCLUSIVAS */}
          {CARDS.map((card, index) => (
            <div 
              key={card.id} 
              id={card.id}
              className={`p-8 sm:p-12 rounded-3xl glass-box-silver relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              
              {/* Lado do Cartão Interativo 3D */}
              <div className="lg:col-span-5 flex justify-center">
                <Interactive3DCard 
                  id={card.id}
                  name={card.name}
                  tier={card.tier}
                  imgPaths={card.imgPaths}
                  fallbackBg={card.fallbackBg}
                  chipColor={card.chipColor}
                />
              </div>

              {/* Lado dos Detalhes Técnicos */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase px-3 py-1 rounded bg-slate-900 border border-slate-700">
                      {card.tier}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{card.badge}</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">{card.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.tagline}</p>
                </div>

                {/* Métricas do Cartão */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-800 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">CASHBACK</span>
                    <span className="text-slate-200 font-bold text-base">{card.cashback}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">PONTUAÇÃO</span>
                    <span className="text-white font-bold text-base">{card.points}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">LIMITE</span>
                    <span className="text-slate-200 font-bold text-sm">{card.limit}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">IOF INTL</span>
                    <span className="text-slate-300 font-bold text-xs">{card.iof}</span>
                  </div>
                </div>

                {/* Vantagens Principais */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vantagens Incluídas:</div>
                  <ul className="space-y-2">
                    {card.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Solicitação Direta */}
                <div className="pt-2">
                  <a 
                    href="#proposta"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-slate-200 hover:bg-white transition-all shadow-md"
                  >
                    Solicitar {card.name}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      {}
      {/* SEÇÃO DE SEGURANÇA E TECNOLOGIA BANCÁRIA */}
      <section id="tecnologia" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-slate-400 text-xs font-mono font-bold tracking-widest uppercase">
              INOVAÇÃO BANCÁRIA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Arquitetura de Segurança Quântica
            </h2>
            <p className="text-slate-400 text-sm">
              Sistemas de criptografia de ponta e inteligência preditiva projetados para salvaguardar grandes volumes financeiros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-box-silver p-8 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 mb-6">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tokenização Dinâmica</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Chaves CVC geradas em tempo real com validade temporária. Redução de 100% de risco em transações digitais.
              </p>
            </div>

            <div className="glass-box-silver p-8 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 mb-6">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Prevenção por IA Helena</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Algoritmos inteligentes que identificam padrões atípicos e protegem sua conta antes mesmo da conclusão da compra.
              </p>
            </div>

            <div className="glass-box-silver p-8 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 mb-6">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Acesso Global Irrestrito</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Suporte em mais de 180 países com cotação PTAX comercial direta e desconto na tarifa de IOF.
              </p>
            </div>

          </div>

        </div>
      </section>

      {}
      {/* SIMULADOR DE CASHBACK E PONTOS */}
      <section id="calculadora" className="py-20 bg-[#030508] border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-slate-400 text-xs font-mono font-bold tracking-widest uppercase">
                RETORNO FINANCEIRO
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Simulador de Pontos e Cashback
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Estime o retorno anual gerado pelo volume de movimentação nos cartões executivos da Osborn S.A.
              </p>

              {/* Seletor do Cartão no Simulador */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Selecione a Categoria:</label>
                <div className="grid grid-cols-3 gap-2">
                  {CARDS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCalcCard(c.id)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-all ${
                        selectedCalcCard === c.id
                          ? 'bg-slate-800 border-slate-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caixa da Calculadora */}
            <div className="lg:col-span-7 glass-box-silver p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Gasto Mensal Estimado:</label>
                  <span className="text-2xl font-extrabold text-slate-100 font-mono">
                    R$ {monthlySpend.toLocaleString('pt-BR')}
                  </span>
                </div>
                
                <input 
                  type="range" 
                  min="3000" 
                  max="100000" 
                  step="1000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-200"
                />
                
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>R$ 3.000</span>
                  <span>R$ 50.000</span>
                  <span>R$ 100.000+</span>
                </div>
              </div>

              {/* Resultados Projetados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-800 font-mono">
                
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-slate-300" /> Pontos Anuais Estimados
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {yearlyPoints.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-sans">Sem expiração de pontos.</span>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-300" /> Cashback Anual Projetado
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-200">
                    R$ {yearlyCashback.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block font-sans">Creditado direto na fatura.</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {}
      {/* TABELA COMPARATIVA DE CARTÕES */}
      <section id="comparativo" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Quadro Comparativo Integrado
            </h2>
            <p className="text-slate-400 text-sm">
              Análise transparente de cada modalidade de cartão Osborn S.A.
            </p>
          </div>

          <div className="glass-box-silver rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px] text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 font-mono text-slate-300">
                  <th className="p-5 font-bold">RECURSO / BENEFÍCIO</th>
                  <th className="p-5 font-bold text-slate-400">GOLD PRESTIGE</th>
                  <th className="p-5 font-bold text-slate-300">PLATINUM INFINITY</th>
                  <th className="p-5 font-bold text-slate-100">BLACK ELITE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-5 font-bold text-white">Cashback Direto</td>
                  <td className="p-5">1.5%</td>
                  <td className="p-5">2.5%</td>
                  <td className="p-5 font-bold text-white">3.5%</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Acesso VIP LoungeKey</td>
                  <td className="p-5">4 acessos/ano</td>
                  <td className="p-5">12 acessos/ano</td>
                  <td className="p-5 font-bold text-white">Ilimitado + 4 Convidados</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Pontuação por US$ 1.00</td>
                  <td className="p-5 font-mono">1.8 Pontos</td>
                  <td className="p-5 font-mono">2.8 Pontos</td>
                  <td className="p-5 font-mono font-bold text-white">4.2 Pontos VIP</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Desconto IOF Internacional</td>
                  <td className="p-5">30% Restituído</td>
                  <td className="p-5">70% Restituído</td>
                  <td className="p-5 font-bold text-white">100% Isento</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold text-white">Gasto Mensal p/ Anuidade Zero</td>
                  <td className="p-5 font-mono">R$ 3.000</td>
                  <td className="p-5 font-mono">R$ 10.000</td>
                  <td className="p-5 font-mono font-bold text-white">R$ 20.000</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {}
      {/* SEÇÃO DA PROPOSTA PRIVADA COM O AZUL CIANO DESTACADO (#00E5FF) */}
      <section id="proposta" className="py-20 bg-[#020408] border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Caixa Principal com Borda Ciano e Glow Exclusivo */}
          <div className="rounded-3xl bg-slate-950 border-2 border-[#00E5FF]/40 p-8 sm:p-12 shadow-[0_0_50px_rgba(0,229,255,0.12)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-bold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ABERTURA DE CONTA EXECUTIVA</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                  Submeta sua proposta privada
                </h2>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Preencha seus dados institucionais para que nossa mesa privada de crédito avalie a concessão do seu limite sob medida em até 2 horas úteis.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-[#00E5FF] shrink-0" />
                    <span>atendimento@osbornsa.com.br</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <Phone className="w-4 h-4 text-[#00E5FF] shrink-0" />
                    <span>0800 999 OSBORN (672676)</span>
                  </div>
                </div>
              </div>

              {/* Formulário com Destaques Ciano */}
              <div className="lg:col-span-6 bg-slate-900/90 p-8 rounded-2xl border border-slate-800">
                <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Luis S. Ribeiro"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase mb-2">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="luis@empresa.com.br"
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase mb-2">Cartão de Interesse</label>
                    <select className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#00E5FF] text-xs transition-colors">
                      <option value="black">Osborn Black Elite</option>
                      <option value="platinum">Osborn Platinum Infinity</option>
                      <option value="gold">Osborn Gold Prestige</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-lg font-bold text-slate-950 bg-[#00E5FF] hover:bg-cyan-300 transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#00E5FF]/20"
                  >
                    Submeter Proposta Privada
                  </button>

                  {formSubmitted && (
                    <div className="p-3 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] text-xs text-center font-semibold">
                      Proposta submetida com sucesso. Seu gestor dedicado entrará em contato em breve.
                    </div>
                  )}

                </form>
              </div>

            </div>

          </div>

        </div>
      </section>

      {}
      {/* CHAT VIRTUAL FLUTUANTE DE ATENDIMENTO */}
      <button 
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-20 z-50 p-3.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 shadow-2xl hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Abrir Chat Virtual"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00E5FF] rounded-full animate-ping"></span>
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-6 sm:right-10 z-50 w-[90vw] sm:w-[350px] h-[450px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <OsbornLogo className="w-5 h-5" cyanColor="#00E5FF" />
              <div>
                <div className="text-xs font-bold text-white">Helena | Osborn S.A.</div>
                <div className="text-[10px] text-slate-400 font-mono">Consultora Virtual 24h</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl ${
                  m.sender === 'user' 
                    ? 'bg-slate-200 text-slate-950 font-semibold' 
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChat} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua dúvida sobre limites..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-slate-400"
            />
            <button type="submit" className="p-2 bg-slate-200 text-slate-950 rounded-lg font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20cart%C3%B5es%20Osborn%20S.A."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-emerald-500 text-slate-950 shadow-2xl hover:scale-105 transition-transform"
        aria-label="Contato via WhatsApp"
      >
        <MessageSquare className="w-6 h-6" />
      </a>

      {}
      {/* RODAPÉ INSTITUCIONAL CORPORATIVO */}
      <footer className="bg-black border-t border-slate-900 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-900 pb-6">
            <div className="flex items-center gap-2">
              <OsbornLogo className="w-6 h-6" cyanColor="#00E5FF" />
              <span className="font-mono font-bold text-white text-sm">
                OSBORN<span className="text-[#00E5FF]"> S.A.</span>
              </span>
            </div>
            
            <div className="flex gap-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Termos Corporativos</a>
              <a href="#" className="hover:text-white transition-colors">Política de Criptografia</a>
              <a href="#" className="hover:text-white transition-colors">Banco Central do Brasil</a>
            </div>
          </div>

          <div className="text-center md:text-left leading-relaxed text-[11px] text-slate-600">
            Osborn S.A. Instituição Financeira. CNPJ: 00.000.000/0001-00. Alameda Santos, 1000 - Cerqueira César, São Paulo - SP. Sujeito à análise de crédito.
          </div>

          <div className="text-center text-slate-700 text-[10px] font-mono">
            © {new Date().getFullYear()} Osborn S.A. Todos os direitos reservados.
          </div>

        </div>
      </footer>

    </div>
  );
}