import styled from "@emotion/styled";

const Header = ({ mode, setMode }) => {
	return (
		<HeaderContainer>
			<h1>숫자야구||깃허브 검색</h1>
			<button
				className={mode === "github" ? "active" : ""}
				onClick={() => setMode("github")}>
				깃허브 검색
			</button>
			<button
				className={mode === "baseball" ? "active" : ""}
				onClick={() => setMode("baseball")}>
				숫자야구
			</button>
		</HeaderContainer>
	);
};

export default Header;

const HeaderContainer = styled.div`
	background-color: #000000;
	color: #d0f2a9;
	text-align: center;
	padding: 0.3rem;

	button {
		margin: 0.5rem;
		border: none;
		background-color: transparent;
		border-radius: 10px;
		color: white;
	}
	button.active {
		background-color: #d0f2a9;
		color: #000000;
	}
`;
