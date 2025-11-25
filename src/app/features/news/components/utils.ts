export const processImageUrl = (url: string | null, width: number, height: number): string => {
  if (!url) {
    const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <rect width="100%" height="100%" fill="url(#gradient)"/>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stop-color="#F3F4F6"/>
              <stop offset="100%" stop-color="#E5E7EB"/>
            </linearGradient>
          </defs>
          <g transform="translate(${width / 2 - 12} ${height / 2 - 12})">
            <path fill="#9CA3AF" d="M19.5,5h-15C3.7,5,3,5.7,3,6.5v11C3,18.3,3.7,19,4.5,19h15c0.8,0,1.5-0.7,1.5-1.5v-11C21,5.7,20.3,5,19.5,5z M19.5,17.5h-15v-11h15V17.5z"/>
            <circle fill="#9CA3AF" cx="8" cy="8" r="2"/>
            <path fill="#9CA3AF" d="M12.5,11.5l-2-2l-4,4l7,7l6-6L12.5,11.5z"/>
          </g>
        </svg>
      `;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}&height=${height}&fit=cover&quality=80`;
};
