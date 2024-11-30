import { TodoInput, TodoList } from "@/classes/todolist/todolist.class";

describe("TodoList", () => {
  let todoList: TodoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  describe("class", () => {
    test("Should be defined", () => {
      expect(TodoList).toBeDefined();
    });

    test("Should be a class", () => {
      expect(typeof TodoList.prototype.constructor).toBe("function");
    });

    test("Should create an instance", () => {
      expect(todoList).toBeInstanceOf(TodoList);
    });
  });

  describe("list method", () => {
    test("Should be defined", () => {
      expect(todoList.list).toBeDefined();
    });

    test("Should return an empty array initially", () => {
      expect(todoList.list()).toEqual([]);
    });

    test("Should return a copy of the array", () => {
      todoList.add({ id: 1, title: "Test" });
      const list = todoList.list();
      list.push({ id: 2, title: "Should not be added" });

      expect(todoList.list()).toEqual([{ id: 1, title: "Test" }]);
    });

    test("Should not allow modifying todos through returned object", () => {
      todoList.add({ id: 1, title: "Original" });
      const list = todoList.list();
      list[0].title = "Modified";

      expect(todoList.list()[0].title).toBe("Original");
    });
  });

  describe("add method", () => {
    test("Should be defined", () => {
      expect(todoList.add).toBeDefined();
    });

    test("Should not allow adding todos with invalid types", () => {
      expect(() => {
        todoList.add({ id: "invalid", title: "Test" } as unknown as TodoInput);
      }).toThrow(TypeError);

      expect(() => {
        todoList.add({ id: 1, title: null } as unknown as TodoInput);
      }).toThrow(TypeError);
    });

    test("Should handle adding todos with valid IDs and titles", () => {
      todoList.add({ id: 1, title: "Task" });
      expect(todoList.list()).toEqual([{ id: 1, title: "Task" }]);
    });

    test("Should add a todo to empty list", () => {
      todoList.add({ id: 1, title: "Buy milk" });
      expect(todoList.list()).toEqual([{ id: 1, title: "Buy milk" }]);
    });

    test("Should add multiple todos", () => {
      todoList.add({ id: 1, title: "First" });
      todoList.add({ id: 2, title: "Second" });
      expect(todoList.list()).toHaveLength(2);
    });

    test("Should throw error when adding duplicate IDs", () => {
      todoList.add({ id: 1, title: "First" });
      expect(() => {
        todoList.add({ id: 1, title: "Duplicate" });
      }).toThrow("Duplicate ID: 1 already exists");

      const list = todoList.list();
      expect(list).toHaveLength(1);
      expect(list[0]).toEqual({ id: 1, title: "First" });
    });

    test("Should handle empty title", () => {
      expect(() => {
        todoList.add({ id: 1, title: "" });
      }).toThrow("Please enter a task");
    });
  });

  describe("getById method", () => {
    test("Should be defined", () => {
      expect(todoList.getById).toBeDefined();
    });

    test("Should return undefined for non-existent ID", () => {
      expect(todoList.getById(999)).toBeUndefined();
    });

    test("Should return the correct todo", () => {
      todoList.add({ id: 1, title: "First" });
      todoList.add({ id: 2, title: "Second" });

      expect(todoList.getById(2)).toEqual({ id: 2, title: "Second" });
    });

    test("Should not allow modifying the returned todo", () => {
      todoList.add({ id: 1, title: "Original" });
      const todo = todoList.getById(1);
      if (todo) todo.title = "Modified";

      expect(todoList.getById(1)?.title).toBe("Original");
    });
  });

  describe("remove method", () => {
    test("Should be defined", () => {
      expect(todoList.remove).toBeDefined();
    });

    test("Should throw an error for invalid ID types", () => {
      expect(() => todoList.remove(undefined as unknown as number)).toThrow(
        TypeError
      );

      expect(() => todoList.remove(NaN as unknown as number)).toThrow(
        TypeError
      );
    });

    test("Should not throw an error for non-existent ID", () => {
      expect(() => todoList.remove(999)).not.toThrow();
    });

    test("Should do nothing when removing non-existent ID", () => {
      todoList.add({ id: 1, title: "Test" });
      todoList.remove(999);

      expect(todoList.list()).toHaveLength(1);
    });

    test("Should remove the correct todo", () => {
      todoList.add({ id: 1, title: "First" });
      todoList.add({ id: 2, title: "Second" });
      todoList.add({ id: 3, title: "Third" });

      todoList.remove(2);

      const list = todoList.list();
      expect(list).toHaveLength(2);
      expect(list).toContainEqual({ id: 1, title: "First" });
      expect(list).toContainEqual({ id: 3, title: "Third" });
      expect(list).not.toContainEqual({ id: 2, title: "Second" });
    });
  });

  describe("removeAll method", () => {
    test("Should be defined", () => {
      expect(todoList.removeAll).toBeDefined();
    });

    test("Should remove all todos", () => {
      todoList.add({ id: 1, title: "First" });
      todoList.add({ id: 2, title: "Second" });
      todoList.add({ id: 3, title: "Third" });

      todoList.removeAll();

      expect(todoList.list()).toEqual([]);
    });

    test("Should work on empty list", () => {
      todoList.removeAll();
      expect(todoList.list()).toEqual([]);
    });

    test("Should allow adding todos after removeAll", () => {
      todoList.add({ id: 1, title: "First" });
      todoList.removeAll();
      todoList.add({ id: 2, title: "New" });

      expect(todoList.list()).toEqual([{ id: 2, title: "New" }]);
    });
  });

  describe("Performance tests", () => {
    test("Should handle a large number of todos", () => {
      const numTodos = 10000;
      for (let i = 1; i <= numTodos; i++) {
        todoList.add({ id: i, title: `Task ${i}` });
      }

      expect(todoList.list()).toHaveLength(numTodos);
      todoList.removeAll();
      expect(todoList.list()).toEqual([]);
    });
  });
});
