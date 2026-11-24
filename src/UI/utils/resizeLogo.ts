// utils/resizeLogo.ts
// Resizes a logo in the browser BEFORE upload so users can pick any image from their laptop.
// Tune the constants below to change the target size.

export const LOGO_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const LOGO_MAX_WIDTH = 400; // px
export const LOGO_MAX_HEIGHT = 200; // px
export const LOGO_MAX_UPLOAD_BYTES = 500 * 1024; // resized file is kept under this
const LOGO_MAX_INPUT_BYTES = 25 * 1024 * 1024; // refuse absurdly large originals

export interface ResizedLogo {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  originalBytes: number;
  resizedBytes: number;
  wasResized: boolean;
}

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('This image could not be read. Try a different file.'));
    };
    img.src = url;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('The image could not be processed.'))),
      type,
      quality,
    ),
  );

export async function resizeLogo(file: File): Promise<ResizedLogo> {
  if (!LOGO_ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG or WebP image.');
  }
  if (file.size > LOGO_MAX_INPUT_BYTES) {
    throw new Error('This image is too large to process. Choose one under 25 MB.');
  }

  const img = await loadImage(file);

  // Fit inside MAX_WIDTH x MAX_HEIGHT, keep the aspect ratio, never upscale.
  const scale = Math.min(1, LOGO_MAX_WIDTH / img.naturalWidth, LOGO_MAX_HEIGHT / img.naturalHeight);
  let width = Math.max(1, Math.round(img.naturalWidth * scale));
  let height = Math.max(1, Math.round(img.naturalHeight * scale));

  // PNG/WebP inputs become PNG (keeps transparency). JPEG stays JPEG.
  const outType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
  const extension = outType === 'image/jpeg' ? 'jpg' : 'png';
  let quality = 0.9;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Your browser cannot process images.');

    if (outType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    blob = await canvasToBlob(canvas, outType, quality);
    if (blob.size <= LOGO_MAX_UPLOAD_BYTES) break;

    // Still too heavy: shrink by 15% (and lower JPEG quality) and try again.
    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
    if (outType === 'image/jpeg') quality = Math.max(0.5, quality - 0.1);
  }

  if (!blob) throw new Error('The image could not be processed.');

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'logo';
  const resized = new File([blob], `${baseName}.${extension}`, { type: outType });

  return {
    file: resized,
    previewUrl: URL.createObjectURL(resized),
    width,
    height,
    originalBytes: file.size,
    resizedBytes: resized.size,
    wasResized: width !== img.naturalWidth || height !== img.naturalHeight || resized.size < file.size,
  };
}
