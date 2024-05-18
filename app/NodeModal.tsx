import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

const NodeModal = ({ node, onClose }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [links, setLinks] = React.useState([]);
  const [targetLink, setTargetLink] = React.useState(null);
  
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("data"));
    if (storedData && storedData.node) {
      setNodes(storedData.node);
    }
    if (storedData && storedData.links) {
      setLinks(storedData.links);
    }
  }, []);

  useEffect(() => {
    if (selectedValue) {
      const link = links.find((link) => link.target === selectedValue);
      setTargetLink(link);
    }
  }, [selectedValue, links]);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
    console.log(value)
  };
  const handleSelect = (value) => {
    const link = links.find((link) => link.target === value);
  
    if (link) {
      const updatedLink = { ...link, source: targetLink.source };
  
      const updatedLinks = links.map((l) => (l === link ? updatedLink : l));
  
      setLinks(updatedLinks);
      localStorage.setItem(
        "data",
        JSON.stringify({ ...JSON.parse(localStorage.getItem("data")), links: updatedLinks })
      );
  
      setTargetLink(updatedLinks.find((l) => l === updatedLink));
    }
  
    console.log(targetLink?.source, "<=", value);
  };
  if (!node) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{node.id}</DialogTitle>
          <DialogDescription>
            Contenido del nodo seleccionado
            <p>{node.group}</p>
            <p>{node.x}</p>
            <p>{node.y}</p>
            <p>{node.content}</p>
            <Select value={selectedValue} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Change connection" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem value={node.id} key={node.id}>
                    {node.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => handleSelect(node.id)}>Cambiar</Button>
        {targetLink && (
          <div>
            <p>Valor del enlace: {targetLink.value}</p>
          </div>
        )}
        <Button onClick={onClose}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NodeModal;
