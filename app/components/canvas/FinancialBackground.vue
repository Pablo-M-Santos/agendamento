<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
let time = 0

const props = defineProps<{
  scrollYPos?: number
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
    initParticles()
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

  interface Spark {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    alpha: number
    maxAlpha: number
  }

  let sparks: Spark[] = []

  const initParticles = () => {
    sparks = []
    const count = Math.floor((W * H) / 18000)
    for (let i = 0; i < count; i++) {
      sparks.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5,
        maxAlpha: Math.random() * 0.6 + 0.2
      })
    }
  }

  initParticles()

  interface Ripple {
    x: number
    y: number
    radius: number
    maxRadius: number
    alpha: number
  }

  let ripples: Ripple[] = []

  const triggerRipple = (x: number, y: number) => {
    if (ripples.length > 5) return
    ripples.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.random() * 120 + 80,
      alpha: 0.4
    })
  }

  setInterval(() => {
    if (nodes.length > 0) {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
      if (randomNode) {
        triggerRipple(randomNode.x, randomNode.y)
      }
    }
  }, 2500)

  const render = () => {
    time += 0.016
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05

    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#080D14'
    ctx.fillRect(0, 0, W, H)

    mesh.forEach((m) => {
      m.phase += m.phaseSpeed
      m.x += m.vx + Math.cos(m.phase) * 0.3
      m.y += m.vy + Math.sin(m.phase) * 0.3

      if (m.x < -m.radius) m.x = W + m.radius
      if (m.x > W + m.radius) m.x = -m.radius
      if (m.y < -m.radius) m.y = H + m.radius
      if (m.y > H + m.radius) m.y = -m.radius

      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.radius)
      const [r, g, b] = m.color
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`)
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.12)`)
      grad.addColorStop(1, 'rgba(6, 78, 59, 0)')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.03)'
    ctx.lineWidth = 1
    const gridSpacing = 80
    ctx.beginPath()
    for (let x = 0; x <= W; x += gridSpacing) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
    }
    for (let y = 0; y <= H; y += gridSpacing) {
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
    }
    ctx.stroke()

    nodes.forEach((n) => {
      n.phase += 0.03
      const floatX = Math.sin(n.phase) * 3
      const floatY = Math.cos(n.phase) * 3
      n.x = n.px + floatX
      n.y = n.py + floatY

      const dx = mouse.x - n.x
      const dy = mouse.y - n.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const force = (120 - dist) / 120
        n.x -= (dx / dist) * force * 15
        n.y -= (dy / dist) * force * 15
      }

      ctx.fillStyle = n.active ? `rgba(52, 211, 153, ${n.alpha * 1.8})` : `rgba(255, 255, 255, ${n.alpha})`
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.active ? n.size * 1.5 : n.size, 0, Math.PI * 2)
      ctx.fill()
    })

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i]
        const n2 = nodes[j]
        if (!n1 || !n2) continue
        const dx = n1.x - n2.x
        const dy = n1.y - n2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12
          ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(n1.x, n1.y)
          ctx.lineTo(n2.x, n2.y)
          ctx.stroke()
        }
      }
    }

    ripples.forEach((rp, idx) => {
      rp.radius += 1.5
      rp.alpha *= 0.97
      if (rp.alpha < 0.01) {
        ripples.splice(idx, 1)
        return
      }
      ctx.strokeStyle = `rgba(52, 211, 153, ${rp.alpha})`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2)
      ctx.stroke()
    })

    sparks.forEach((s) => {
      s.x += s.vx
      s.y += s.vy

      const mdx = mouse.x - s.x
      const mdy = mouse.y - s.y
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mdist < 100) {
        s.x -= (mdx / mdist) * 0.8
        s.y -= (mdy / mdist) * 0.8
      }

      if (s.y < 0) {
        s.y = H + 10
        s.x = Math.random() * W
      }
      if (s.x < 0) s.x = W
      if (s.x > W) s.x = 0

      ctx.fillStyle = `rgba(52, 211, 153, ${s.maxAlpha})`
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fill()
    })

    animationFrameId = requestAnimationFrame(render)
  }

  render()

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', onResize)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full block" />
  </div>
</template>