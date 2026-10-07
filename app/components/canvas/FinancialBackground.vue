<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
let time = 0

const props = defineProps<{
  scrollYPos: number
}>()

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let W = (canvas.width = window.innerWidth)
  let H = (canvas.height = window.innerHeight)

  const mouse = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2 }

  const onMove = (e: MouseEvent) => {
    mouse.tx = e.clientX
    mouse.ty = e.clientY
  }
  window.addEventListener('mousemove', onMove)

  const onResize = () => {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
    buildNodes()
  }
  window.addEventListener('resize', onResize)

  interface Node {
    x: number
    y: number 
    px: number
    py: number
    phase: number
    size: number
    alpha: number
    active: boolean 
  }

  let nodes: Node[] = []

  const buildNodes = () => {
    nodes = []
    const cols = Math.round(W / 90)
    const rows = Math.round(H / 70)
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        nodes.push({
          x: (c / cols) * W,
          y: (r / rows) * H,
          px: (c / cols) * W,
          py: (r / rows) * H,
          phase: Math.random() * Math.PI * 2,
          size: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.18 + 0.04,
          active: Math.random() > 0.82
        })
      }
    }
  }

  buildNodes()

 interface MeshPoint {
    x: number
    y: number
    vx: number
    vy: number
    color: [number, number, number]
    radius: number
    phase: number
    phaseSpeed: number
  }

  const mesh: MeshPoint[] = [
    {
      x: W * 0.15,
      y: H * 0.2,
      vx: 0.08,
      vy: 0.06,
      color: [6, 78, 59],
      radius: W * 0.55,
      phase: 0,
      phaseSpeed: 0.004
    },
    {
      x: W * 0.8,
      y: H * 0.25,
      vx: -0.07,
      vy: 0.09,
      color: [4, 60, 52],
      radius: W * 0.5,
      phase: 1.2,
      phaseSpeed: 0.005
    },
    {
      x: W * 0.5,
      y: H * 0.75,
      vx: 0.05,
      vy: -0.08,
      color: [10, 68, 45],
      radius: W * 0.48,
      phase: 2.5,
      phaseSpeed: 0.006
    },
    {
      x: W * 0.2,
      y: H * 0.8,
      vx: 0.09,
      vy: -0.05,
      color: [5, 46, 38],
      radius: W * 0.42,
      phase: 3.8,
      phaseSpeed: 0.0045
    }
  ]

  interface FlowLine {
    y: number 
    speed: number 
    phase: number
    alpha: number 
    width: number 
  }

  const flowLines: FlowLine[] = []
  const LINE_COUNT = 10

  for (let i = 0; i < LINE_COUNT; i++) {
    flowLines.push({
      y: (H / (LINE_COUNT + 1)) * (i + 1),
      speed: 0.006 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.06 + Math.random() * 0.06,
      width: Math.random() > 0.7 ? 0.8 : 0.4
    })
  }

  interface Pulse {
    x: number
    y: number
    r: number
    maxR: number
    alpha: number
    speed: number
  }

  let pulses: Pulse[] = []
  let lastPulseTime = 0

  const spawnPulse = () => {
    const activeNodes = nodes.filter((n) => n.active)
    if (!activeNodes.length) return
    const n = activeNodes[Math.floor(Math.random() * activeNodes.length)]
    if (!n) return
    pulses.push({
      x: n.px,
      y: n.py,
      r: 0,
      maxR: 60 + Math.random() * 40,
      alpha: 0.35,
      speed: 0.6 + Math.random() * 0.4
    })
  }

  const render = (ts: number) => {
    time += 0.01
    ctx.clearRect(0, 0, W, H)

    const scroll = Math.min(props.scrollYPos / H, 1)
    const fade = Math.max(0, 1 - scroll * 1.9)

    if (props.scrollYPos > H * 1.5) {
      animationFrameId = requestAnimationFrame(render)
      return
    }


    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05


    ctx.fillStyle = '#080D14'
    ctx.fillRect(0, 0, W, H)

   
    ctx.save()
    ctx.globalCompositeOperation = 'screen'

    mesh.forEach((mp) => {
      mp.phase += mp.phaseSpeed
      const wobX = Math.sin(mp.phase * 1.3) * W * 0.03
      const wobY = Math.cos(mp.phase * 0.9) * H * 0.03
      mp.x += mp.vx
      mp.y += mp.vy
      if (mp.x < -mp.radius * 0.2) mp.vx = Math.abs(mp.vx)
      if (mp.x > W + mp.radius * 0.2) mp.vx = -Math.abs(mp.vx)
      if (mp.y < -mp.radius * 0.2) mp.vy = Math.abs(mp.vy)
      if (mp.y > H + mp.radius * 0.2) mp.vy = -Math.abs(mp.vy)

      const bx = mp.x + wobX + (mouse.x - W / 2) * 0.012
      const by = mp.y + wobY + (mouse.y - H / 2) * 0.012 - scroll * H * 0.1

      const r = mp.radius * (0.92 + Math.sin(mp.phase) * 0.06)
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, r)
      const [cr, cg, cb] = mp.color
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${0.9 * fade})`)
      g.addColorStop(0.45, `rgba(${cr},${cg},${cb},${0.35 * fade})`)
      g.addColorStop(0.8, `rgba(${cr},${cg},${cb},${0.08 * fade})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)

      ctx.beginPath()
      ctx.arc(bx, by, r, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    })

    ctx.restore()

    flowLines.forEach((line) => {
      line.phase += line.speed
      const y = line.y - scroll * H * 0.08

      const brightness = 0.5 + Math.sin(line.phase) * 0.5
      const a = line.alpha * brightness * fade

      const grad = ctx.createLinearGradient(0, y, W, y)
      grad.addColorStop(0, `rgba(52,211,153,0)`)
      grad.addColorStop(0.15, `rgba(52,211,153,${a * 0.4})`)
      grad.addColorStop(0.35 + Math.sin(line.phase * 0.7) * 0.1, `rgba(52,211,153,${a})`)
      grad.addColorStop(0.65 + Math.sin(line.phase * 0.5) * 0.1, `rgba(20,184,166,${a * 0.7})`)
      grad.addColorStop(0.85, `rgba(52,211,153,${a * 0.3})`)
      grad.addColorStop(1, `rgba(52,211,153,0)`)

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.strokeStyle = grad
      ctx.lineWidth = line.width
      ctx.stroke()
    })

    nodes.forEach((nd) => {
      nd.phase += 0.008
      nd.px = nd.x + Math.sin(nd.phase) * 1.8
      nd.py = nd.y + Math.cos(nd.phase * 0.7) * 1.4 - scroll * H * 0.04

      const dist = Math.hypot(mouse.x - nd.px, mouse.y - nd.py)
      const proximity = Math.max(0, 1 - dist / 140)

      const baseAlpha = nd.active
        ? (nd.alpha * 3.5 + Math.sin(nd.phase * 2) * 0.08) * fade
        : nd.alpha * fade

      const finalAlpha = baseAlpha + proximity * 0.4 * fade

      if (nd.active && fade > 0.1) {
        const halo = ctx.createRadialGradient(nd.px, nd.py, 0, nd.px, nd.py, 8)
       
        halo.addColorStop(0, `rgba(52,211,153,${0.25 * fade})`)
        halo.addColorStop(1, `rgba(52,211,153,0)`)

        ctx.beginPath()
        ctx.arc(nd.px, nd.py, 8, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(nd.px, nd.py, nd.active ? nd.size * 1.6 : nd.size, 0, Math.PI * 2)
      ctx.fillStyle = nd.active
        ? `rgba(52,211,153,${finalAlpha})`
        : `rgba(20,184,166,${finalAlpha})`
      ctx.fill()
    })

    if (ts - lastPulseTime > 1800) {
      spawnPulse()
      lastPulseTime = ts
    }

    pulses = pulses.filter((p) => p.alpha > 0.005)
    pulses.forEach((p) => {
      p.r += p.speed
      p.alpha *= 0.97
      if (p.r >= p.maxR) {
        p.alpha = 0
        return
      }
      const prog = p.r / p.maxR
      ctx.beginPath()
      ctx.arc(p.x, p.y - scroll * H * 0.04, p.r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(52,211,153,${p.alpha * (1 - prog) * fade})`
      ctx.lineWidth = 0.7
      ctx.stroke()
    })

    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9)
    vig.addColorStop(0, 'rgba(8,13,20,0)')
    vig.addColorStop(0.65, 'rgba(8,13,20,0.15)')
    vig.addColorStop(1, `rgba(8,13,20,${0.7 * fade + (1 - fade)})`)

    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)
const btm = ctx.createLinearGradient(0, H * 0.65, 0, H)

    btm.addColorStop(0, 'rgba(8,13,20,0)')
    btm.addColorStop(1, 'rgba(8,13,20,1)')
    ctx.fillStyle = btm
    ctx.fillRect(0, H * 0.65, W, H * 0.35)

    animationFrameId = requestAnimationFrame(render)
  }

  animationFrameId = requestAnimationFrame(render)

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', onResize)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="canvas-bg" />
</template>

<style scoped>
.canvas-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
}
</style>
