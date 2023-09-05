import { createTaskData } from './data.js';
import { getCount } from './counter.js';
import { saveLocal } from './local.js';
import { initFilters } from './filter.js';
import { renderTask } from './task.js';

const input = document.querySelector('.todo__new');
const todoList = document.querySelector('.todo__list');
const buttonClearCompleted = document.querySelector('.filters__button');
const buttonStrelka = document.querySelector('.todo__button');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const showButton = () => {
  const elements = document.querySelectorAll('.todo__item');
  const hasEventSome = todos.some((task) => task.completed === true);
  buttonClearCompleted.style.display = 'none';
  elements.forEach(() => {
    if(hasEventSome) {
      buttonClearCompleted.style.display = 'block';
    } else {
      buttonClearCompleted.style.display = 'none';
    }
  });
};

const showToggleAll = () => {
  const hasEventEvery = todos.every((task) => task.completed === true);
  document.querySelector('.todo__button--control').style.display = 'none';
  if(todos.length >= 1) {
    document.querySelector('.todo__button--control').style.display = 'block';
  } else {
    document.querySelector('.todo__button--control').style.display = 'none';
  }

  if (hasEventEvery) {
    buttonStrelka.checked = true;
  } else {
    buttonStrelka.checked = false;
  }
  showButton();
};

const completedTask = (evt) => {
  if (!evt.target.classList.contains('todo__item-input')) {
    return;
  }
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  const taskElement = todos.find((item) => item.id === parenNodeId);

  taskElement.completed = !taskElement.completed;
  parenNode.classList.toggle('todo__item--completed');
  getCount();
  saveLocal();
  showButton();
  showToggleAll();
  initFilters();
};

const deleteTask = (evt) => {
  if (!evt.target.classList.contains('todo__item-close')) {
    return;
  }

  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  todos = todos.filter((it) => it.id !== parenNodeId);
  parenNode.remove();
  showButton();
  showToggleAll();
  getCount();
  saveLocal();
};

const clearCompleted = () => {
  buttonClearCompleted.addEventListener('click', () => {
    const element = document.querySelectorAll('.todo__item');
    element.forEach((item) => {
      if(!item.classList.contains('todo__item--completed')) {
        return;
      }
      item.remove();
      todos = todos.filter((task) => task.completed !== true);
      saveLocal();
    });
    showButton();
    showToggleAll();
  });
};

function onButtonClickStrelka () {
  buttonStrelka.addEventListener('change', () => {
    todos.forEach((item) => {
      const elements = document.querySelectorAll(`.todo__item[data-id="${item.id}"]`);
      if(buttonStrelka.checked) {
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
    getCount();
    showButton();
    showToggleAll();
    saveLocal();
  });
}
const getTodoData = (id) => todos.find((task) => task.id === Number(id));

const editOfTask = (evt) => {
  if(!evt.target.classList.contains('todo__text')) {
    return;
  }
  const parenNode = evt.target.closest('.todo__item');
  const parenNodeId = Number(parenNode.dataset.id);
  const parenText = parenNode.querySelector('.todo__text');
  parenNode.classList.add('edit');
  parenText.setAttribute('contenteditable', true);
  parenNode.focus();
  parenText.addEventListener('keyup', () => {
    const todo = getTodoData(parenNodeId);
    todo.title = parenText.textContent;
    saveLocal();
  });

  // eslint-disable-next-line no-shadow
  parenText.addEventListener('keydown', (evt) => {
    if (parenText.innerHTML === '' && evt.key === 'Enter') {
      todos = todos.filter((task) => task.id !== parenNodeId);
      parenNode.remove();
    }

    if(evt.key === 'Enter') {
      parenText.setAttribute('contenteditable', false);
    }
    saveLocal();
    getCount();
  });

  document.addEventListener('click', () => {

    if (parenText.innerHTML === '') {
      todos = todos.filter((task) => task.id !== parenNodeId);
      parenNode.remove();
    }

    saveLocal();
    getCount();
  });

  showButton();
};

const init = () => {
  input.addEventListener('keydown', (evt) => {
    if (input.value === '') {
      return;
    }

    if (evt.key === 'Enter') {
      const newTodo = createTaskData();
      renderTask(newTodo);
      todos.push(newTodo);
      saveLocal();
      getCount();
      initFilters();
      showToggleAll();
      input.value = '';
    }
  });
  clearCompleted();
  initFilters();
  onButtonClickStrelka();
  showToggleAll();

  todoList.addEventListener('change', completedTask);
  todoList.addEventListener('click', deleteTask);
  todoList.addEventListener('dblclick', editOfTask);
};


export { init, todos, showButton, showToggleAll, onButtonClickStrelka };
