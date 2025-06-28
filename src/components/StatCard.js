import React, { useEffect, useRef, useState } from "react";
import "./StatCard.css";

export default function StatCard({ icon, image, label, value, color }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end)) {
      setCount(value || 0);
      return;
    }
    if (start === end) {
      setCount(end);
      return;
    }
    let duration = 1000;
    let increment = end / (duration / 16);
    let current = start;
    function animate() {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    animate();
    // eslint-disable-next-line
  }, [value]);

  return (
    <div className="stat-card" style={{ borderColor: color }}>
      <div className="stat-icon" style={{ color }}>
        {image ? (
          <img
            src={image}
            alt="icon"
            style={{ width: 44, height: 44, objectFit: "contain" }}
          />
        ) : (
          icon
        )}
      </div>
      <div className="stat-value">
        {typeof count === "number" ? count : String(count)}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
