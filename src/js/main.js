import { init, todos } from './todo.js';
import { renderTask } from './task.js';
import { initFilters } from './filter.js';
import { getCount } from './counter.js';
import { toggleTheme } from './theme.js';
init();

if (localStorage.getItem('todos')) {
  todos.forEach((task) => {
    renderTask(task);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  getCount(todos);
  toggleTheme();
});
