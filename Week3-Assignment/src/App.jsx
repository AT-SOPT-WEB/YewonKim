import "./App.css";
import GithubSearch from "./components/GithubSearch";
import Header from "./components/Header";
import NumberBaseball from "./components/NumberBaseball";
import { useState } from "react";

function App() {
	const [mode, setMode] = useState("github");
	return (
		<>
			<Header mode={mode} setMode={setMode} />
			{mode === "github" && <GithubSearch />}
			{mode === "baseball" && <NumberBaseball />}
		</>
	);
}

export default App;
