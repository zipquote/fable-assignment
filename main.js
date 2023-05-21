import './style.css';
import RenderTree from './tree';

const onFormSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="text"]');
  const nodes = input?.value.split(',') || [];
  const tree = new RenderTree(nodes.map(n => n.trim()));
  tree.init();
}

document?.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form?.addEventListener('submit', onFormSubmit);
});
