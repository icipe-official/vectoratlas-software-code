// Turns whatever is stored (a full URL, a bare filename, a data URL,
// etc.) into something an <img src> can use directly.
export function resolveSpeciesImageUrl(imageRef?: string): string {
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

  if (imageRef.startsWith('/')) {
    return imageRef;
  }

  return `/vector-api/species-information/images/${imageRef}`;
}

export function getSpeciesImageDownloadUrl(
  imageRef?: string,
  speciesName?: string
): string {
  const resolvedUrl = resolveSpeciesImageUrl(imageRef);
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

// Case A: we already have the image ref/URL in hand (the EDIT page,
// since it loads the full record including speciesImage). Downloads
// it directly — no extra network round trip needed to find the file.
export async function downloadSpeciesImage(
  imageRef?: string,
  speciesName?: string
): Promise<void> {
  const resolvedUrl = resolveSpeciesImageUrl(imageRef);
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
    const downloadUrl = getSpeciesImageDownloadUrl(imageRef, speciesName);
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

// Case B: we only have the species id, not the image ref (the LIST
// page, since its query never fetches speciesImage). Asks the backend
// to look it up and redirect to the real file; fetch() follows that
// redirect automatically and hands us the actual image bytes.
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
