const todoInput = document.querySelector('.todo__new');

const createTaskData = () => {
  const text = todoInput.value;
  return {
    id: Date.now(),
    title: text,
    completed: false
  };
};

export { createTaskData };
