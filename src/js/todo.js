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
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = +parenNode.dataset.id;
  const taskElement = todos.find((item) => item.id === parenNodeId);

  taskElement.completed = !taskElement.completed;
  parenNode.classList.toggle('todo__item--completed');
  globasUpdateTasks();
  initFilters();
};

const onClickRemoveTask = (evt) => {
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = +parenNode.dataset.id;
  todos = todos.filter((it) => it.id !== parenNodeId);
  parenNode.remove();
  globasUpdateTasks();
};

const clearCompleted = () => {
  buttonClearCompleted.addEventListener('click', () => {
    const element = document.querySelectorAll('.todo__item');
    element.forEach((item) => {
      if(!item.classList.contains('todo__item--completed')) {
        return;
      }
      item.remove();
      todos = todos.filter((task) => !task.completed);
      saveLocal(todos);
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
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = +parenNode.dataset.id;
  const parenText = parenNode.querySelector('.todo__text');
  const todo = todos.find((item) => item.id === parenNodeId);
  parenNode.classList.add('edit');
  parenText.setAttribute('contenteditable', true);
  parenNode.focus();
  // eslint-disable-next-line no-shadow
  parenText.addEventListener('keydown', (evt) => {
    if(parenText.innerHTML === '' && evt.key === 'Enter' || parenText.innerHTML === '' && evt.key === 'Escape') {
      todos = todos.filter((task) => task.id !== parenNodeId);
      parenNode.remove();
    }

    if(evt.key === 'Enter') {
      todo.title = parenText.textContent;
      parenText.removeAttribute('contenteditable');
      parenNode.classList.remove('edit');
    }

    if(evt.key === 'Escape') {
      parenText.textContent = todo.title;
      parenText.removeAttribute('contenteditable');
      parenNode.classList.remove('edit');
    }
    saveLocal(todos);
    getCount(todos);
  });

  // eslint-disable-next-line no-shadow
  document.addEventListener('click', (evt) => {
    if(evt.target.closest('.todo-app')) {
      return;
    }
    if(parenText.getAttribute('contenteditable')) {
      todo.title = parenText.textContent;
      parenText.removeAttribute('contenteditable');
      parenNode.classList.remove('edit');
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
