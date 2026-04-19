"use client"

import { useEffect, useRef } from "react"

interface Vector2D { x: number; y: number }

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }
  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false
  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    const distance = Math.sqrt((this.pos.x - this.target.x) ** 2 + (this.pos.y - this.target.y) ** 2)
    const prox = distance < this.closeEnoughTarget ? distance / this.closeEnoughTarget : 1
    const tx = this.target.x - this.pos.x
    const ty = this.target.y - this.pos.y
    const mag = Math.sqrt(tx * tx + ty * ty) || 1
    const sx = (tx / mag) * this.maxSpeed * prox - this.vel.x
    const sy = (ty / mag) * this.maxSpeed * prox - this.vel.y
    const sm = Math.sqrt(sx * sx + sy * sy) || 1
    this.acc.x += (sx / sm) * this.maxForce
    this.acc.y += (sy / sm) * this.maxForce
    this.vel.x += this.acc.x; this.vel.y += this.acc.y
    this.pos.x += this.vel.x; this.pos.y += this.vel.y
    this.acc.x = 0; this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1)
    const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight)
    const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight)
    const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
  }

  kill(w: number, h: number) {
    if (!this.isKilled) {
      const rx = Math.random() * w, ry = Math.random() * h
      const dx = rx - w / 2, dy = ry - h / 2
      const m = Math.sqrt(dx * dx + dy * dy) || 1
      const mag = (w + h) / 2
      this.target.x = w / 2 + (dx / m) * mag
      this.target.y = h / 2 + (dy / m) * mag
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

interface Props { words?: string[]; color?: { r: number; g: number; b: number } }

export function ParticleTextEffect({
  words = ["HELLO"],
  color,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Particle[],
    frame: 0,
    wordIdx: 0,
    animId: 0,
  })

  const pixelSteps = 5

  function spawn(word: string, canvas: HTMLCanvasElement) {
    const off = document.createElement("canvas")
    off.width = canvas.width; off.height = canvas.height
    const ctx = off.getContext("2d")!

    // Adaptive font size — shrink until text fits
    let fontSize = 110
    ctx.font = `bold ${fontSize}px 'Cormorant Garamond', Georgia, serif`
    while (ctx.measureText(word).width > canvas.width * 0.9 && fontSize > 28) {
      fontSize -= 4
      ctx.font = `bold ${fontSize}px 'Cormorant Garamond', Georgia, serif`
    }
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(word, canvas.width / 2, canvas.height / 2)

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const targetColor = color ?? {
      r: 246 + Math.round(Math.random() * 9),
      g: 216 + Math.round(Math.random() * 20),
      b: 140 + Math.round(Math.random() * 15),
    }

    const { particles } = stateRef.current
    let pi = 0
    const indexes: number[] = []
    for (let i = 0; i < data.length; i += pixelSteps * 4) indexes.push(i)
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
    }

    for (const idx of indexes) {
      if (data[idx + 3] < 10) continue
      const x = (idx / 4) % canvas.width
      const y = Math.floor(idx / 4 / canvas.width)
      let p: Particle
      if (pi < particles.length) {
        p = particles[pi]; p.isKilled = false; pi++
      } else {
        p = new Particle()
        const rx = Math.random() * canvas.width, ry = Math.random() * canvas.height
        p.pos.x = rx; p.pos.y = ry
        p.maxSpeed = Math.random() * 6 + 4
        p.maxForce = p.maxSpeed * 0.05
        p.particleSize = Math.random() * 4 + 4
        p.colorBlendRate = Math.random() * 0.025 + 0.005
        particles.push(p)
      }
      p.startColor = {
        r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
        g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
        b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
      }
      p.targetColor = { ...targetColor }
      p.colorWeight = 0
      p.target.x = x; p.target.y = y
    }
    for (let i = pi; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1000
    canvas.height = 400

    const s = stateRef.current
    spawn(words[0], canvas)

    function loop() {
      const ctx = canvas!.getContext("2d")!
      ctx.fillStyle = "rgba(0,0,0,0.12)"
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)

      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i]
        p.move(); p.draw(ctx)
        if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas!.width || p.pos.y < 0 || p.pos.y > canvas!.height))
          s.particles.splice(i, 1)
      }

      s.frame++
      if (s.frame % 200 === 0) {
        s.wordIdx = (s.wordIdx + 1) % words.length
        spawn(words[s.wordIdx], canvas!)
      }
      s.animId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(s.animId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}
