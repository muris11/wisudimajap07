export default function TitleSection() {
  return (
    <div className="text-center mb-6">
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
        style={{
          color: "#D4AF37",
          textShadow: "0 2px 20px rgba(212, 175, 55, 0.3)",
          letterSpacing: "0.15em",
        }}
      >
        MAJAP 07
      </h1>
      <p
        className="mt-2 text-sm md:text-base"
        style={{ color: "rgba(255, 255, 255, 0.5)" }}
      >
        Mahasiswa Jabodetabek Polindra
      </p>
    </div>
  );
}