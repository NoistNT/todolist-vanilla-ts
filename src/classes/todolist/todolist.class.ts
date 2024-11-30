export interface Todo {
  id: number;
  title: string;
}

export type TodoInput = Omit<Todo, "id"> & { id: number };

export class TodoList {
  private todos: Map<number, Readonly<Todo>> = new Map();

  add(todo: Omit<Todo, "id"> & Partial<Pick<Todo, "id">>) {
    if (typeof todo.id !== "number" || isNaN(todo.id)) {
      throw new TypeError("ID must be a number");
    }

    if (typeof todo.title !== "string") {
      throw new TypeError("Title must be a string");
    }

    if (todo.title.trim() === "") {
      throw new Error("Please enter a task");
    }

    const id = todo.id ?? Date.now();

    if (this.todos.has(id)) {
      throw new Error(`Duplicate ID: ${id} already exists`);
    }

    this.todos.set(id, { ...todo, id });
  }

  list() {
    return Array.from(this.todos.values()).map((todo) => ({ ...todo }));
  }

  getById(id: number) {
    return this.todos.has(id) ? { ...this.todos.get(id) } : undefined;
  }

  remove(id: number) {
    if (typeof id !== "number" || isNaN(id)) {
      throw new TypeError("ID must be a number");
    }

    this.todos.delete(id);
  }

  removeAll() {
    this.todos.clear();
  }
}
