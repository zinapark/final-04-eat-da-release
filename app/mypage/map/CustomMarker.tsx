export default function CustomMarker({ onClick }: { onClick: () => void }) {
  return (
    <svg
      width="40"
      height="35"
      viewBox="0 0 24 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 23 12 23s12-14 12-23c0-6.6-5.4-12-12-12z"
        fill="#ff6155"
      />
      <circle cx="12" cy="12" r="5" fill="white" />
    </svg>
  );
}
