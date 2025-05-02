import styled from "@emotion/styled";

const Input = ({ value, placeholder, onChange, onSubmit }) => {
	return (
		<InputBox
			type="text"
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onSubmit();
				}
			}}
		/>
	);
};

export default Input;

const InputBox = styled.input`
	border-radius: 16px;
	border: 2px solid #294164;
	min-width: 30rem;
	height: 2rem;
	margin-block: 1rem;
	padding-inline: 1rem;
`;
