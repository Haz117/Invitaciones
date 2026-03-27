import { useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'

/* ── Configuración rápida ── */
const MAPS_URL      = 'https://www.google.com/maps?q=20.1559011,-99.1208532&z=17&hl=es'
const WHATSAPP_NUM  = '527736802190'
const PARTY_DATE    = new Date('2026-06-06T16:00:00')
const PHOTO_URL     = null               // ← pon aquí la URL de una foto de Zoe, o déjalo en null

/* ── Cuenta regresiva ── */
function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Invitation() {
  const cardRef      = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const countdown    = useCountdown(PARTY_DATE)

  /* Descargar como imagen */
  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, useCORS: true, backgroundColor: null, logging: false,
      })
      const link = document.createElement('a')
      link.download = 'invitacion-zoe-ximena.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  /* Confirmar asistencia por WhatsApp */
  const handleWhatsApp = () => {
    const msg = encodeURIComponent('¡Hola! Confirmo mi asistencia al cumpleaños de Zoe Ximena el 6 de junio 🎀')
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, '_blank')
  }

  /* Compartir nativo */
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Cumpleaños de Zoe Ximena 🎀',
        text: '¡Estás invitado/a! Zoe Ximena celebra sus 2 añitos el 6 de junio a las 4:00 pm.',
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('¡Link copiado al portapapeles!')
    }
  }

  return (
    <div className="animate-fadeUp relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4">

      {/* ═══════════ TARJETA (se descarga) ═══════════ */}
      <div
        ref={cardRef}
        className="rounded-3xl overflow-hidden"
        style={{
          background: '#fff8f2',
          boxShadow: '0 4px 0 #f4a7be, 0 8px 0 #fde0ea, 0 24px 80px rgba(180,100,130,.22)',
        }}
      >

        {/* ── HEADER ── */}
        <div
          className="relative px-8 pt-8 pb-20 text-center"
          style={{ background: 'linear-gradient(160deg, #fde0ea 0%, #f4a7be 55%, #d8b4e2 100%)' }}
        >
          <FloresSVG className="absolute top-3 left-4 opacity-20 w-14" />
          <FloresSVG className="absolute top-3 right-4 opacity-20 w-14 scale-x-[-1]" />
          <FloresSVG className="absolute bottom-10 left-2 opacity-12 w-9" />
          <FloresSVG className="absolute bottom-10 right-2 opacity-12 w-9 scale-x-[-1]" />

          {/* Línea superior */}
          <div className="flex items-center gap-2 mb-5 opacity-50">
            <div className="flex-1 h-px bg-white/70" />
            <DiamondSVG color="white" size={8} />
            <DiamondSVG color="white" size={5} />
            <DiamondSVG color="white" size={8} />
            <div className="flex-1 h-px bg-white/70" />
          </div>

          <p className="text-[10px] tracking-[5px] uppercase font-bold mb-4" style={{ color: 'rgba(90,53,80,.55)' }}>
            Estás invitada · invitado
          </p>

          {/* Cápsula nombre */}
          <div
            className="inline-flex items-center justify-center px-8 py-2.5 rounded-full font-display italic text-lg mb-5"
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

          {/* Foto de Zoe */}
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: PHOTO_URL ? 'transparent' : 'linear-gradient(135deg,rgba(255,255,255,.6),rgba(255,255,255,.3))',
                border: '3px solid rgba(255,255,255,.9)',
                boxShadow: '0 4px 20px rgba(180,100,130,.3)',
              }}
            >
              {PHOTO_URL
                ? <img src={PHOTO_URL} alt="Zoe Ximena" className="w-full h-full object-cover" />
                : (
                  <div className="text-center">
                    <div style={{ color: 'rgba(90,53,80,.5)' }}>
                      <BabyIcon />
                    </div>
                    <p className="text-[9px] tracking-wide font-bold mt-0.5" style={{ color: 'rgba(90,53,80,.45)' }}>
                      FOTO
                    </p>
                  </div>
                )
              }
            </div>
          </div>

          {/* Arco ondulado */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
            <svg viewBox="0 0 480 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,0 C80,56 160,56 240,28 C320,0 400,56 480,28 L480,56 L0,56 Z" fill="#fff8f2"/>
            </svg>
          </div>
        </div>

        {/* ── CUERPO ── */}
        <div className="px-8 pt-7 pb-5 text-center">

          <p className="text-[10px] tracking-[5px] uppercase font-bold text-suave mb-1">
            Celebra con nosotros
          </p>

          {/* Número grande */}
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

          <div className="flex justify-center my-3">
            <OrnatoSVG />
          </div>

          {/* ── CUENTA REGRESIVA ── */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: 'linear-gradient(135deg,#fef5f0,#fde8f5)', border: '1.5px solid #f5cce0' }}
          >
            <p className="text-[10px] tracking-[3px] uppercase font-bold text-suave mb-3">
              Faltan
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: countdown.days,    label: 'Días'     },
                { val: countdown.hours,   label: 'Horas'    },
                { val: countdown.minutes, label: 'Minutos'  },
                { val: countdown.seconds, label: 'Segundos' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div
                    className="rounded-xl py-2 font-display font-semibold text-2xl leading-none mb-1"
                    style={{
                      background: 'linear-gradient(135deg,#f4a7be,#d8b4e2)',
                      color: '#fff',
                      textShadow: '0 1px 4px rgba(90,53,80,.3)',
                    }}
                  >
                    {String(val).padStart(2, '0')}
                  </div>
                  <p className="text-[9px] tracking-wide uppercase font-bold text-suave">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CARDS INFO ── */}
          <div className="grid grid-cols-2 gap-3">

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

            {/* Ubicación clickeable */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 rounded-2xl p-4 text-center block transition-all hover:-translate-y-1 hover:shadow-md group"
              style={{ background: 'linear-gradient(135deg,#eaf0fd,#dce8fb)', border: '1.5px solid #c5d8f8' }}
            >
              <div className="text-blue-400/70 flex justify-center mb-1.5 transition-transform group-hover:scale-110">
                <PinIcon />
              </div>
              <p className="text-[10px] tracking-[3px] uppercase font-bold text-suave mb-1">Lugar</p>
              <p className="font-display font-semibold text-texto" style={{ fontSize: '1.05rem' }}>
                Santiago Tezontlale, Hgo.
              </p>
              <p className="text-xs text-suave mt-0.5">Av. Texcatlipoca, Col. Cuauhtémoc</p>
              <p className="text-[10px] text-blue-400 mt-1.5 tracking-wide font-semibold uppercase">
                Ver en mapa →
              </p>
            </a>

          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #f4a7be, transparent)' }} />
            <DiamondSVG />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, #f4a7be, transparent)' }} />
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div
          className="px-8 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #fde0ea 0%, #f4a7be 80%)' }}
        >
          <p className="font-script text-[1.7rem] text-texto leading-tight">
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
      {/* ═══════════ FIN TARJETA ═══════════ */}

      {/* ── BOTONES DE ACCIÓN ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Descargar */}
        <ActionBtn
          onClick={handleDownload}
          disabled={downloading}
          gradient="linear-gradient(135deg,#f4a7be,#d8b4e2)"
          shadow="rgba(244,167,190,.45)"
          color="#5a3550"
        >
          <DownloadIcon />
          {downloading ? 'Guardando...' : 'Descargar'}
        </ActionBtn>

        {/* Compartir */}
        <ActionBtn
          onClick={handleShare}
          gradient="linear-gradient(135deg,#d8b4e2,#c9a0d8)"
          shadow="rgba(200,160,220,.4)"
          color="#4a2860"
        >
          <ShareIcon />
          Compartir
        </ActionBtn>

        {/* Confirmar asistencia */}
        <ActionBtn
          onClick={handleWhatsApp}
          gradient="linear-gradient(135deg,#b8e6c8,#8ed4a8)"
          shadow="rgba(100,200,140,.35)"
          color="#1a5c36"
          full
        >
          <WhatsAppIcon />
          Confirmar asistencia
        </ActionBtn>

      </div>

    </div>
  )
}

