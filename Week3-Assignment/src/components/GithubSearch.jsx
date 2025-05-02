import styled from "@emotion/styled";
import Input from "./Input";
import { useState, useEffect } from "react";

const GithubSearch = () => {
	const [user, setUser] = useState("");
	const [userInfo, setUserInfo] = useState({ status: "idle", data: null });
	const [userList, setUserList] = useState([]);

	useEffect(() => {
		const savedList = localStorage.getItem("recentUsers");
		if (savedList) {
			setUserList(JSON.parse(savedList));
		}
	}, []);

	//사용자 정보 가져오기기
	const getUserInfo = async (user) => {
		setUserInfo({ status: "pending", data: null });
		try {
			const response = await fetch(`https://api.github.com/users/${user}`);
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setUserInfo({ status: "resolved", data });
		} catch {
			setUserInfo({ status: "rejected", data: null });
		}
	};

	//인풋 입력 값 받아오기기
	const handleInput = (e) => {
		setUser(e.target.value);
	};

	//사용자 정보 검색(인풋에 아이디 입력 후 엔터시)
	const handleSubmit = () => {
		if (!user.trim()) return;

		getUserInfo(user);

		// 중복 제거 후 최신 검색어 맨 앞으로 추가
		setUserList((prev) => {
			const updated = [...prev.filter((u) => u !== user), user].slice(-3);
			localStorage.setItem("recentUsers", JSON.stringify(updated));
			return updated;
		});

		setUser("");
	};

	//정보 카드에서 닫기버튼 눌렀을 때
	const handleClose = () => {
		setUserInfo({ status: "idle", data: null });
	};

	//최근 검색어 키워드 닫기버튼 눌렀을 때
	const handleDeleteKeyword = (keyword) => {
		const updated = userList.filter((u) => u !== keyword);
		setUserList(updated);
		localStorage.setItem("recentUsers", JSON.stringify(updated));
	};

	//최근 검색어 키워드 눌렀을 때때
	const onclickKeyword = (keyword) => {
		getUserInfo(keyword);
	};

	console.log(userInfo);

	return (
		<Container>
			<Input
				value={user}
				placeholder="Github 프로필을 검색해보세요."
				onChange={handleInput}
				onSubmit={handleSubmit}
			/>

			<RecentSearch>
				<h5>최근 검색어</h5>
				<div>
					{userList.map((u, i) => (
						<Keyword>
							<span key={i} onClick={() => onclickKeyword(u)}>
								{u}
							</span>
							<CloseButton onClick={() => handleDeleteKeyword(u)}>
								❌
							</CloseButton>
						</Keyword>
					))}
				</div>
			</RecentSearch>

			{/* 조건부 렌더링을 통해 resolved 상태 즉, 검색 결과 데이터가 있는 경우에 결과를 표시 */}
			{userInfo.status === "resolved" && (
				<GithubCard>
					<CloseButton onClick={handleClose}>❌</CloseButton>
					<a href={userInfo.data.html_url}>
						<img src={userInfo.data.avatar_url} />
					</a>

					<h3>{userInfo.data.name}</h3>
					<p>{userInfo.data.bio}</p>
					<FollowInfo>
						<p>Followers {userInfo.data.followers}</p>
						<p>Following {userInfo.data.following}</p>
					</FollowInfo>
				</GithubCard>
			)}
		</Container>
	);
};

export default GithubSearch;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const RecentSearch = styled.div`
	width: 30rem;
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
`;

const Keyword = styled.span`
	background-color: #a6e8baae;
	padding: 0.5rem;
	border-radius: 20px;
	display: inline-block;
`;
const CloseButton = styled.button`
	align-self: end;
	background-color: transparent;
	border: none;

	cursor: pointer;
`;
const GithubCard = styled.div`
	margin: 1rem;
	background-color: #267454f9;
	width: 30rem;
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 15px;
	padding-block: 1rem;
	p {
		text-align: center;
	}
	p:nth-child(3) {
		width: 80%;
	}
	a {
		max-width: 60%;
	}
	img {
		border-radius: 100%;
		width: 100%;
		border: 5px solid #ebd109;
		cursor: pointer;
	}
`;
const FollowInfo = styled.div`
	display: flex;
	p {
		background-color: #eae88856;
		padding: 1rem;
		margin-inline: 1rem;
		border-radius: 10px;
	}
`;
