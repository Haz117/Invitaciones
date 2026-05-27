import { useRef, useState, useEffect, useCallback } from 'react'
import { toPng } from 'html-to-image'

/* ── Configuración ── */
const MAPS_URL     = 'https://www.google.com/maps?q=20.1559011,-99.1208532&z=17&hl=es'
const WHATSAPP_NUM = '527736802190'
const PARTY_DATE   = new Date('2026-06-06T16:00:00')
const PHOTO_URL    = '/zoe.jpeg'

/* ── Melodía "Happy Birthday" ── */
const N = { G4:392, A4:440, B4:494, C5:523, D5:587, E5:659, F5:698, G5:784 }
const MELODY = [
  [N.G4,.28],[N.G4,.10],[N.A4,.38],[N.G4,.38],[N.C5,.38],[N.B4,.75],[null,.28],
  [N.G4,.28],[N.G4,.10],[N.A4,.38],[N.G4,.38],[N.D5,.38],[N.C5,.75],[null,.28],
  [N.G4,.28],[N.G4,.10],[N.G5,.38],[N.E5,.38],[N.C5,.38],[N.B4,.38],[N.A4,.75],[null,.28],
  [N.F5,.28],[N.F5,.10],[N.E5,.38],[N.C5,.38],[N.D5,.38],[N.C5,.80],
]
const MELODY_MS = MELODY.reduce((s,[,d]) => s+d, 0) * 1000

/* ── Sonido tipo piano (armónicos + envelope) ── */
function playPianoNote(ctx, freq, startTime, duration) {
  const harmonics = [1, 2, 3, 4, 6]
  const levels    = [1, 0.45, 0.2, 0.08, 0.03]
  harmonics.forEach((ratio, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq * ratio
    const peak = levels[i] * 0.20
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.006)
    gain.gain.exponentialRampToValueAtTime(peak * 0.35, startTime + 0.09)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(duration * 0.92, 0.05))
    osc.start(startTime)
    osc.stop(startTime + duration + 0.08)
  })
}

