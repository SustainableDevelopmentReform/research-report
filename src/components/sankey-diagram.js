import * as d3 from "npm:d3";
import {sankey, sankeyLinkHorizontal} from "npm:d3-sankey";

export function createSankeyDiagram(data, {
  width = 928,  // Standard Observable Framework width
  height = 750,  // More height for better spacing
  nodeWidth = 120,  // Width for outer nodes
  nodeWidthMiddle = 100,  // Width for middle nodes
  nodePadding = 20,  // Increased spacing between nodes
  margin = {top: 40, right: 10, bottom: 20, left: 10}  // Minimal margins
} = {}) {
  
  // Create SVG container
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif;");

  // Create sankey layout with custom node width function
  const sankeyLayout = sankey()
    .nodeId(d => d.id)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom - margin.top]]);

  // Process data
  const {nodes, links} = sankeyLayout({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // Save relative link positions before any adjustments
  links.forEach(link => {
    // Calculate relative position within source node (0 = top, 1 = bottom)
    link.sy = (link.y0 - link.source.y0) / (link.source.y1 - link.source.y0) || 0.5;
    // Calculate relative position within target node
    link.ty = (link.y1 - link.target.y0) / (link.target.y1 - link.target.y0) || 0.5;
  });
  
  // Adjust widths for middle column nodes only
  nodes.forEach(node => {
    if (node.category === "pillar") {
      const currentWidth = node.x1 - node.x0;
      const widthDiff = (currentWidth - nodeWidthMiddle) / 2;
      node.x0 += widthDiff;
      node.x1 -= widthDiff;
    }
  });
  
  // Apply minimum height to ensure text fits, expanding from center
  const minNodeHeight = 50; // Enough for 3-4 lines of wrapped text
  nodes.forEach(node => {
    const currentHeight = node.y1 - node.y0;
    if (currentHeight < minNodeHeight) {
      const center = (node.y0 + node.y1) / 2;
      node.y0 = center - minNodeHeight / 2;
      node.y1 = center + minNodeHeight / 2;
    }
  });
  
  // Only fix actual overlaps in each column with minimal movement
  const columns = d3.group(nodes, d => Math.round(d.x0));
  columns.forEach(columnNodes => {
    columnNodes.sort((a, b) => a.y0 - b.y0);
    
    for (let i = 1; i < columnNodes.length; i++) {
      const prevNode = columnNodes[i - 1];
      const currNode = columnNodes[i];
      const minGap = 5; // Small gap between nodes
      
      if (currNode.y0 < prevNode.y1 + minGap) {
        const overlap = (prevNode.y1 + minGap) - currNode.y0;
        // Only move the current node down, don't adjust previous nodes
        currNode.y0 += overlap;
        currNode.y1 += overlap;
      }
    }
  });
  
  // Align columns vertically to prevent CHM from being too high
  const columnGroups = Array.from(d3.group(nodes, d => Math.round(d.x0)).values());
  const targetTop = margin.top + 20; // Leave space for headers
  
  columnGroups.forEach(columnNodes => {
    const currentTop = d3.min(columnNodes, n => n.y0);
    if (currentTop < targetTop) {
      const adjustment = targetTop - currentTop;
      columnNodes.forEach(node => {
        node.y0 += adjustment;
        node.y1 += adjustment;
      });
    }
  });
  
  // Recalculate link positions using saved relative positions
  links.forEach(link => {
    // Use the saved relative positions to maintain link distribution
    link.y0 = link.source.y0 + (link.source.y1 - link.source.y0) * link.sy;
    link.y1 = link.target.y0 + (link.target.y1 - link.target.y0) * link.ty;
  });

  // Create harmonious color palette for OA components using blue-green spectrum
  const oaComponents = [
    "spatial-framework", "env-assets", "social-conditions", "produced-assets",
    "economic-flows", "social-activities", "env-flows", "pollution",
    "monetary-flows", "feedbacks", "final-services", "intermediate-services"
  ];
  
  // Light palette optimized for black text
  const oaColors = d3.scaleOrdinal()
    .domain(oaComponents)
    .range([
      "#c6dbef",  // Spatial - Very light blue
      "#b3d3e8",  // Env Assets - Light blue
      "#9ecae1",  // Social - Light blue
      "#85bcdb",  // Produced - Soft blue
      "#b2df8a",  // Economic - Light green
      "#a1d99b",  // Social Act - Light green
      "#90d17f",  // Env Flows - Soft green
      "#7fc97f",  // Pollution - Light green
      "#deebf7",  // Monetary - Palest blue
      "#eff3ff",  // Feedbacks - Nearly white blue
      "#c7e9b4",  // Final Services - Pale green
      "#e5f5e0"   // Intermediate - Palest green
    ]);
  
  // Create colors for BBNJ pillars
  const pillarColors = d3.scaleOrdinal()
    .domain(["mgr-pillar", "abmt-pillar", "eia-pillar", "cbtt-pillar"])
    .range([
      "#fdbf6f",  // MGR - Light orange
      "#cab2d6",  // ABMT - Light purple  
      "#fb9a99",  // EIA - Light pink/coral
      "#b2df8a"   // CBTT - Light green
    ]);
  
  // Node colors based on category
  const nodeColor = (d) => {
    if (d.category === "oa") return oaColors(d.id);
    if (d.category === "pillar") return pillarColors(d.id);
    if (d.category === "chm") return "#f0f0f0";  // Light gray for CHM
    return "#ccc";
  };

  // Add gradient definitions
  const defs = svg.append("defs");
  
  // No gradients needed - links will use source color directly

  // Add links - colored by source node with borders
  const link = svg.append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("g");
  
  // Add black border for each link (hidden by default, shown on hover)
  link.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", "#000")
    .attr("stroke-width", d => Math.max(1, d.width) + 0.5)
    .attr("opacity", 0)
    .attr("class", "link-border");
  
  // Add colored link
  link.append("path")
    .attr("d", sankeyLinkHorizontal())
    .attr("stroke", d => {
      // Use the color of the source node
      if (d.source.category === "oa") {
        return oaColors(d.source.id);
      }
      // For links from pillars, use the pillar's color
      if (d.source.category === "pillar") {
        return pillarColors(d.source.id);
      }
      return "#999";  // Default gray
    })
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("opacity", 0.5)
    .attr("class", "link-path")
    .on("mouseover", function() {
      d3.select(this).attr("opacity", 0.8);
    })
    .on("mouseout", function() {
      d3.select(this).attr("opacity", 0.5);
    });

  // Add link titles
  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}`);

  // Add nodes with hover interactions
  const node = svg.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => nodeColor(d))
    .attr("opacity", 1)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 1)
    .attr("class", "node")
    .on("mouseover", function(event, d) {
      // Show black borders for connected links and fade non-connected
      svg.selectAll(".link-border")
        .attr("opacity", linkData => {
          if (linkData.source === d || linkData.target === d) {
            return 1;  // Full opacity for black border
          }
          return 0;  // Hide for non-connected
        });
      
      // Fade non-connected colored links significantly
      svg.selectAll(".link-path")
        .attr("opacity", linkData => {
          // Full opacity for connected links, fade others
          if (linkData.source === d || linkData.target === d) {
            return 1;  // Full opacity
          }
          return 0.02;  // Almost invisible for non-connected
        });
      
      // Fade non-connected nodes significantly
      svg.selectAll(".node")
        .attr("opacity", nodeData => {
          if (nodeData === d) return 1;
          // Check if connected
          const isConnected = links.some(l => 
            (l.source === d && l.target === nodeData) ||
            (l.target === d && l.source === nodeData)
          );
          return isConnected ? 1 : 0.08;  // Much fainter for non-connected
        });
      
      // Fade text for non-connected nodes
      svg.selectAll(".node-label")
        .attr("opacity", nodeData => {
          if (nodeData === d) return 1;
          const isConnected = links.some(l => 
            (l.source === d && l.target === nodeData) ||
            (l.target === d && l.source === nodeData)
          );
          return isConnected ? 1 : 0.08;  // Much fainter
        });
    })
    .on("mouseout", function() {
      // Hide all link borders
      svg.selectAll(".link-border")
        .attr("opacity", 0);
      
      // Reset all colored links to normal
      svg.selectAll(".link-path")
        .attr("opacity", 0.5);
      
      // Reset all nodes to normal
      svg.selectAll(".node")
        .attr("opacity", 1);
      
      // Reset all text to normal
      svg.selectAll(".node-label")
        .attr("opacity", 1);
    });

  // Add node titles
  node.append("title")
    .text(d => d.name);

  // Add node labels - different handling for middle column
  const labels = svg.append("g")
    .style("font", "11px sans-serif")
    .style("pointer-events", "none")  // Prevent text from interfering with mouse events
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node-label");

  // All labels inside nodes with text wrapping
  labels.each(function(d) {
    const group = d3.select(this);
    const text = group.append("text")
      .attr("x", (d.x0 + d.x1) / 2)
      .attr("y", (d.y1 + d.y0) / 2)
      .attr("text-anchor", "middle")
      .style("fill", "#333")  // All black text for readability
      .style("font-weight", "normal")  // Remove bold
      .style("font-size", "10px");  // Uniform size for all nodes

    // Split text into lines for wrapping
    const words = d.name.split(/[\s&]+/);  // Also split on &
    const lineHeight = 1.15;
    const maxWidth = (d.x1 - d.x0) - 20; // more padding
    
    let line = [];
    let lineNumber = 0;
    const lines = [];
    
    // Better text wrapping algorithm
    words.forEach(word => {
      line.push(word);
      const testLine = line.join(" ");
      const testWidth = testLine.length * 7; // better approximation
      
      if (testWidth > maxWidth && line.length > 1) {
        line.pop();
        lines.push(line.join(" "));
        line = [word];
        lineNumber++;
      }
    });
    if (line.length > 0) {
      lines.push(line.join(" "));
    }
    
    // For middle nodes with shortName, use that instead
    const finalLines = d.shortName ? d.shortName.split('\n') : lines;
    
    // Add tspans for each line
    text.text(null);
    finalLines.forEach((line, i) => {
      text.append("tspan")
        .attr("x", (d.x0 + d.x1) / 2)
        .attr("y", (d.y1 + d.y0) / 2)
        .attr("dy", `${(i - (finalLines.length - 1) / 2) * lineHeight}em`)
        .text(line);
    });
  });

  // Add category labels
  const categoryLabels = [
    {text: "Ocean Accounts", x: margin.left + nodeWidth/2, y: 25},
    {text: "BBNJ Pillars", x: width / 2, y: 25},
    {text: "CHM Functions", x: width - margin.right - nodeWidth/2, y: 25}
  ];

  svg.append("g")
    .style("font", "14px sans-serif")
    .style("font-weight", "normal")
    .selectAll("text")
    .data(categoryLabels)
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("text-anchor", "middle")
    .text(d => d.text)
    .style("fill", "#444");

  return svg.node();
}