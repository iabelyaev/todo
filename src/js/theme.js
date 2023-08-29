
const element = document.querySelector('.page');
const btn = document.querySelector('.button-theme');

const toggleTheme = () => {
  element.setAttribute('data-theme', 'dark');
  btn.addEventListener('click', () => {
    const themeValue = element.dataset.theme;
    if (themeValue === 'dark') {
      element.setAttribute('data-theme', 'light');
    } else {
      element.setAttribute('data-theme', 'dark');
    }
  });
};

export { toggleTheme };
