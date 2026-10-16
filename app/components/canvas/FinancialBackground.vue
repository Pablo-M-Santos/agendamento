<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null

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
    initParticles()
  }
  window.addEventListener('resize', onResize)

  interface Dust {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    alpha: number
  }

  let dustParticles: Dust[] = []

  const initParticles = () => {
    dustParticles = []
    const count = Math.floor((W * H) / 30000)
    for (let i = 0; i < count; i++) {
      dustParticles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -Math.random() * 0.2 - 0.05,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.25 + 0.05
      })
    }
  }

  initParticles()

  const render = () => {
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05

    ctx.clearRect(0, 0, W, H)

    // Fundo cinza claro elegante (não ofusca a vista)
    ctx.fillStyle = '#F8FAFC'
    ctx.fillRect(0, 0, W, H)

    // Gradiente sutil seguindo o mouse em tom esmeralda suave
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, W * 0.6)
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.06)')
    grad.addColorStop(1, 'rgba(248, 250, 252, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Partículas leves flutuando
    dustParticles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy

      if (p.y < 0) {
        p.y = H + 10
        p.x = Math.random() * W
      }
      if (p.x < 0) p.x = W
      if (p.x > W) p.x = 0

      ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.8})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
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