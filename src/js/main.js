import '../scss/style.scss';
import { init, todos } from './todo.js';
import { renderTask } from './task.js';
import { initFilters } from './filter.js';
import { showButton } from './todo.js';
import { getCount } from './counter.js';

init();

if (localStorage.getItem('todos')) {
  todos.map((task) => {
    renderTask(task);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  showButton();
  getCount();
});
