const input = document.querySelector(".todo-input");
const addBtn = document.querySelector(".add-btn");
const todoList = document.querySelector(".todo-list");

// 로컬스토리지에서 가져오기
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 초기화 - 화면에 표시
todos.forEach((todo) => {
	todoList.innerHTML += `<li>${todo}</li>`;
});

// 추가 버튼 클릭 이벤트
addBtn.addEventListener("click", () => {
	// 리스트에 추가
	todos.push(input.value);
	todoList.innerHTML += `<li>${input.value}</li>`;
	// 로컬스토리지에 저장
	localStorage.setItem("todos", JSON.stringify(todos));
	input.value = "";
});
