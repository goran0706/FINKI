class Graph {
  constructor() {
    this.nodes = new Map(); // Use a Map to store nodes and their adjacent nodes
  }

  // Add a node to the graph
  addNode(value) {
    if (!this.nodes.has(value)) {
      this.nodes.set(value, []);
    }
  }

  // Add an undirected edge between two nodes
  addEdge(nodeA, nodeB) {
    if (!this.nodes.has(nodeA) || !this.nodes.has(nodeB)) {
      console.error("Node not found in the graph.");
      return;
    }
    this.nodes.get(nodeA).push(nodeB);
    this.nodes.get(nodeB).push(nodeA);
  }

  // Get the neighbors of a node
  getNeighbors(node) {
    if (this.nodes.has(node)) {
      return this.nodes.get(node);
    }
    return [];
  }

  // Check if the graph contains a specific node
  containsNode(node) {
    return this.nodes.has(node);
  }
}

// Example usage:
const graph = new Graph();

graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "C");

console.log("Graph nodes and their neighbors:");
for (const [node, neighbors] of graph.nodes) {
  console.log(`${node} -> ${neighbors.join(", ")}`);
}

console.log("Does the graph contain node 'A'? " + graph.containsNode("A"));
console.log("Neighbors of 'A': " + graph.getNeighbors("A").join(", "));
console.log("Neighbors of 'B': " + graph.getNeighbors("B").join(", "));
console.log("Neighbors of 'C': " + graph.getNeighbors("C").join(", "));
