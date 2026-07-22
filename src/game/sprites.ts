// Part of the render layer: pure canvas drawing for themed tiles and the
// interactable object sprites. No game logic, no React. Everything is drawn
// as flat rectangles and small arcs so it stays crisp at pixel scale.
import type { ObjectSprite } from '../content/types'

const CYAN = '#5ee9f2'
const RACK_UNIT = '#24395a'
const RACK_LED_DIM = '#1c3a44'

/** A server rack tile: two dark equipment columns dotted with cyan LEDs. */
export function drawServerRack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  base: string,
): void {
  ctx.fillStyle = base
  ctx.fillRect(x, y, size, size)
  ctx.fillStyle = RACK_UNIT
  ctx.fillRect(x + 2, y + 1, 5, size - 2)
  ctx.fillRect(x + size - 7, y + 1, 5, size - 2)
  // Steady cyan status LEDs (the "glowing accents"); some dim for variety.
  const leds: [number, number, string][] = [
    [x + 3, y + 3, CYAN],
    [x + 3, y + 8, RACK_LED_DIM],
    [x + 3, y + 12, CYAN],
    [x + size - 4, y + 4, CYAN],
    [x + size - 4, y + 9, RACK_LED_DIM],
    [x + size - 4, y + 13, CYAN],
  ]
  for (const [lx, ly, color] of leds) {
    ctx.fillStyle = color
    ctx.fillRect(lx, ly, 1, 1)
  }
}

/** Draw an interactable object sprite filling one tile at (x, y). */
export function drawObjectSprite(
  ctx: CanvasRenderingContext2D,
  sprite: ObjectSprite,
  x: number,
  y: number,
  size: number,
  timeSeconds: number,
): void {
  switch (sprite) {
    case 'clocks':
      drawClocks(ctx, x, y, size, timeSeconds)
      break
    case 'terminal':
      drawTerminal(ctx, x, y, size)
      break
    case 'robot':
      drawRobot(ctx, x, y, size)
      break
    case 'cabinet':
      drawCabinet(ctx, x, y, size)
      break
    case 'laptop':
      drawLaptop(ctx, x, y, size)
      break
  }
}

/** An open laptop sitting on the desk, screen glowing warm. */
function drawLaptop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _size: number,
): void {
  ctx.fillStyle = '#c9c4bb'
  ctx.fillRect(x + 3, y + 10, 11, 3) // keyboard base
  ctx.fillStyle = '#8a8078'
  ctx.fillRect(x + 4, y + 3, 9, 7) // screen lid
  ctx.fillStyle = '#20303e'
  ctx.fillRect(x + 5, y + 4, 7, 5) // screen
  ctx.fillStyle = '#f0b45a'
  ctx.fillRect(x + 6, y + 5, 5, 1) // warm glow
  ctx.fillRect(x + 6, y + 7, 3, 1)
}

/** A 2x2 wall of clock faces; the top-right one flashes red. */
function drawClocks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  timeSeconds: number,
): void {
  ctx.fillStyle = '#0b1626'
  ctx.fillRect(x, y, size, size)
  const centers: [number, number][] = [
    [x + 4, y + 5],
    [x + 11, y + 5],
    [x + 4, y + 12],
    [x + 11, y + 12],
  ]
  const flashOn = Math.floor(timeSeconds * 2) % 2 === 0
  centers.forEach(([cx, cy], i) => {
    const isRed = i === 1
    ctx.fillStyle = isRed ? (flashOn ? '#ff4d4d' : '#5a1414') : '#d7e3ea'
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
    // Clock hand.
    ctx.fillStyle = '#0b1626'
    ctx.fillRect(cx, cy - 2, 1, 2)
    ctx.fillRect(cx, cy, 2, 1)
  })
}

/** A monitor on a desk with glowing cyan text lines. */
function drawTerminal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = '#2a3346'
  ctx.fillRect(x + 1, y + 11, size - 2, 4) // desk
  ctx.fillRect(x + size / 2 - 1, y + 9, 2, 2) // stand
  ctx.fillStyle = '#3a475f'
  ctx.fillRect(x + 3, y + 2, size - 6, 8) // monitor body
  ctx.fillStyle = '#0b1626'
  ctx.fillRect(x + 4, y + 3, size - 8, 6) // screen
  ctx.fillStyle = '#3fd6e0'
  ctx.fillRect(x + 5, y + 4, 4, 1)
  ctx.fillRect(x + 5, y + 6, 6, 1)
  ctx.fillRect(x + 5, y + 8, 3, 1)
}

/** A small friendly robot with cyan eyes and an antenna. */
function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _size: number,
): void {
  ctx.fillStyle = '#8fa4bd'
  ctx.fillRect(x + 4, y + 8, 8, 6) // body
  ctx.fillStyle = '#b8c6d8'
  ctx.fillRect(x + 4, y + 3, 8, 6) // head
  ctx.fillRect(x + 7, y + 1, 1, 2) // antenna
  ctx.fillStyle = CYAN
  ctx.fillRect(x + 7, y, 1, 1) // antenna tip
  ctx.fillRect(x + 6, y + 5, 2, 2) // left eye
  ctx.fillRect(x + 9, y + 5, 2, 2) // right eye
  ctx.fillStyle = '#2c3a4f'
  ctx.fillRect(x + 6, y + 11, 4, 1) // mouth
}

/** A filing cabinet with three drawers and handles. */
function drawCabinet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  _size: number,
): void {
  ctx.fillStyle = '#5b6b82'
  ctx.fillRect(x + 3, y + 2, 10, 13) // body
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#48566b'
    ctx.fillRect(x + 4, y + 3 + i * 4, 8, 3) // drawer
    ctx.fillStyle = '#c9d4e2'
    ctx.fillRect(x + 7, y + 4 + i * 4, 2, 1) // handle
  }
}
