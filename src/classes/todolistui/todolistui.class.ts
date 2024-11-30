import { TodoList } from "@/classes/todolist/todolist.class";

export class TodoListUI {
  private todoList: TodoList;

  constructor(todoList: TodoList) {
    this.todoList = todoList;
  }

  displayList() {
    const todoListElement =
      document.querySelector<HTMLUListElement>("#todo-list");

    if (!todoListElement) {
      throw new Error("Todo list element not found");
    }

    todoListElement.innerHTML = "";

    this.todoList.list().forEach(({ id, title }) => {
      const todoElement = document.createElement("li");
      todoElement.innerHTML = `
        <h5>${title}</h5>
        <button class="remove-todo" data-id="${id}">Remove</button>
      `;
      todoListElement.appendChild(todoElement);
    });
  }

  add() {
    const textInput = document.getElementById("new-todo") as HTMLInputElement;

    if (!textInput) return;

    const title = textInput.value.trim();

    if (!title) {
      alert("Please enter a task");
      return;
    }

    this.todoList.add({ id: Date.now(), title });
    this.displayList();
    textInput.value = "";
  }

  remove(id: number) {
    this.todoList.remove(id);
    this.displayList();
  }

  removeAll() {
    this.todoList.removeAll();
    this.displayList();
  }

  bindEvents() {
    const form = document.getElementById("todo-form") as HTMLFormElement;
    const todoListElement =
      document.querySelector<HTMLUListElement>("#todo-list")!;
    const removeAllButton = document.getElementById("remove-all");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.add();
    });

    todoListElement.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches(".remove-todo")) {
        const id = parseInt(target.getAttribute("data-id")!);
        if (!isNaN(id)) this.remove(id);
      }
    });

    removeAllButton?.addEventListener("click", () => {
      this.removeAll();
    });
  }
}
