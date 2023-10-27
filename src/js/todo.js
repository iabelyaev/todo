import { createTaskData } from './data.js';
import { getCount } from './counter.js';
import saveLocal from './local.js';
import { initFilters } from './filter.js';
import { renderTask } from './task.js';

const input = document.querySelector('.todo__new');
const buttonClearCompleted = document.querySelector('.filters__button');
const buttonArrow = document.querySelector('.todo__button');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const showToggleAll = () => {
  const hasEventEvery = todos.every((task) => task.completed);
  if(todos.length >= 1) {
    document.querySelector('.todo__button--control').style.display = 'flex';
  } else {
    document.querySelector('.todo__button--control').style.display = 'none';
  }
  buttonArrow.checked = hasEventEvery;
};

const onChangeCompletedTask = (evt) => {
  const parentNode = evt.target.closest('.todo__item');
  const parentNodeId = +parentNode.dataset.id;
  const taskElement = todos.find((item) => item.id === parentNodeId);

  taskElement.completed = !taskElement.completed;
  parentNode.classList.toggle('todo__item--completed');
  globasUpdateTasks();
  initFilters();
};

const onClickRemoveTask = (evt) => {
  const parentNode = evt.target.closest('.todo__item');
  const parentNodeId = +parentNode.dataset.id;
  todos = todos.filter((it) => it.id !== parentNodeId);
  parentNode.remove();
  globasUpdateTasks();
};

const clearCompleted = () => {
  buttonClearCompleted.addEventListener('click', () => {
    todos.forEach((item) => {
      if (!item.completed) {
        return;
      }
      todos = todos.filter((task) => !task.completed);
      saveLocal(todos);
      renderTask(todos);
    });
    showToggleAll();
  });
};

function onButtonClickArrow () {
  buttonArrow.addEventListener('change', () => {
    todos.forEach((item) => {
      const elements = document.querySelectorAll(`.todo__item[data-id="${item.id}"]`);
      if(buttonArrow.checked) {
        item.completed = true;
        elements.forEach((element) => {
          element.classList.add('todo__item--completed');
          element.querySelector('.todo__item-input').checked = true;
        });
      } else {
        item.completed = false;
        elements.forEach((element) => {
          element.classList.remove('todo__item--completed');
          element.querySelector('.todo__item-input').checked = false;
        });
      }
    });
    globasUpdateTasks();
    initFilters();
  });
}

const editOfTask = (evt) => {
  const parentNode = evt.target.closest('.todo__item');
  const parentNodeId = +parentNode.dataset.id;
  const parentText = parentNode.querySelector('.todo__text');
  const todo = todos.find((item) => item.id === parentNodeId);
  if (parentNode.classList.contains('todo__item--completed')) {
    return;
  }
  parentNode.classList.add('edit');
  parentText.setAttribute('contenteditable', true);
  parentText.focus();
  // eslint-disable-next-line no-shadow
  parentText.addEventListener('keydown', (evt) => {
    if(parentText.innerHTML === '' && evt.key === 'Enter' || parentText.innerHTML === '' && evt.key === 'Escape') {
      todos = todos.filter((task) => task.id !== parentNodeId);
      parentNode.remove();
    }

    if(evt.key === 'Enter') {
      todo.title = parentText.textContent;
      parentText.removeAttribute('contenteditable');
      parentNode.classList.remove('edit');
    }

    if(evt.key === 'Escape') {
      parentText.textContent = todo.title;
      parentText.removeAttribute('contenteditable');
      parentNode.classList.remove('edit');
    }
    saveLocal(todos);
    getCount(todos);
  });

  // eslint-disable-next-line no-shadow
  document.addEventListener('click', (evt) => {
    if(evt.target.closest('.todo-app')) {
      return;
    }
    if(parentText.getAttribute('contenteditable')) {
      todo.title = parentText.textContent;
      parentText.removeAttribute('contenteditable');
      parentNode.classList.remove('edit');
    }
    saveLocal(todos);
    getCount(todos);
  });

};

const addTask = () => {
  const newTodo = createTaskData();
  renderTask(newTodo);
  todos.push(newTodo);
  globasUpdateTasks();
  initFilters();
  input.value = '';
};

const init = () => {
  input.addEventListener('keydown', (evt) => {
    if (input.value.trim() === '') {
      return;
    }

    if (evt.key === 'Enter') {
      addTask();
    }
  });
  document.addEventListener('click', (evt) => {
    if (input.value.trim() === '' || evt.target.closest('.todo-app')) {
      return;
    }

    addTask();
  });
  clearCompleted();
  initFilters();
  onButtonClickArrow();
  showToggleAll();
};

function globasUpdateTasks() {
  getCount(todos);
  saveLocal(todos);
  showToggleAll();
}


export { init, todos, onClickRemoveTask, onChangeCompletedTask, editOfTask };
