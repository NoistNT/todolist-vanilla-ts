import { TodoList } from "@/classes/todolist/todolist.class";
import { TodoListUI } from "@/classes/todolistui/todolistui.class";
import { jest } from "@jest/globals";

describe("TodoListUI", () => {
  let todoList: TodoList;
  let todoListUI: TodoListUI;
  let mockTodoListElement: HTMLUListElement;
  let mockForm: HTMLFormElement;
  let mockInput: HTMLInputElement;
  let mockRemoveAllButton: HTMLButtonElement;

  beforeEach(() => {
    mockTodoListElement = document.createElement("ul");
    mockTodoListElement.id = "todo-list";
    mockForm = document.createElement("form");
    mockForm.id = "todo-form";
    mockInput = document.createElement("input");
    mockInput.id = "new-todo";
    mockRemoveAllButton = document.createElement("button");
    mockRemoveAllButton.id = "remove-all";

    document.body.innerHTML = ""; // Reset DOM
    document.body.appendChild(mockTodoListElement);
    document.body.appendChild(mockForm);
    document.body.appendChild(mockInput);
    document.body.appendChild(mockRemoveAllButton);

    todoList = new TodoList();
    todoListUI = new TodoListUI(todoList);
  });

  afterEach(() => {
    document.body.innerHTML = ""; // Clean up DOM
    jest.restoreAllMocks(); // Reset mocks
  });

  describe("constructor", () => {
    test("Should be defined", () => {
      expect(TodoListUI).toBeDefined();
    });

    test("Should create an instance of TodoListUI", () => {
      expect(todoListUI).toBeInstanceOf(TodoListUI);
    });
  });

  describe("displayList", () => {
    test("Should display empty list when no todos exist", () => {
      todoListUI.displayList();
      expect(mockTodoListElement.children.length).toBe(0);
    });

    test("Should display todos when they exist", () => {
      todoList.add({ id: 1, title: "Test Todo" });
      todoListUI.displayList();

      expect(mockTodoListElement.children.length).toBe(1);
      expect(mockTodoListElement.innerHTML).toContain("Test Todo");
      expect(mockTodoListElement.innerHTML).toContain('data-id="1"');
    });

    test("Should display multiple todos", () => {
      todoList.add({ id: 1, title: "First Todo" });
      todoList.add({ id: 2, title: "Second Todo" });
      todoListUI.displayList();

      expect(mockTodoListElement.children.length).toBe(2);
      expect(mockTodoListElement.innerHTML).toContain("First Todo");
      expect(mockTodoListElement.innerHTML).toContain("Second Todo");
    });
  });

  describe("add", () => {
    beforeEach(() => {
      jest.spyOn(global, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("Should not add empty todo", () => {
      mockInput.value = "   ";
      todoListUI.add();

      expect(global.alert).toHaveBeenCalledWith("Please enter a task");
      expect(todoList.list().length).toBe(0);
    });

    test("Should add valid todo", () => {
      jest.useFakeTimers().setSystemTime(new Date("2024-01-01T12:00:00Z"));
      mockInput.value = "New Todo";

      todoListUI.add();

      expect(todoList.list()).toEqual([{ id: Date.now(), title: "New Todo" }]);
      expect(mockInput.value).toBe("");

      jest.useRealTimers();
    });
  });

  describe("remove", () => {
    test("Should remove specific todo", () => {
      todoList.add({ id: 1, title: "Todo 1" });
      todoList.add({ id: 2, title: "Todo 2" });

      todoListUI.remove(1);

      expect(todoList.list().length).toBe(1);
      expect(todoList.list()[0].title).toBe("Todo 2");
    });
  });

  describe("removeAll", () => {
    test("Should remove all todos", () => {
      todoList.add({ id: 1, title: "Todo 1" });
      todoList.add({ id: 2, title: "Todo 2" });

      todoListUI.removeAll();

      expect(todoList.list().length).toBe(0);
      expect(mockTodoListElement.children.length).toBe(0);
    });
  });

  describe("bindEvents", () => {
    beforeEach(() => {
      todoListUI.bindEvents(); // Bind all events before tests
    });

    test("Should bind form submit event", () => {
      mockInput.value = "New Todo";
      mockForm.dispatchEvent(new Event("submit"));

      expect(todoList.list().length).toBe(1);
      expect(todoList.list()[0].title).toBe("New Todo");
    });

    test("Should bind remove button click event", () => {
      todoList.add({ id: 1, title: "Test Todo" });
      todoListUI.displayList();

      const removeButton = mockTodoListElement.querySelector(
        ".remove-todo"
      ) as HTMLButtonElement;
      removeButton.click();

      expect(todoList.list().length).toBe(0);
    });

    test("Should bind removeAll button click event", () => {
      todoList.add({ id: 1, title: "Todo 1" });
      todoList.add({ id: 2, title: "Todo 2" });

      mockRemoveAllButton.click();

      expect(todoList.list().length).toBe(0);
    });
  });

  describe("Error handling for missing elements", () => {
    test("Should throw an error if #todo-list is missing", () => {
      document.getElementById("todo-list")?.remove();

      expect(() => todoListUI.displayList()).toThrowError(
        "Todo list element not found"
      );
    });

    test("Should handle missing input field gracefully", () => {
      mockInput.remove();
      expect(() => todoListUI.add()).not.toThrow();
    });
  });
});
