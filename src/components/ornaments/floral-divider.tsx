export default function FloralDivider() {
  return (
    <div className="flex items-center justify-center my-12">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E8D5A3] to-transparent" />
      <svg
        width="60"
        height="40"
        viewBox="0 0 60 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-4"
      >
        <circle cx="30" cy="20" r="5" fill="#D4AF37" fillOpacity="0.85" />
        <ellipse cx="30" cy="12" rx="3" ry="5" fill="#D4AF37" fillOpacity="0.5" />
        <ellipse cx="30" cy="28" rx="3" ry="5" fill="#D4AF37" fillOpacity="0.5" />
        <ellipse cx="22" cy="20" rx="5" ry="3" fill="#D4AF37" fillOpacity="0.5" />
        <ellipse cx="38" cy="20" rx="5" ry="3" fill="#D4AF37" fillOpacity="0.5" />
        <circle cx="15" cy="20" r="2" fill="#D4AF37" fillOpacity="0.35" />
        <circle cx="45" cy="20" r="2" fill="#D4AF37" fillOpacity="0.35" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E8D5A3] to-transparent" />
    </div>
  );
}
