import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Calle+Texcaltitlapa+Col+Cuauhtemoc+Santiago+Tezontlale'

export default function Invitation() {
  const cardRef  = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = 'invitacion-zoe-ximena.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="animate-fadeUp relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4">

      {/* ═══════════════ TARJETA ═══════════════ */}
      <div
        ref={cardRef}
        className="rounded-3xl overflow-hidden"
        style={{
          background: '#fff8f2',
          boxShadow: '0 4px 0 #f4a7be, 0 8px 0 #fde0ea, 0 20px 70px rgba(180,100,130,.2)',
        }}
      >

        {/* ── Header ── */}
        <div
          className="relative px-8 pt-10 pb-16 text-center"
          style={{
            background: 'linear-gradient(160deg, #fde0ea 0%, #f4a7be 55%, #d8b4e2 100%)',
          }}
        >
          {/* Flores esquinas */}
          <FloresSVG className="absolute top-3 left-4 opacity-25 w-12" />
          <FloresSVG className="absolute top-3 right-4 opacity-25 w-12 scale-x-[-1]" />
          <FloresSVG className="absolute bottom-8 left-2 opacity-15 w-8" />
          <FloresSVG className="absolute bottom-8 right-2 opacity-15 w-8 scale-x-[-1]" />

          {/* Línea decorativa superior */}
          <div className="flex items-center gap-2 mb-5 opacity-40">
            <div className="flex-1 h-px bg-white/70" />
            <DiamondSVG color="white" size={8} />
            <div className="flex-1 h-px bg-white/70" />
          </div>

          <p
            className="text-[10px] tracking-[5px] uppercase font-bold mb-4"
            style={{ color: 'rgba(90,53,80,.55)' }}
          >
            Estás invitada · invitado
          </p>

          {/* Cápsula nombre invitado */}
          <div
            className="inline-flex items-center justify-center px-8 py-2.5 rounded-full font-display italic text-lg"
            style={{
              background: 'rgba(255,255,255,.45)',
              border: '1.5px solid rgba(255,255,255,.85)',
              backdropFilter: 'blur(6px)',
              minWidth: '200px',
              color: '#5a3550',
            }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>

          {/* Arco ondulado */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 480 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,0 C80,56 160,56 240,28 C320,0 400,56 480,28 L480,56 L0,56 Z" fill="#fff8f2"/>
            </svg>
          </div>
        </div>

        {/* ── Cuerpo ── */}
        <div className="px-8 pt-8 pb-6 text-center">

          <p className="text-[10px] tracking-[5px] uppercase font-bold text-suave mb-2">
            Celebra con nosotros
          </p>

          {/* Número */}
          <div
            className="font-display font-semibold leading-none animate-pulse-soft"
            style={{
              fontSize: '8rem',
              background: 'linear-gradient(135deg, #f4a7be 0%, #c9a0d8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 6px 14px rgba(200,120,160,.25))',
            }}
          >
            2
          </div>

          <p className="font-script text-2xl -mt-3 mb-1" style={{ color: '#b890cc' }}>
            añitos de
          </p>

          <h1
            className="font-script animate-shimmer"
            style={{ fontSize: '3.6rem', color: '#5a3550', lineHeight: 1.05 }}
          >
            Zoe Ximena
          </h1>

          {/* Ornato central */}
          <div className="flex justify-center my-4">
            <OrnatoSVG />
          </div>

          {/* ── Cards de info ── */}
          <div className="grid grid-cols-2 gap-3 mt-1">

            <InfoCard bg="linear-gradient(135deg,#fde3cf,#fef0e4)" border="#f5d0b5">
              <div className="text-[#e8945a]/60 flex justify-center mb-1.5"><CalendarIcon /></div>
              <InfoLabel>Fecha</InfoLabel>
              <InfoVal>06 · 06 · 2026</InfoVal>
              <InfoSub>Sábado</InfoSub>
            </InfoCard>

            <InfoCard bg="linear-gradient(135deg,#fde0ea,#fce8f2)" border="#f4b8cc">
              <div className="text-rosa-dark/60 flex justify-center mb-1.5"><ClockIcon /></div>
              <InfoLabel>Hora</InfoLabel>
              <InfoVal>4:00 pm</InfoVal>
              <InfoSub>¡No faltes!</InfoSub>
            </InfoCard>

            {/* Ubicación — clickeable → Google Maps */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 rounded-2xl p-4 text-center block transition-all hover:-translate-y-1 hover:shadow-md group"
              style={{
                background: 'linear-gradient(135deg,#eaf0fd,#dce8fb)',
                border: '1.5px solid #c5d8f8',
              }}
            >
              <div className="text-blue-400/70 flex justify-center mb-1.5 transition-transform group-hover:scale-110">
                <PinIcon />
              </div>
              <p className="text-[10px] tracking-[3px] uppercase font-bold text-suave mb-1">Lugar</p>
              <p className="font-display font-semibold text-texto" style={{ fontSize: '1.05rem' }}>
                Santiago Tezontlale
              </p>
              <p className="text-xs text-suave mt-0.5">Col. Cuauhtémoc · Calle Texcaltitlapa</p>
              <p className="text-[10px] text-blue-400 mt-1.5 tracking-wide font-semibold uppercase">
                Ver en mapa →
              </p>
            </a>

          </div>

          {/* Divisor */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4a7be, transparent)' }} />
            <DiamondSVG />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #f4a7be, transparent)' }} />
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          className="px-8 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #fde0ea 0%, #f4a7be 80%)' }}
        >
          <p className="font-script text-[1.6rem] text-texto leading-tight">
            ¡Te esperamos con mucho amor!
          </p>
          <p className="text-[10px] tracking-[3px] text-texto/55 mt-1.5 uppercase font-bold">
            Con cariño · La familia de Zoe Ximena
          </p>
          <div className="flex justify-center mt-3 opacity-35">
            <OrnatoSVG wide />
          </div>
        </div>

      </div>
      {/* ═══════════════ FIN TARJETA ═══════════════ */}

      {/* ── Botones de acción ── */}
      <div className="flex gap-3">

        {/* Descargar */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: downloading
              ? '#e0c4d0'
              : 'linear-gradient(135deg, #f4a7be, #d8b4e2)',
            color: '#5a3550',
            boxShadow: '0 4px 20px rgba(244,167,190,.4)',
          }}
        >
          <DownloadIcon />
          {downloading ? 'Guardando...' : 'Descargar'}
        </button>

        {/* Ver en mapa */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #dce8fb, #c5d8f8)',
            color: '#3a5a8a',
            boxShadow: '0 4px 20px rgba(150,180,240,.3)',
          }}
        >
          <MapIcon />
          Ver ubicación
        </a>

      </div>

    </div>
  )
}

