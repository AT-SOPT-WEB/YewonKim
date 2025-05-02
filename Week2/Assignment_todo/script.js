// 요소 선택
const input = document.querySelector("input[type='text']");
const addBtn = document.querySelector(".addBtn");
const todoList = document.querySelector(".todoList");
const deleteBtn = document.querySelector(".deleteBtn");
const completeBtn = document.querySelector(".completeBtn");
const dropdownButton = document.querySelector(".dropbtn");
const topDropdownButton = document.querySelector(".topDropbtn");
const dropdownContent = document.querySelector(".dropdownContent");
const topDropdownContent = document.querySelector(".topDropdownContent");

document.addEventListener("DOMContentLoaded", () => {
	loadTodos();
});

function loadTodos() {
	let todosFromLocalStorage = JSON.parse(localStorage.getItem("todos"));

	if (!todosFromLocalStorage) {
		fetch("todos.json")
			.then((response) => response.json())
			.then((todos) => {
				localStorage.setItem("todos", JSON.stringify(todos));
				renderTodos(todos);
			})
			.catch((error) => {
				console.error("Error loading todos:", error);
			});
	} else {
		renderTodos(todosFromLocalStorage);
	}
}

let todos = JSON.parse(localStorage.getItem("todos")) || [];

let selectedPriority = "1";

let filteredTodos = [...todos];

document.querySelector(".allBtn").addEventListener("click", () => {
	filteredTodos = [...todos];
	renderTodos();
});

document.querySelector(".completedBtn").addEventListener("click", () => {
	filteredTodos = todos.filter((todo) => todo.completed);
	renderTodos();
});

document.querySelector(".incompleteBtn").addEventListener("click", () => {
	filteredTodos = todos.filter((todo) => !todo.completed);
	renderTodos();
});

document.querySelectorAll(".topDropdownContent li").forEach((link) => {
	link.addEventListener("click", (event) => {
		const priority = event.target.getAttribute("data-priority");
		dropdownButton.innerHTML = `중요도 ${priority} <i class="fa-solid fa-caret-down"></i>`;

		filteredTodos = todos.filter((todo) => todo.priority === priority);
		renderTodos();
	});
});

// 초기화
todos.forEach((todo, index) => {
	const tr = document.createElement("tr");
	tr.classList.add("todoItem");
	tr.setAttribute("draggable", "true");
	tr.setAttribute("data-id", todo.id);

	tr.innerHTML = `
		<td><input type="checkbox" class="todoCheckbox" ${
			todo.completed ? "checked" : ""
		}/></td>
		<td>${todo.priority}</td>
		<td>${todo.completed ? "✅" : "❌"}</td>
		<td>${todo.title}</td>
	`;

	todoList.appendChild(tr);

	tr.addEventListener("dragstart", (e) => handleDragStart(e, index));
	tr.addEventListener("dragover", (e) => handleDragOver(e));
	tr.addEventListener("drop", (e) => handleDrop(e, index));
	tr.addEventListener("dragenter", (e) => e.preventDefault());
});

let draggedIndex = null;
function handleDragStart(e, index) {
	draggedIndex = index;
}

function handleDragOver(e) {
	e.preventDefault();
}

function handleDrop(e, index) {
	e.preventDefault();
	if (draggedIndex !== null && draggedIndex !== index) {
		const movedTodo = todos[draggedIndex];
		todos.splice(draggedIndex, 1);
		todos.splice(index, 0, movedTodo);

		renderTodos();
		localStorage.setItem("todos", JSON.stringify(todos));
	}
}

dropdownButton.addEventListener("click", () => {
	dropdownContent.classList.toggle("show");
});

topDropdownButton.addEventListener("click", () => {
	topDropdownContent.classList.toggle("show");
});

dropdownContent.querySelectorAll("li").forEach((link) => {
	link.addEventListener("click", (event) => {
		event.preventDefault();
		const priority = event.target.getAttribute("data-priority");
		dropdownButton.innerHTML = `중요도 ${priority} <i class="fa-solid fa-caret-down"></i>`;

		selectedPriority = priority;
	});
});

// 추가
addBtn.addEventListener("click", () => {
	const value = input.value;
	const priority = selectedPriority || "1";

	if (!value) return;

	const newTodo = {
		id: todos.length + 1,
		title: value,
		priority: priority,
		completed: false,
	};

	todos.push(newTodo);
	localStorage.setItem("todos", JSON.stringify(todos));
	renderTodos();

	input.value = "";
});

// 완료
completeBtn.addEventListener("click", () => {
	const checkboxes = document.querySelectorAll(".todoCheckbox");
	checkboxes.forEach((checkbox, index) => {
		if (checkbox.checked) {
			todos[index].completed = true;
			const tdCompleted = checkbox.closest("tr").querySelectorAll("td")[2];
			tdCompleted.textContent = "✅";
			checkbox.disabled = true;
		}
	});
	localStorage.setItem("todos", JSON.stringify(todos));
	renderTodos();
});

// 삭제
deleteBtn.addEventListener("click", () => {
	const checkboxes = document.querySelectorAll(".todoCheckbox");
	checkboxes.forEach((checkbox, index) => {
		if (checkbox.checked) {
			todos.splice(index, 1);
			checkbox.closest("tr").remove();
		}
	});
	localStorage.setItem("todos", JSON.stringify(todos));
});

// 할 일 렌더링
function renderTodos() {
	todoList.innerHTML = "";
	todos.forEach((todo, index) => {
		const tr = document.createElement("tr");
		tr.classList.add("todoItem");
		tr.setAttribute("draggable", "true");
		tr.setAttribute("data-id", todo.id);

		tr.innerHTML = `
            <td><input type="checkbox" class="todoCheckbox" ${
							todo.completed ? "checked" : ""
						}/></td>
            <td>${todo.priority}</td>
            <td>${todo.completed ? "✅" : "❌"}</td>
            <td>${todo.title}</td>
        `;

		tr.addEventListener("dragstart", (e) => handleDragStart(e, index));
		tr.addEventListener("dragover", (e) => handleDragOver(e));
		tr.addEventListener("drop", (e) => handleDrop(e, index));
		tr.addEventListener("dragenter", (e) => e.preventDefault());

		todoList.appendChild(tr);
	});
}
