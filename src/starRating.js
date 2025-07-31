import { useState } from "react";

const styleContainer = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const starStyle = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
};

export default function StarRating({
  maxRating = 5,
  onSetRating,
  defaultRating = 0,
  messages = [],
  size = 48,
  color = "#fcc419",
  classname = "",
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleClicking(value) {
    setRating(value);
    if (onSetRating) onSetRating(value);
  }
  function handleTempRating(value) {
    setTempRating(value);
  }

  return (
    <div style={styleContainer} className={classname}>
      <div style={starStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onClicking={() => handleClicking(i + 1)}
            onEntering={() => handleTempRating(i + 1)}
            onLeaving={() => handleTempRating(0)}
            isFill={tempRating ? i + 1 <= tempRating : i + 1 <= rating}
            color={color}
            size={size}
          />
        ))}
      </div>
      <strong>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </strong>
    </div>
  );
}

function Star({ onClicking, onEntering, onLeaving, isFill, color, size }) {
  const starSymbolStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "inline-block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starSymbolStyle}
      onClick={onClicking}
      onMouseEnter={onEntering}
      onMouseLeave={onLeaving}
      tabIndex={0}
    >
      {isFill ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
          width="100%"
          height="100%"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          width="100%"
          height="100%"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
