import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Center Study Center',
    short_name: 'CSC',
    description: 'Complete searchable archive of Adam Katz & Dennis Bouvard — originary thinking, the center, deferral, sovereignty.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