/* ── Botón de acción reutilizable ── */
function ActionBtn({ onClick, disabled, gradient, shadow, color, full, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${full ? 'col-span-2' : ''} flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60`}
      style={{
        background: disabled ? '#e0c4d0' : gradient,
        color,
        boxShadow: `0 4px 20px ${shadow}`,
      }}
    >
      {children}
    </button>
  )
}

/* ── Info sub-componentes ── */
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
      <rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}
function MapIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )
}
function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
function BabyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
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
        <ellipse key={i}
          cx={40 + 16 * Math.cos((deg * Math.PI) / 180)}
          cy={40 + 16 * Math.sin((deg * Math.PI) / 180)}
          rx="7" ry="11" fill="white" opacity=".7"
          transform={`rotate(${deg} ${40 + 16 * Math.cos((deg * Math.PI) / 180)} ${40 + 16 * Math.sin((deg * Math.PI) / 180)})`}
        />
      ))}
    </svg>
  )
}
function OrnatoSVG({ wide }) {
  const w = wide ? 180 : 140
  return (
    <svg width={w} height="18" viewBox={`0 0 ${w} 18`} fill="none">
      <line x1="0" y1="9" x2={w/2-22} y2="9" stroke="#5a3550" strokeWidth="0.8"/>
      <circle cx={w/2-14} cy="9" r="3" fill="#5a3550"/>
      <circle cx={w/2}    cy="9" r="5" fill="#5a3550"/>
      <circle cx={w/2+14} cy="9" r="3" fill="#5a3550"/>
      <line x1={w/2+22} y1="9" x2={w} y2="9" stroke="#5a3550" strokeWidth="0.8"/>
    </svg>
  )
}
