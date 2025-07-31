import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./starRating";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Test() {
  const [rate, setRate] = useState(0);
  return (
    <div>
      <StarRating onSetRating={setRate} />
      <p>this movies has {rate} rating</p>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
