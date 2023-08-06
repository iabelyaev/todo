import { todos } from './todo.js';

const saveLocal = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export { saveLocal };
