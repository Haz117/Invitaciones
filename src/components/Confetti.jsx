import { useEffect, useRef } from 'react'

const COLORS = ['#f4a7be', '#fde0ea', '#d8b4e2', '#fde3cf', '#d4ede0', '#e8c47a', '#c5d8f8']

export default function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Petal {
      constructor(init = false) { this.reset(init) }
      reset(init) {
        this.x     = Math.random() * canvas.width
        this.y     = init ? Math.random() * canvas.height : -20
        this.size  = 4 + Math.random() * 6
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
        this.vy    = 0.6 + Math.random() * 1.2
        this.vx    = (Math.random() - .5) * .8
        this.rot   = Math.random() * 360
        this.drot  = (Math.random() - .5) * 1.5
        this.alpha = 0.5 + Math.random() * 0.4
      }
      update() {
        this.y   += this.vy
        this.x   += this.vx
        this.rot += this.drot
        if (this.y > canvas.height + 20) this.reset(false)
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rot * Math.PI / 180)
        ctx.fillStyle = this.color
        /* pétalo de elipse */
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size, this.size * 1.8, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const petals = Array.from({ length: 50 }, () => new Petal(true))
    let raf

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petals.forEach(p => { p.update(); p.draw() })
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
