import CONFIG from '../config.json';

export function backendApiRoot(): string {
  return CONFIG['BACKEND_URL'].replace(/\/api\/chants\/?$/, '');
}
