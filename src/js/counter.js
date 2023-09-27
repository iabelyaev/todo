const countLeft = document.querySelector('.count');

export const getCount = (todos) => {
  let count = 0;
  todos.forEach((element) => {
    if(!element.completed) {
      count++;
    }
  });
  countLeft.textContent = count;
};
