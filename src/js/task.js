import { createElement } from './utils.js';

const todoList = document.querySelector('.todo__list');

const createTask = (id, title, completed = false) => {
  const task = createElement('li', 'todo__item');
  task.setAttribute('data-id', id);
  const labelTask = createElement('label');
  const inputTask = createElement('input', 'visually-hidden');
  inputTask.classList.add('todo__item-input');
  inputTask.type = 'checkbox';
  inputTask.checked = completed;
  const spanTask = createElement('span', 'todo__item-input');
  spanTask.classList.add('todo__item-input--control');
  const textTask = createElement('p', 'todo__text', title);
  textTask.setAttribute('spellcheck', false);

  const buttonTask = createElement('button', 'todo__item-close');
  buttonTask.type = 'button';
  labelTask.append(inputTask, spanTask);

  task.append(labelTask, textTask, buttonTask);

  return task;
};

const renderTask = (data) => {
  if (Array.isArray(data)) {
    todoList.innerHTML = '';
    data.forEach((item) => {
      renderTask(item);
    });
  } else {
    const { id, title, completed } = data;
    const element = createTask(id, title, completed);

    if(completed) {
      element.classList.add('todo__item--completed');
    }

    todoList.append(element);
    return element;
  }
};


export { createTask, renderTask };
