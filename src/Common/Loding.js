import React from "react";
import "../assets/css/LoadingBar.css";

const Loading = () => {
    const name = "TRACKER";

    return (
        <div className="wave-container">
        {name.split("").map((letter, index) => (
            <span
            key={index}
            className="wave-letter"
            style={{ animationDelay: `${index * 0.2}s` }}
            >
            {letter}
            </span>
        ))}
        </div>
    );
};

export default Loading;