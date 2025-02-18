document.addEventListener("DOMContentLoaded", function () { 
  const apiUrl = "http://localhost:3000/todo";
  const ul = document.getElementById("myUL");

  function loadTodo() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(todos => {
        ul.innerHTML = "";
        if (todos.length === 0) {
          ul.innerHTML = "<li class='no-data'>Chưa có công việc nào!</li>";
          return;
        }
        todos.sort((a, b) => a.order - b.order);
        todos.forEach(todo => addTodoToList(todo));
        enableDragAndDrop();
      })
      .catch(err => {
        console.error("Không thể tải dữ liệu:", err);
        ul.innerHTML = "<li class='error'>Không thể kết nối tới server!</li>";
      });
  }

  function addTodoToList(todo) {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.id = todo.id;
    li.classList.add("draggable");

    // Nội dung chính
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.content;

    if (todo.status) li.classList.add("checked");

    // Input chỉnh sửa ẩn ban đầu
    const input = document.createElement("input");
    input.type = "text";
    input.value = todo.content;
    input.classList.add("edit-input");
    input.style.display = "none";

    // Nút xóa
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "close";
    deleteBtn.textContent = "×";
    deleteBtn.onclick = () => deleteTodo(todo.id);

    // Nút chỉnh sửa
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Sửa";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      textSpan.style.display = "none";
      input.style.display = "inline-block";
      input.focus();
    };

    // Sự kiện chỉnh sửa
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") saveEdit(todo.id, input, textSpan);
    });
    input.addEventListener("blur", () => saveEdit(todo.id, input, textSpan));

    // Toggle trạng thái hoàn thành khi click
    textSpan.addEventListener("click", () => toggleTodo(todo.id, !todo.status));

    li.appendChild(textSpan);
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  }

  function enableDragAndDrop() {
    let draggedItem = null;

    document.querySelectorAll(".draggable").forEach(item => {
      item.addEventListener("dragstart", () => {
        draggedItem = item;
        setTimeout(() => item.classList.add("dragging"), 0);
      });

      item.addEventListener("dragend", () => {
        setTimeout(() => {
          draggedItem.classList.remove("dragging");
          draggedItem = null;
          saveNewOrder();
        }, 0);
      });
    });

    ul.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(ul, e.clientY);
      if (afterElement == null) {
        ul.appendChild(draggedItem);
      } else {
        ul.insertBefore(draggedItem, afterElement);
      }
    });
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function saveNewOrder() {
    const todos = [...document.querySelectorAll(".draggable")].map((item, index) => ({
      id: item.dataset.id,
      order: index + 1
    }));

    fetch(apiUrl + "/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todos)
    })
    .then(() => loadTodo())
    .catch(err => console.error("Lỗi khi lưu thứ tự:", err));
  }

  document.querySelector(".addBtn").addEventListener("click", () => {
    const input = document.getElementById("myInput");
    const content = input.value.trim();
    if (!content) {
      alert("Bạn phải nhập nội dung!");
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    })
    .then(res => res.json())
    .then(todo => {
      addTodoToList(todo);
      enableDragAndDrop();
      input.value = "";
    })
    .catch(err => console.error("Lỗi khi thêm công việc:", err));
  });

  function deleteTodo(id) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => {
      document.querySelector(`[data-id="${id}"]`).remove();
      reorderTodos();
    })
    .catch(err => console.error("Lỗi khi xóa công việc:", err));
  }

  function reorderTodos() {
    const todos = [...document.querySelectorAll(".draggable")].map((item, index) => ({
      id: item.dataset.id,
      content: item.querySelector("span").textContent,
      status: item.classList.contains("checked"),
      order: index + 1
    }));

    fetch(apiUrl + "/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todos)
    })
    .then(() => loadTodo())
    .catch(err => console.error("Lỗi khi cập nhật thứ tự:", err));
  }

  function toggleTodo(id, status) {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    .then(() => loadTodo())
    .catch(err => console.error("Lỗi khi cập nhật trạng thái:", err));
  }

  function updateTodo(id, newContent) {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent })
    })
    .then(() => loadTodo())
    .catch(err => console.error("Lỗi khi cập nhật nội dung:", err));
  }

  function saveEdit(id, input, textSpan) {
    const newContent = input.value.trim();
    if (newContent) {
      updateTodo(id, newContent);
      textSpan.textContent = newContent;
    }
    textSpan.style.display = "inline";
    input.style.display = "none";
  }

  loadTodo();
});
