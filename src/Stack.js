import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./Stack.css";

const deck_api = "http://deckofcardsapi.com/api/deck/";

function Stack() {
	const [stack, updateStack] = useState([]);
	const [deckId, updateDeckId] = useState("");
	const [done, updateDone] = useState(false);
	const [hit, updateHit] = useState(false);
	const timerId = useRef();

	useEffect(function getDeckWhenMounted() {
		async function getDeck() {
			const res = await axios.get(deck_api + "new/shuffle/?deck_count=1");
			updateDeckId(res.data.deck_id);
		}
		getDeck();
	}, []);

	useEffect(
		function cardTimer() {
			if (hit) timerId.current = setInterval(getCard, 1000);
			else if (!hit) clearInterval(timerId.current);
		},
		[hit]
	);

	function handleHit() {
		updateHit(!hit);
	}

	async function getCard() {
		const res = await axios.get(`${deck_api}${deckId}/draw/?count=1`);
		if (res.data.success) {
			let angle =
				Math.floor(Math.random() * 40) * (Math.random() > 0.5 ? 1 : -1);
			updateStack((currentStack) => [
				...currentStack,
				<Card
					src={res.data.cards[0].images.png}
					alt={res.data.cards[0].code}
					angle={angle}
					key={res.data.cards[0].code}
				/>,
			]);

			if (res.data.remaining === 0) {
				clearInterval(timerId.current);
				updateDone(true);
				updateHit(false);
			}
		} else {
			alert("Sorry there was a problem getting the next card.");
		}
	}

	return (
		<div>
			{!done && (
				<button onClick={handleHit}>
					{hit ? "Stop Drawing" : "Start Drawing"}
				</button>
			)}
			<br />
			<div id="cardStack">{stack}</div>
		</div>
	);
}

export default Stack;
