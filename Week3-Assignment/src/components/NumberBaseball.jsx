import { useState, useEffect } from "react";

import styled from "@emotion/styled";
import Input from "./Input";

const NumberBaseball = () => {
	const [answer, setAnswer] = useState(generateAnswer());
	const [input, setInput] = useState("");
	const [result, setResult] = useState("");
	const [logs, setLogs] = useState([]);
	const [tryCount, setTryCount] = useState(0);

	const handleInput = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = () => {
		if (!/^\d{3}$/.test(input)) {
			setResult("⚠️ 3자리 숫자를 입력하세요");
			return;
		}
		if (new Set(input).size !== 3) {
			setResult("⚠️ 중복 없는 숫자를 입력하세요");
			return;
		}

		const { strike, ball } = check(input, answer);
		const feedback = `${strike}스트라이크 ${ball}볼`;

		const newTryCount = tryCount + 1;
		setTryCount(newTryCount);

		if (strike === 3) {
			setResult("🎉 정답입니다! 3초 뒤에 게임이 리셋됩니다.");
			setLogs((prev) => [...prev, `${input} - ${feedback}`]);
			setTimeout(() => handleReset(), 3000);
		} else if (newTryCount >= 10) {
			setResult(
				`❌ 게임 패배! 정답은 ${answer}입니다. 5초 후 게임이 초기화됩니다.`
			);
			setLogs((prev) => [...prev, `${input} - ${feedback}`]);
			setTimeout(() => handleReset(), 5000);
		} else {
			setResult(feedback);
			setLogs((prev) => [...prev, `${input} - ${feedback}`]);
		}

		setInput("");
	};

	const handleReset = () => {
		setAnswer(generateAnswer());
		setInput("");
		setResult("");
		setLogs([]);
		setTryCount(0); // 시도 횟수 초기화
	};

	useEffect(() => {
		console.log("정답:", answer);
	}, [answer]);

	return (
		<Container>
			<Input
				value={input}
				placeholder="3자리 숫자를 입력해주세요."
				onChange={handleInput}
				onSubmit={handleSubmit}
			/>
			<h2>{result}</h2>
			<h4>시도 횟수: {tryCount} / 10</h4>
			<ListContainer>
				{logs.map((log, i) => (
					<h2 key={i}>{log}</h2>
				))}
			</ListContainer>
		</Container>
	);
};

export default NumberBaseball;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ListContainer = styled.div`
	margin-top: 20px;

	h2 {
		text-align: center;
		border: 2px solid #3aa168;
		width: 30rem;
		padding-block: 0.3rem;
		border-radius: 10px;
		margin-block: 0.5rem;
	}
`;

// 랜덤 3자리 숫자 (중복 없는)
function generateAnswer() {
	const digits = [];
	while (digits.length < 3) {
		const rand = Math.floor(Math.random() * 10).toString();
		if (!digits.includes(rand)) digits.push(rand);
	}
	return digits.join("");
}

// 스트라이크, 볼 계산
function check(guess, answer) {
	let strike = 0;
	let ball = 0;
	for (let i = 0; i < 3; i++) {
		if (guess[i] === answer[i]) strike++;
		else if (answer.includes(guess[i])) ball++;
	}
	return { strike, ball };
}
