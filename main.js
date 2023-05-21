import './style.css';
import RenderTree from './tree';

let tree;
const onFormSubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const input = form.querySelector('input[type="text"]');
  if (tree) {
    tree.reset();
    tree = null;
  }
  if (input?.value.length > 0) {
    const nodes = input?.value.split(',') || [];
    tree = new RenderTree(
      nodes
        .map(n => n.trim())
        .filter(n => n.length > 0)
    );
    tree.init();
  }
}

document?.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form?.addEventListener('submit', onFormSubmit);
});
