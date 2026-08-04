export function resolveSpeciesImageUrl(
  imageRef?: string,
  mimeType: string = 'image/jpeg'
): string {
  if (!imageRef) {
    return '';
  }

  if (
    imageRef.startsWith('data:') ||
    imageRef.startsWith('http://') ||
    imageRef.startsWith('https://') ||
    imageRef.startsWith('/vector-api/')
  ) {
    return imageRef;
  }

  const cleaned = imageRef.replace(/\s+/g, '');
  const isLikelyBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(cleaned.slice(0, 100));
  if (isLikelyBase64) {
    return `data:${mimeType};base64,${cleaned}`;
  }

  if (imageRef.startsWith('/')) {
    return imageRef;
  }

  return `/vector-api/species-information/images/${imageRef}`;
}

export function getSpeciesImageDownloadUrl(
  imageRef?: string,
  speciesName?: string,
  mimeType: string = 'image/jpeg'
): string {
  const resolvedUrl = resolveSpeciesImageUrl(imageRef, mimeType);
  if (!resolvedUrl) {
    return '';
  }

  if (resolvedUrl.startsWith('data:')) {
    return resolvedUrl;
  }

  if (resolvedUrl.includes('/species-information/images/')) {
    const separator = resolvedUrl.includes('?') ? '&' : '?';
    return `${resolvedUrl}${separator}download=true`;
  }

  return resolvedUrl;
}

export async function downloadSpeciesImage(
  imageRef?: string,
  speciesName?: string,
  mimeType: string = 'image/jpeg'
): Promise<void> {
  const resolvedUrl = resolveSpeciesImageUrl(imageRef, mimeType);
  if (!resolvedUrl) {
    return;
  }

  const fileName = `${(speciesName || 'species').replace(
    /\s+/g,
    '_'
  )}_image.png`;

  if (resolvedUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = resolvedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const downloadUrl = getSpeciesImageDownloadUrl(
      imageRef,
      speciesName,
      mimeType
    );
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Download failed:', error);
    alert(`Failed to download image: ${message}`);
  }
}

export async function downloadSpeciesImageById(
  speciesId: string,
  speciesName?: string
): Promise<void> {
  const fileName = `${(speciesName || 'species').replace(
    /\s+/g,
    '_'
  )}_image.jpg`;

  try {
    const response = await fetch(
      `/vector-api/species-information/${speciesId}/download-image`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Download failed:', error);
    alert(`Failed to download image: ${message}`);
  }
}
