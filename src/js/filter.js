import { todos } from './todo.js';
import { renderTask } from './task.js';
const Filter = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};
const filters = document.querySelector('.filters');
let activeFilter = document.querySelector('.filters__link--active');
const ACTIVE_CLASS = 'filters__link--active';

const filterActive = (todo) => !todo.completed;

const filterCompleted = (todo) => todo.completed;

const getFilteredItems = (filterName) => {
  switch(filterName) {
    case Filter.ACTIVE:
      return [...todos].filter(filterActive);
    case Filter.COMPLETED:
      return [...todos].filter(filterCompleted);
    case Filter.ALL:
      return [...todos];
  }
};

const toggleFilter = (filtersName) => {
  activeFilter.classList.remove(ACTIVE_CLASS);
  activeFilter = document.querySelector(`#${filtersName}`);
  activeFilter.classList.add(ACTIVE_CLASS);
};

const initFilters = () => {
  const filterNames = localStorage.getItem('filter') ?? 'all';
  toggleFilter(filterNames);
  const data = getFilteredItems(filterNames);
  renderTask(data);

  filters.addEventListener('click', (evt) => {
    if(!evt.target.classList.contains('filters__link')) {
      return;
    }

    const target = evt.target;
    const filterName = target.id;
    toggleFilter(filterName);

    localStorage.setItem('filter', filterName);
    const dataTodo = getFilteredItems(filterName);
    renderTask(dataTodo);
  });
};

export { initFilters };
