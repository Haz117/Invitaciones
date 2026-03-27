export default function Invitation() {
  return (
    <div className="animate-fadeUp relative z-10 w-full max-w-sm mx-auto">

      {/* Tarjeta */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: '#fff8f2',
          boxShadow: '0 4px 0 #f4a7be, 0 8px 0 #fde0ea, 0 16px 60px rgba(180,100,130,.18)',
        }}
      >

        {/* ── Header ── */}
        <div
          className="relative px-8 pt-10 pb-14 text-center"
          style={{
            background: 'linear-gradient(160deg, #fde0ea 0%, #f4a7be 55%, #d8b4e2 100%)',
          }}
        >
          {/* Flores SVG decorativas */}
          <FloresSVG className="absolute top-4 left-5 opacity-30 w-10" />
          <FloresSVG className="absolute top-4 right-5 opacity-30 w-10 scale-x-[-1]" />

          <p
            className="text-xs tracking-[4px] uppercase font-bold mb-3"
            style={{ color: 'rgba(90,53,80,.6)' }}
          >
            Estás invitada · invitado
          </p>

          {/* Nombre del invitado — placeholder */}
          <div
            className="inline-block px-7 py-2 rounded-full text-texto font-display italic text-lg"
            style={{
              background: 'rgba(255,255,255,.5)',
              border: '1.5px solid rgba(255,255,255,.8)',
              backdropFilter: 'blur(4px)',
              minWidth: '180px',
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>

          {/* Arco inferior */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 480 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,0 C120,48 360,48 480,0 L480,48 L0,48 Z" fill="#fff8f2" />
            </svg>
          </div>
        </div>

        {/* ── Cuerpo ── */}
        <div className="px-8 pt-10 pb-6 text-center">

          <p className="text-xs tracking-[4px] uppercase font-bold text-suave mb-1">
            Celebra con nosotros
          </p>

          {/* Número grande */}
          <div
            className="font-display font-semibold leading-none animate-pulse-soft"
            style={{
              fontSize: '7rem',
              background: 'linear-gradient(135deg, #f4a7be 0%, #d8b4e2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 10px rgba(200,120,160,.2))',
            }}
          >
            2
          </div>

          <p
            className="font-script text-2xl -mt-2 mb-1"
            style={{ color: '#b890cc' }}
          >
            añitos de
          </p>

          <h1
            className="font-script animate-shimmer mb-6"
            style={{ fontSize: '3.4rem', color: '#5a3550', lineHeight: 1 }}
          >
            Zoe Ximena
          </h1>

          {/* Divisor ornamental */}
          <Divisor />

          {/* Info */}
          <div className="grid grid-cols-2 gap-3 mt-5">

            <InfoCard bg="linear-gradient(135deg,#fde3cf,#fef0e4)" border="#f5d0b5">
              <InfoIcon><CalendarIcon /></InfoIcon>
              <InfoLabel>Fecha</InfoLabel>
              <InfoVal>06 · 06 · 2026</InfoVal>
              <InfoSub>Sábado</InfoSub>
            </InfoCard>

            <InfoCard bg="linear-gradient(135deg,#fde0ea,#fce8f2)" border="#f4b8cc">
              <InfoIcon><ClockIcon /></InfoIcon>
              <InfoLabel>Hora</InfoLabel>
              <InfoVal>4:00 pm</InfoVal>
              <InfoSub>¡No faltes!</InfoSub>
            </InfoCard>

            <InfoCard
              bg="linear-gradient(135deg,#eaf0fd,#dce8fb)"
              border="#c5d8f8"
              full
            >
              <InfoIcon><PinIcon /></InfoIcon>
              <InfoLabel>Lugar</InfoLabel>
              <InfoVal>Santiago Tezontlale</InfoVal>
              <InfoSub>Col. Cuauhtémoc · Calle Texcaltitlapa</InfoSub>
            </InfoCard>

          </div>

          {/* Divisor inferior */}
          <Divisor className="mt-5" />

        </div>

        {/* ── Footer ── */}
        <div
          className="px-8 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #fde0ea, #f4a7be 80%)' }}
        >
          <p className="font-script text-2xl text-texto">
            ¡Te esperamos con mucho amor!
          </p>
          <p className="text-xs tracking-widest text-texto/60 mt-1 uppercase font-semibold">
            Con cariño · La familia de Zoe Ximena
          </p>

          {/* Ornamento floral inferior */}
          <div className="flex justify-center mt-3 opacity-40">
            <OrnatoSVG />
          </div>
        </div>

      </div>
    </div>
  )
}

/* ── Sub-componentes ── */

function Divisor({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4a7be, transparent)' }} />
      <DiamondSVG />
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #f4a7be, transparent)' }} />
    </div>
  )
}

function InfoCard({ bg, border, full, children }) {
  return (
    <div
      className={`rounded-2xl p-4 text-center transition-transform hover:-translate-y-1 ${full ? 'col-span-2' : ''}`}
      style={{ background: bg, border: `1.5px solid ${border}` }}
    >
      {children}
    </div>
  )
}

function InfoIcon({ children }) {
  return <div className="flex justify-center mb-1 text-texto/50">{children}</div>
}

function InfoLabel({ children }) {
  return (
    <p className="text-[10px] tracking-[3px] uppercase font-bold text-suave mb-1">
      {children}
    </p>
  )
}

function InfoVal({ children }) {
  return (
    <p className="font-display font-semibold text-texto" style={{ fontSize: '1.05rem' }}>
      {children}
    </p>
  )
}

function InfoSub({ children }) {
  return <p className="text-xs text-suave mt-0.5">{children}</p>
}

/* ── SVG Icons (sin emojis) ── */

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )
}

function DiamondSVG() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#f4a7be">
      <polygon points="6,0 12,6 6,12 0,6"/>
    </svg>
  )
}

function FloresSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="8" fill="white" opacity=".9"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <ellipse
          key={i}
          cx={40 + 16 * Math.cos((deg * Math.PI) / 180)}
          cy={40 + 16 * Math.sin((deg * Math.PI) / 180)}
          rx="7" ry="11"
          fill="white"
          opacity=".7"
          transform={`rotate(${deg} ${40 + 16 * Math.cos((deg * Math.PI) / 180)} ${40 + 16 * Math.sin((deg * Math.PI) / 180)})`}
        />
      ))}
    </svg>
  )
}

function OrnatoSVG() {
  return (
    <svg width="140" height="18" viewBox="0 0 140 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0"   y1="9" x2="55"  y2="9" stroke="#5a3550" strokeWidth="0.8"/>
      <circle cx="62" cy="9" r="3" fill="#5a3550"/>
      <circle cx="70" cy="9" r="5" fill="#5a3550"/>
      <circle cx="78" cy="9" r="3" fill="#5a3550"/>
      <line x1="85"  y1="9" x2="140" y2="9" stroke="#5a3550" strokeWidth="0.8"/>
    </svg>
  )
}
