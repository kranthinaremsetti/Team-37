export default function Gauge({ label, level, description }) {
  const config = {
    low: {
      angle: "-60deg",
      ring: "border-red-500",
      needle: "bg-red-500",
      text: "text-red-400"
    },
    medium: {
      angle: "0deg",
      ring: "border-yellow-400",
      needle: "bg-yellow-400",
      text: "text-yellow-400"
    },
    high: {
      angle: "60deg",
      ring: "border-green-400",
      needle: "bg-green-400",
      text: "text-green-400"
    }
  };

  const c = config[level];

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className={`font-semibold ${c.text}`}>{label}</h3>

      {/* Speedometer */}
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Outer ring */}
        <div
          className={`absolute inset-0 rounded-full border-[10px] ${c.ring}`}
        />

        {/* Needle */}
        <div
          className={`
            absolute bottom-0 left-1/2 
            w-[2px] h-16 origin-bottom 
            ${c.needle}
            transition-transform duration-500
          `}
          style={{
            transform: `rotate(${c.angle}) translateX(-50%)`
          }}
        />
      </div>

      <p className="text-xs text-gray-400 text-center max-w-xs">
        {description}
      </p>
    </div>
  );
}
