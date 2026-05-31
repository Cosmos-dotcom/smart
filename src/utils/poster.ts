import html2canvas from 'html2canvas';

function sanitizePosterClone(documentClone: Document, elementId: string): void {
  const posterClone = documentClone.getElementById(elementId);
  if (!posterClone) return;

  posterClone.classList.add('poster-exporting');

  const cloneWindow = documentClone.defaultView;
  if (!cloneWindow) return;

  for (const element of posterClone.querySelectorAll<HTMLElement>('*')) {
    const style = cloneWindow.getComputedStyle(element);
    if (style.backgroundImage.includes('gradient')) {
      element.style.backgroundImage = 'none';
    }

    if (style.maskImage !== 'none' || style.webkitMaskImage !== 'none') {
      element.style.maskImage = 'none';
      element.style.webkitMaskImage = 'none';
    }
  }
}

export async function generatePoster(elementId: string): Promise<string> {
  const target = document.getElementById(elementId);
  if (!target) throw new Error('Poster element not found');

  const canvas = await html2canvas(target, {
    backgroundColor: '#070807',
    scale: 2,
    useCORS: true,
    onclone: (documentClone) => {
      sanitizePosterClone(documentClone, elementId);
    },
  });

  return canvas.toDataURL('image/png');
}

export function downloadPoster(dataUrl: string, filename = 'qwen-ai-poster.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
