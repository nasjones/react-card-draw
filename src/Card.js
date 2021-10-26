import React from "react";

function Card({ src, alt, angle }) {
	return (
		<img src={src} alt={alt} style={{ transform: `rotate(${angle}deg)` }} />
	);
}

export default Card;