/* ── Cuenta regresiva ── */
function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now()
    if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0 }
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
  const cardRef  = useRef(null)
  const musicRef = useRef({ ctx: null, timeout: null, playing: false })

  const [downloading, setDownloading] = useState(false)
  const [isPlaying,   setIsPlaying]   = useState(false)

  const countdown = useCountdown(PARTY_DATE)

  /* ── Loop de música ── */
  const playLoop = useCallback(() => {
    const m = musicRef.current
    if (!m.playing || !m.ctx) return
    const ctx = m.ctx
    let t = ctx.currentTime + 0.05
    MELODY.forEach(([freq, dur]) => {
      if (freq) playPianoNote(ctx, freq, t, dur * 0.88)
      t += dur
    })
    m.timeout = setTimeout(playLoop, MELODY_MS - 300)
  }, [])

  /* ── Autoplay al cargar (se activa en la primera interacción si el browser lo bloquea) ── */
  useEffect(() => {
    const m = musicRef.current
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    m.ctx = ctx
    m.playing = true
    setIsPlaying(true)

    if (ctx.state === 'running') {
      playLoop()
    } else {
      const onInteraction = () => {
        ctx.resume().then(() => { if (m.playing) playLoop() })
      }
      document.addEventListener('click',      onInteraction, { once: true })
      document.addEventListener('touchstart', onInteraction, { once: true })
    }

    return () => {
      m.playing = false
      clearTimeout(m.timeout)
      ctx.close()
    }
  }, [playLoop])

  /* ── Toggle música manual ── */
  const toggleMusic = useCallback(() => {
    const m = musicRef.current
    if (m.playing) {
      m.playing = false
      clearTimeout(m.timeout)
      m.ctx?.suspend()
      setIsPlaying(false)
    } else {
      m.playing = true
      m.ctx?.resume().then(() => playLoop())
      setIsPlaying(true)
    }
  }, [playLoop])

  useEffect(() => () => {
    const m = musicRef.current
    m.playing = false
    clearTimeout(m.timeout)
    m.ctx?.close()
  }, [])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const fileName = 'invitacion-zoe-ximena.png'
      const opts = { pixelRatio:2, backgroundColor:'#fff8f2', skipFonts:true, cacheBust:true }
      await toPng(cardRef.current, opts)
      const dataUrl = await toPng(cardRef.current, opts)
      const [header, data] = dataUrl.split(',')
      const mime  = header.match(/:(.*?);/)[1]
      const bytes = atob(data)
      const arr   = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
      const blob = new Blob([arr], { type: mime })
      const url  = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url; link.download = fileName
      document.body.appendChild(link); link.click(); document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      alert('Error al generar: ' + err.message)
    } finally {
      setDownloading(false)
    }
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('¡Hola! Confirmo mi asistencia al cumpleaños de Zoe Ximena el 6 de junio 🎀')
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title:'Cumpleaños de Zoe Ximena 🎀', text:'¡Estás invitado/a!', url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('¡Link copiado al portapapeles!')
    }
  }

  return (
    <div className="animate-fadeUp relative z-10 w-full max-w-md mx-auto flex flex-col gap-5">

      {/* ═══════════ TARJETA ═══════════ */}
      <div
        ref={cardRef}
        className="rounded-[32px] overflow-hidden"
        style={{ background:'#fff8f2', boxShadow:'0 8px 0 rgba(244,167,190,.3), 0 16px 0 rgba(253,224,234,.25), 0 32px 80px rgba(180,100,130,.2)' }}
      >

        {/* ── HEADER ── */}
        <div
          className="relative px-6 pt-8 pb-20 text-center"
          style={{ background:'linear-gradient(160deg,#fde0ea 0%,#f4a7be 50%,#d8b4e2 100%)' }}
        >
          <FloresSVG className="absolute top-2 left-3 opacity-15 w-10" />
          <FloresSVG className="absolute top-2 right-3 opacity-15 w-10 scale-x-[-1]" />

          <div className="animate-fade-slide flex items-center gap-2 mb-3 opacity-45" style={{ animationDelay:'0s' }}>
            <div className="flex-1 h-px bg-white/65" />
            <DiamondSVG color="white" size={7} /><DiamondSVG color="white" size={5} /><DiamondSVG color="white" size={7} />
            <div className="flex-1 h-px bg-white/65" />
          </div>

          <p className="animate-fade-slide text-[9px] tracking-[4.5px] uppercase font-bold mb-3" style={{ color:'rgba(90,53,80,.6)', animationDelay:'.08s', letterSpacing:'0.05em' }}>
            Tienes una invitación especial
          </p>

          {/* Badge 2 Años */}
          <div className="animate-fade-slide flex justify-center mb-4" style={{ animationDelay:'.14s' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:5,
              background:'rgba(255,255,255,.68)', backdropFilter:'blur(12px)',
              border:'1.5px solid rgba(255,255,255,.88)', borderRadius:20, padding:'5px 14px',
            }}>
              <span style={{ fontSize:11 }}>🎂</span>
              <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'0.85rem', color:'#5a3550', fontWeight:600, letterSpacing:0.5 }}>
                2 Años
              </span>
              <span style={{ fontSize:11 }}>🎂</span>
            </div>
          </div>

          {/* Foto con marco SVG elegante */}
          <div className="animate-fade-slide flex justify-center" style={{ animationDelay:'.22s' }}>
            <div style={{ position:'relative', width:152, height:152 }}>

              {/* Anillo giratorio SVG ornamental */}
              <div style={{ position:'absolute', inset:-20, animation:'spin 18s linear infinite', pointerEvents:'none' }}>
                <OrnamentRing />
              </div>

              {/* Halo de brillo estático */}
              <div style={{
                position:'absolute', inset:-5, borderRadius:'50%',
                background:'conic-gradient(from 0deg, #f4a7be, #d8b4e2, #fde3cf, #f9c9d8, #f4a7be)',
                opacity:.5,
              }} />

              {/* Foto */}
              <div style={{
                position:'relative', width:152, height:152, borderRadius:'50%', overflow:'hidden',
                border:'4px solid rgba(255,255,255,.98)',
                boxShadow:'0 8px 28px rgba(180,100,130,.38)',
              }}>
                <img
                  src={PHOTO_URL} alt="Zoe Ximena" crossOrigin="anonymous"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}
                />
              </div>
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
        <div className="px-7 pt-7 pb-5 text-center">

          <p className="animate-fade-slide text-[9px] tracking-[4px] uppercase font-bold text-suave mb-1.5" style={{ animationDelay:'.38s', letterSpacing:'0.04em' }}>
            Celebra con nosotros
          </p>

          <div
            className="animate-fade-slide font-display font-semibold leading-none animate-pulse-soft"
            style={{ fontSize:'7rem', background:'linear-gradient(135deg,#f4a7be 0%,#c9a0d8 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 5px 12px rgba(200,120,160,.26))', animationDelay:'.44s' }}
          >2</div>

          <p className="animate-fade-slide font-script text-2xl -mt-2.5 mb-1" style={{ color:'#b890cc', animationDelay:'.50s', letterSpacing:'0.02em' }}>añitos de</p>

          <h1 className="animate-fade-slide font-script animate-shimmer" style={{ fontSize:'3.2rem', color:'#5a3550', lineHeight:1.05, animationDelay:'.56s', letterSpacing:'-0.01em' }}>
            Zoe Ximena
          </h1>

          <div className="animate-fade-slide flex justify-center my-2.5" style={{ animationDelay:'.60s' }}><OrnatoSVG /></div>

          {/* Cuenta regresiva */}
          <div className="animate-fade-slide rounded-[24px] p-4 mb-4" style={{ background:'linear-gradient(135deg,#fef5f0,#fde8f5)', border:'1.5px solid #f5cce0', animationDelay:'.58s' }}>
            <p className="text-[9px] tracking-[3px] uppercase font-bold text-suave mb-3" style={{ letterSpacing:'0.03em' }}>Faltan</p>
            <div className="grid grid-cols-4 gap-2">
              {[{val:countdown.days,label:'Días'},{val:countdown.hours,label:'Horas'},{val:countdown.minutes,label:'Minutos'},{val:countdown.seconds,label:'Segundos'}].map(({val,label})=>(
                <div key={label}>
                  <div className="rounded-[12px] py-2.5 font-display font-semibold text-xl leading-none mb-1" style={{ background:'linear-gradient(135deg,#f4a7be,#d8b4e2)', color:'#fff', textShadow:'0 2px 4px rgba(90,53,80,.25)' }}>
                    {String(val).padStart(2,'0')}
                  </div>
                  <p className="text-[8px] tracking-wide uppercase font-bold text-suave" style={{ letterSpacing:'0.02em' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cards info */}
          <div className="animate-fade-slide grid grid-cols-2 gap-3" style={{ animationDelay:'.66s' }}>
            <InfoCard bg="linear-gradient(135deg,#fde3cf,#fef0e4)" border="#f5d0b5">
              <div className="text-[#e8945a]/60 flex justify-center mb-1"><CalendarIcon /></div>
              <InfoLabel>Fecha</InfoLabel><InfoVal>06 · 06 · 2026</InfoVal><InfoSub>Sábado</InfoSub>
            </InfoCard>
            <InfoCard bg="linear-gradient(135deg,#fde0ea,#fce8f2)" border="#f4b8cc">
              <div className="text-rosa-dark/60 flex justify-center mb-1"><ClockIcon /></div>
              <InfoLabel>Hora</InfoLabel><InfoVal>4:00 pm</InfoVal><InfoSub>¡No faltes!</InfoSub>
            </InfoCard>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="col-span-2 rounded-xl p-3 text-center block transition-all hover:-translate-y-1 hover:shadow-md group"
              style={{ background:'linear-gradient(135deg,#eaf0fd,#dce8fb)', border:'1.5px solid #c5d8f8' }}>
              <div className="text-blue-400/70 flex justify-center mb-1 transition-transform group-hover:scale-110"><PinIcon /></div>
              <p className="text-[8px] tracking-[2px] uppercase font-bold text-suave mb-0.5">Lugar</p>
              <p className="font-display font-semibold text-texto text-sm">Santiago Tezontlale, Hgo.</p>
              <p className="text-[11px] text-suave mt-0.5">Av. Texcatlipoca, Col. Cuauhtémoc</p>
              <p className="text-[8px] text-blue-400 mt-1 tracking-wide font-semibold uppercase">Ver en mapa →</p>
            </a>
          </div>

          <div className="animate-fade-slide flex items-center gap-3 mt-4" style={{ animationDelay:'.72s' }}>
            <div className="flex-1 h-px" style={{ background:'linear-gradient(to right,transparent,#f4a7be,transparent)' }} />
            <DiamondSVG />
            <div className="flex-1 h-px" style={{ background:'linear-gradient(to right,#f4a7be,transparent)' }} />
          </div>
        </div>

        {/* Footer */}
        <div className="animate-fade-slide px-7 py-5 text-center" style={{ background:'linear-gradient(135deg,#fde0ea 0%,#f4a7be 80%)', animationDelay:'.78s' }}>
          <p className="font-script text-lg text-texto leading-tight">¡Te esperamos con mucho amor!</p>
          <p className="text-[9px] tracking-[3px] text-texto/60 mt-2 uppercase font-bold" style={{ letterSpacing:'0.03em' }}>Con cariño · La familia de Zoe Ximena</p>
          <div className="flex justify-center mt-3 opacity-35"><OrnatoSVG wide /></div>
        </div>
      </div>

      {/* ── BOTONES ── */}
      <div className="animate-fade-slide grid grid-cols-2 gap-3" style={{ animationDelay:'.84s' }}>
        <ActionBtn onClick={handleDownload} disabled={downloading} gradient="linear-gradient(135deg,#f4a7be,#d8b4e2)" shadow="rgba(244,167,190,.5)" color="#5a3550">
          <DownloadIcon />{downloading ? 'Guardando...' : 'Descargar'}
        </ActionBtn>
        <ActionBtn onClick={handleShare} gradient="linear-gradient(135deg,#d8b4e2,#c9a0d8)" shadow="rgba(200,160,220,.45)" color="#fff">
          <ShareIcon />Compartir
        </ActionBtn>
        <ActionBtn onClick={handleWhatsApp} gradient="linear-gradient(135deg,#b8e6c8,#8ed4a8)" shadow="rgba(100,200,140,.4)" color="#fff" full>
          <WhatsAppIcon />Confirmar asistencia
        </ActionBtn>
        <ActionBtn onClick={toggleMusic} gradient={isPlaying ? 'linear-gradient(135deg,#fde0ea,#f4a7be)' : 'linear-gradient(135deg,#fef0e4,#fde3cf)'} shadow="rgba(244,167,190,.35)" color="#5a3550" full>
          <MusicIcon playing={isPlaying} />{isPlaying ? 'Pausar música 🎵' : 'Reproducir música 🎵'}
        </ActionBtn>
      </div>
    </div>
  )
}

/* ── Marco ornamental SVG giratorio ── */
function OrnamentRing() {
  const size = 208
  const cx   = size / 2
  const r    = 95

  const elements = Array.from({ length: 12 }, (_, i) => {
    const deg = (i / 12) * 360
    const rad = (deg - 90) * Math.PI / 180
    const x   = cx + r * Math.cos(rad)
    const y   = cx + r * Math.sin(rad)
    const isMain = i % 3 === 0

    if (isMain) {
      // Flor pequeña de 5 pétalos
      const petalR = 7
      return (
        <g key={i}>
          {[0,72,144,216,288].map((pd, j) => {
            const pr = (pd - 90) * Math.PI / 180
            return (
              <ellipse key={j}
                cx={x + petalR * Math.cos(pr)}
                cy={y + petalR * Math.sin(pr)}
                rx="2.8" ry="4.5"
                fill="rgba(255,255,255,.88)"
                transform={`rotate(${pd} ${x + petalR * Math.cos(pr)} ${y + petalR * Math.sin(pr)})`}
              />
            )
          })}
          <circle cx={x} cy={y} r="3.5" fill="rgba(253,227,207,.95)" />
        </g>
      )
    }

    if (i % 3 === 1) {
      // Diamante
      return (
        <polygon key={i}
          points={`${x},${y-6.5} ${x+4.5},${y} ${x},${y+6.5} ${x-4.5},${y}`}
          fill="rgba(255,255,255,.80)"
        />
      )
    }

    // Punto pequeño
    return <circle key={i} cx={x} cy={y} r="2.5" fill="rgba(255,200,220,.75)" />
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Aro exterior punteado */}
      <circle cx={cx} cy={cx} r={r+6} stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeDasharray="2 9"/>
      {/* Aro interior sutil */}
      <circle cx={cx} cy={cx} r={r-8} stroke="rgba(255,255,255,.25)" strokeWidth="0.8"/>
      {elements}
    </svg>
  )
}

/* ── Componentes UI ── */
function ActionBtn({ onClick, disabled, gradient, shadow, color, full, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${full?'col-span-2':''} flex items-center justify-center gap-2.5 py-4 rounded-[18px] font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60 hover:shadow-lg`}
      style={{ background:disabled?'#e0c4d0':gradient, color, boxShadow:`0 6px 24px ${shadow}`, letterSpacing:'0.02em' }}>
      {children}
    </button>
  )
}
function InfoCard({ bg, border, children }) {
  return (
    <div className="rounded-[20px] p-4 text-center transition-transform hover:-translate-y-1.5" style={{ background:bg, border:`1.5px solid ${border}` }}>
      {children}
    </div>
  )
}
function InfoLabel({ children }) { return <p className="text-[9px] tracking-[3px] uppercase font-bold text-suave mb-1" style={{ letterSpacing:'0.03em' }}>{children}</p> }
function InfoVal({ children })   { return <p className="font-display font-semibold text-texto text-base">{children}</p> }
function InfoSub({ children })   { return <p className="text-[11px] text-suave mt-1">{children}</p> }

/* ── Iconos ── */
function CalendarIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function ClockIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
}
function PinIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
}
function DownloadIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
}
function ShareIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
}
function WhatsAppIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
function MusicIcon({ playing }) {
  return playing
    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
}
function DiamondSVG({ color='#f4a7be', size=12 }) {
  return <svg width={size} height={size} viewBox="0 0 12 12" fill={color}><polygon points="6,0 12,6 6,12 0,6"/></svg>
}
function FloresSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="8" fill="white" opacity=".9"/>
      {[0,60,120,180,240,300].map((deg,i)=>(
        <ellipse key={i} cx={40+16*Math.cos((deg*Math.PI)/180)} cy={40+16*Math.sin((deg*Math.PI)/180)}
          rx="7" ry="11" fill="white" opacity=".7"
          transform={`rotate(${deg} ${40+16*Math.cos((deg*Math.PI)/180)} ${40+16*Math.sin((deg*Math.PI)/180)})`}/>
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
      <circle cx={w/2} cy="9" r="5" fill="#5a3550"/>
      <circle cx={w/2+14} cy="9" r="3" fill="#5a3550"/>
      <line x1={w/2+22} y1="9" x2={w} y2="9" stroke="#5a3550" strokeWidth="0.8"/>
    </svg>
  )
}
