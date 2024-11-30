import { TodoList } from "@/classes/todolist/todolist.class";
import { TodoListUI } from "@/classes/todolistui/todolistui.class";
import "@/style.css";

const todoList = new TodoList();
const ui = new TodoListUI(todoList);

ui.displayList();
ui.bindEvents();
