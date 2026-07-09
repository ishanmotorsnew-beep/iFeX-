import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRequestBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/$/, '');
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('x-forwarded-host') || req.get('host');
  return `${protocol}://${host}`;
}

function isLocalHostname(hostname) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname);
}

export function buildPublicImageUrl(req, imagePath) {
  if (!imagePath) return imagePath;

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const url = new URL(imagePath);
      if (isLocalHostname(url.hostname)) {
        return `${getRequestBaseUrl(req)}${url.pathname}${url.search}${url.hash}`;
      }
      if (url.pathname.startsWith('/uploads/')) {
        return `https://raw.githubusercontent.com/ishanmotorsnew-beep/iFeX-/main/server/uploads${url.pathname.replace('/uploads', '')}${url.search}${url.hash}`;
      }
      return imagePath;
    } catch {
      return imagePath;
    }
  }

  if (imagePath.startsWith('/uploads/')) {
    return `https://raw.githubusercontent.com/ishanmotorsnew-beep/iFeX-/main/server/uploads${imagePath.replace('/uploads', '')}`;
  }

  return imagePath;
}

export function resolveLocalUploadPath(filename) {
  return path.join(path.dirname(__dirname), 'uploads', filename);
}
