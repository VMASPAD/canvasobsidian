import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ForceDirectedGraph = ({ data, onNodeClick }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data.links || !data.node) {
      console.error('Los datos de enlaces y nodos son requeridos');
      return;
    }

    const width = 1280;
    const height = 720;

    const links = data.links.map(d => ({ ...d }));
    const nodes = data.node.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(200))
    .force('charge', d3.forceManyBody().strength(-150))
    .force('collide', d3.forceCollide().radius(30))
    .force('x', d3.forceX())
    .force('y', d3.forceY());
  

    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('stroke', '#b3b3b3')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    const link = svg
      .append('g')
      .attr('stroke', '#b3b3b3')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg
      .append('g')
      .attr('stroke', '#b3b3b3')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    node.append('circle')
      .attr('r', 15)
      .attr('fill', '#b3b3b3')
      .on('click', (event, d) => onNodeClick(d))
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'purple')
          .attr('fill', 'purple');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#b3b3b3')
          .attr('fill', '#b3b3b3');
      });

    node.append('text')
      .text(d => d.id)
      .attr('x', -20)
      .attr('y', 40)
      .attr('fill', 'black');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return <div className="border-2 border-red-600" ref={svgRef} />;
};

export default ForceDirectedGraph;
