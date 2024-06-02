# canvas-obsidian in React

This project implements a force-directed graph visualization using the D3.js library in a React application. The visualization displays nodes connected by links, where the nodes are interactive elements that can be dragged, and clicking on them opens a modal with additional information.

## Features

- **Force-directed Graph Visualization**: Nodes and links are automatically positioned on the canvas using the D3.js force simulation.
- **Node Interaction**: Nodes can be dragged to rearrange the graph. Clicking on a node opens a modal with additional information about that node.
- **Node Information Modal**: Displays details such as the node's ID, group, coordinates (x, y), and content of the selected node. It also allows changing the connection of the node to another existing node.
- **Local Data Storage**: The graph data (nodes and links) is stored in the browser's local storage, allowing the visualization to persist across page reloads.
- **Add New Nodes**: A new node can be added to the graph using a button in the interface.

## Main Components

1. **ForceDirectedGraph**: This component renders the force-directed graph using D3.js. It receives the graph data as props and handles node interaction.

2. **NodeModal**: This component displays a modal with detailed information about the selected node. It also allows changing the connection of the node to another existing node.

3. **Home**: This is the main component of the application. It's responsible for fetching the graph data from local storage, managing the state of the modal, and providing the functionality to add new nodes.

## Installation and Running

1. Clone this repository to your local machine.
2. Navigate to the project directory: `cd graphviz-react`.
3. Install dependencies by running: `npm install`.
4. Start the application with: `npm run dev`.
5. Open your browser and visit `http://localhost:3000` to see the application in action.

## Main Dependencies

- **React**: JavaScript library for building user interfaces.
- **D3.js**: Data visualization library for creating interactive graphs on the web.
- **Tailwind CSS**: Utility-first CSS framework for styling React components.

Sure, here's an explanation of how the data is transformed and what is needed in the `ForceDirectedGraph` component, in English:

In the `ForceDirectedGraph` component, the data transformation process and the required data structure are as follows:

1. **Data Structure**: The component expects the data to be in the following format:

```javascript
const data = {
  links: [
    { source: "node1", target: "node2", value: 1 },
    { source: "node2", target: "node3", value: 2 },
    // ...
  ],
  node: [
    { id: "node1", group: 1, content: "Node 1 Content" },
    { id: "node2", group: 2, content: "Node 2 Content" },
    // ...
  ]
};
```

The `links` array contains objects representing the connections between nodes, with `source` and `target` properties indicating the nodes being connected, and `value` representing the strength or weight of the connection.

The `node` array contains objects representing the nodes themselves, with `id`, `group`, and `content` properties. The `id` property is a unique identifier for the node, `group` is a grouping or categorization of the node, and `content` is the textual content or label of the node.

2. **Data Transformation**: In the `useEffect` hook, the component transforms the raw data into a format suitable for D3.js. Here's how it's done:

```javascript
const links = data.links.map(d => ({ ...d }));
const nodes = data.node.map(d => ({ ...d }));
```

This step creates new arrays `links` and `nodes` by spreading the original data objects, ensuring that any modifications made to these new arrays won't affect the original data.

3. **Force Simulation Setup**: The component then sets up the D3.js force simulation using the transformed data:

```javascript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(200))
  .force('charge', d3.forceManyBody().strength(-150))
  .force('collide', d3.forceCollide().radius(30))
  .force('x', d3.forceX())
  .force('y', d3.forceY());
```

The `forceSimulation` function creates a new force simulation instance, passing in the `nodes` array. Various forces are added to the simulation, such as `link` force for connections between nodes, `charge` force for node repulsion, `collide` force to prevent node overlapping, and `x` and `y` forces for centering the nodes.

4. **Rendering**: The component then renders the SVG canvas and appends the nodes and links using D3.js selections and data bindings. It also sets up event handlers for node interactions, such as dragging and mouse over/out effects.

5. **Simulation Tick**: On each tick of the simulation, the component updates the positions of the nodes and links based on the new force calculations:

```javascript
simulation.on('tick', () => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);

  node.attr('transform', d => `translate(${d.x},${d.y})`);
});
```

This code updates the `x1`, `y1`, `x2`, and `y2` attributes of the links based on the new positions of the source and target nodes, and updates the `transform` attribute of the nodes to reflect their new positions.

In summary, the `ForceDirectedGraph` component expects the data in a specific format with `links` and `node` arrays. It then transforms this data, sets up the force simulation, renders the SVG canvas with nodes and links, and updates their positions on each simulation tick based on the force calculations.