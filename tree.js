import { hierarchy, select, tree as d3Tree } from 'd3';

class Node {
  constructor(val) {
    this.value = val;
    this.left = null;
    this.right = null;
  }
}

class RenderTree {
  #tree;
  #treeData = {};
  #activePath = new Set();
  #svg;
  #d3Data;
  constructor(nodes) {
    this.nodes = nodes;
  }

  get tree() {
    return this.#tree;
  }

  set tree(nodes) {
    this.#tree = nodes;
  }

  get treeData() {
    return this.#treeData;
  }

  set treeData(data) {
    this.#treeData = data;
  }

  get activePath() {
    return this.#activePath;
  }

  set activePath(data) {
    this.#activePath = data;
    this.treeData = this.walk(this.tree);
    this.draw();
  }

  static createTree(nodes, index = 0) {
    if (!nodes[index]) return null;
    const node = new Node(nodes[index]);
    node.left = RenderTree.createTree(nodes, 2 * index + 1);
    node.right = RenderTree.createTree(nodes, 2 * index + 2);

    return node;
  }

  walk(curr) {
    if (!curr) return;
    const data = {
      name: curr.value,
      value: curr.value,
      onPath: this.#activePath.has(curr.value)
    }
    const lc = this.walk(curr.left);
    const rc = this.walk(curr.right);
    if (lc || rc) {
      data.children = [];
      if (lc) data.children.push(lc);
      if (rc) data.children.push(rc);
    }

    return data;
  }

  static findPath(root, arr = [], needle) {
    if (!root) return false;
    arr.push(root.value);
    const isRoot = root.value === needle;
    const foundInLeftSubtree = RenderTree.findPath(root.left, arr, needle);
    const foundInRightSubtree = RenderTree.findPath(root.right, arr, needle)
    if (isRoot || foundInLeftSubtree || foundInRightSubtree) return true;
    arr.pop();
    return false;
  }

  onNodeClick(node) {
    const self = this;
    self.activePath.clear();
    let pathsArray = [];
    const hasPath = RenderTree.findPath(self.tree, pathsArray, node.data.value);
    if (hasPath) {
      const _newPath = new Set();
      pathsArray.forEach(p => _newPath.add(p));
      self.activePath = _newPath;
    }
  }

  drawNodes() {
    const self = this;
    const circles = this.#svg.append("g")
      .selectAll("circle")
      .data(this.#d3Data.descendants());
    circles
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 5)
      .merge(circles)
      .attr("fill", (d) => {
        return self.activePath.has(d.data.value) ? 'green' : 'black';
      })
      .on("click", function (e, node) {
        e.stopPropagation();
        self.onNodeClick(node);
      });
    
    circles.exit().remove();
  }

  drawEdges() {
    const self = this;
    const connections = this.#svg
      .append("g")
      .selectAll("path")
      .data(this.#d3Data.links());
    connections
      .enter()
      .append("path")
      .merge(connections)
      .attr("stroke", ({ source, target }) => {
        if (self.activePath.has(source.data.value) && self.activePath.has(target.data.value)) {
          return "green";
        }

        return "black";
      })
      .attr("d", function (d) {
        return "M" + d.source.x + "," + d.source.y + "C" +
          d.source.x + "," + d.source.y + " " +
          d.target.x + "," + d.target.y + " " +
          d.target.x + "," + d.target.y;
      })
  }

  addText() {
    const names = this.#svg
      .append("g")
      .selectAll("text")
      .data(this.#d3Data.descendants());
    names
      .enter()
      .append("text")
      .text((d) => d.data.child)
      .attr("x", (d) => d.x + 7)
      .attr("y", (d) => d.y + 5)
      .text(d => d.data.name);
  }

  draw() {
    let nodes = hierarchy(this.treeData, d => d.children);
    const treeStructure = d3Tree().size([600, 600]);
    this.#d3Data = treeStructure(nodes);
    this.drawEdges();
    this.drawNodes();
    this.addText();
  }

  init() {
    this.tree = RenderTree.createTree(this.nodes);
    this.treeData = this.walk(this.tree);
    this.#svg = select("body")
      .append("svg")
      .attr("width", 800)
      .attr("height", 800)
      .append("g")
      .attr("transform", "translate(50,50)");
    this.draw();
  }
}

export default RenderTree;
