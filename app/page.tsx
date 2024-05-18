"use client"
import ForceDirectedGraph from './ForceDirected';
import { useState, useEffect } from "react";
import NodeModal from "./NodeModal"
import { Button } from "@/components/ui/button";
export default function Home() {
  const [data, setData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = JSON.parse(localStorage.getItem("data"))
        console.log(res)
        setData(res);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
    fetchData();
  }, []);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const closeModal = () => {
    setSelectedNode(null);
  };

  function AddNode() {
    const storedData = JSON.parse(localStorage.getItem('data')) || { node: [], links: [] };
  
    const nodeCount = storedData.node.length + 1;
  
    const nodeId = `node${nodeCount}`;
    const newNode = { id: nodeId, group: 1, content: nodeId };
  
    storedData.node.push(newNode);
  
    const newLink = { source: `node${nodeCount}`, target: `node${nodeCount}`, value: nodeCount };
  
    storedData.links.push(newLink);
    localStorage.setItem('data', JSON.stringify(storedData));
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Canvas Obsidian</h1>
      <Button onClick={() => AddNode()}>Añadir Node</Button>
      {data ? (
        <>
          <ForceDirectedGraph data={data} onNodeClick={handleNodeClick} />
          <NodeModal node={selectedNode} onClose={closeModal} />
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}
