const saveLocal = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export default saveLocal;
