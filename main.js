import './style.css';
import RenderTree from './tree';

const onFormSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="text"]');
  const nodes = input?.value.split(',') || [];
}

document?.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form?.addEventListener('submit', onFormSubmit);
  const tree = new RenderTree('1,2,3,4,5,6,7,8,9'.split(","));
  tree.init();
});