/* ── Sub-componentes ── */

function InfoCard({ bg, border, children }) {
  return (
    <div
      className="rounded-2xl p-4 text-center transition-transform hover:-translate-y-1"
      style={{ background: bg, border: `1.5px solid ${border}` }}
    >
      {children}
    </div>
  )
}

function InfoLabel({ children }) {
  return <p className="text-[10px] tracking-[3px] uppercase font-bold text-suave mb-1">{children}</p>
}

function InfoVal({ children }) {
  return <p className="font-display font-semibold text-texto" style={{ fontSize: '1.05rem' }}>{children}</p>
}

function InfoSub({ children }) {
  return <p className="text-xs text-suave mt-0.5">{children}</p>
}

/* ── SVG Icons ── */

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

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )
}

function DiamondSVG({ color = '#f4a7be', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
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

function OrnatoSVG({ wide }) {
  const w = wide ? 180 : 140
  return (
    <svg width={w} height="18" viewBox={`0 0 ${w} 18`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="9" x2={w/2 - 22} y2="9" stroke="#5a3550" strokeWidth="0.8"/>
      <circle cx={w/2 - 14} cy="9" r="3" fill="#5a3550"/>
      <circle cx={w/2}      cy="9" r="5" fill="#5a3550"/>
      <circle cx={w/2 + 14} cy="9" r="3" fill="#5a3550"/>
      <line x1={w/2 + 22} y1="9" x2={w} y2="9" stroke="#5a3550" strokeWidth="0.8"/>
    </svg>
  )
}
