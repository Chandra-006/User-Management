/**
 * Constructs a proper image URL from baseURL and image path
 * @param {string} baseURL - The base URL of the API
 * @param {string|null|undefined} imagePath - The image path from the database (e.g., "uploads/filename.jpg")
 * @returns {string} - The full URL to the image or a default placeholder
 */
export function getImageUrl(baseURL, imagePath) {
  if (!imagePath) {
    // Return a data URI for a simple default avatar (1x1 transparent pixel as fallback)
    // Or you can use a placeholder service like placeholder.com
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23ddd' width='120' height='120'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  }

  // Normalize the baseURL (remove trailing slash)
  const normalizedBase = baseURL.replace(/\/+$/, "");
  
  // Normalize the image path (replace backslashes with forward slashes, remove leading slash)
  const normalizedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  
  // Construct the URL
  return `${normalizedBase}/${normalizedPath}`;
}

