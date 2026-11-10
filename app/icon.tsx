import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 320,
          background: '#0B0C0E',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAF8F5',
          fontFamily: 'serif',
          fontWeight: 700,
          border: '12px solid #23272C',
        }}
      >
        <span style={{ color: '#D4A373' }}>V</span>
      </div>
    ),
    {
      ...size,
    }
  );
}

