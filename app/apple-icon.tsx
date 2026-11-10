import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: '#0B0C0E',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAF8F5',
          fontFamily: 'serif',
          fontWeight: 700,
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
