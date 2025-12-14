import { useState } from "react";

export default function ReportSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-[#020617]/80 shadow-lg">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left"
      >
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
        <span className="text-white text-xl">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="px-6 pb-6">
          <div
            className="
              bg-white 
              rounded-lg 
              p-5 
              text-gray-900 
              leading-relaxed
            "
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
