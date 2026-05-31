export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const chars = text.split('');
  let line = '';
  const lines: string[] = [];
  for (const char of chars) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}

export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSize: number,
  maxWidth: number,
): void {
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.4;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, centerX, startY + i * lineHeight);
  });
}
