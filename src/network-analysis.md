# Network Analysis

Network visualizations reveal relationships and flows in complex systems[^1]. This page demonstrates various network analysis techniques.

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {SankeyDiagram} from "./components/sankey-diagram.js";
```

## Research Collaboration Network

```js
// Generate collaboration network data
const nodes = [
  {id: "Lab A", group: "University"},
  {id: "Lab B", group: "University"},
  {id: "Lab C", group: "University"},
  {id: "Institute X", group: "Research Institute"},
  {id: "Institute Y", group: "Research Institute"},
  {id: "Company 1", group: "Industry"},
  {id: "Company 2", group: "Industry"},
  {id: "Gov Agency", group: "Government"}
];

const links = [
  {source: "Lab A", target: "Lab B", value: 15},
  {source: "Lab A", target: "Institute X", value: 8},
  {source: "Lab B", target: "Lab C", value: 12},
  {source: "Lab B", target: "Company 1", value: 5},
  {source: "Lab C", target: "Institute Y", value: 10},
  {source: "Institute X", target: "Institute Y", value: 20},
  {source: "Institute X", target: "Gov Agency", value: 7},
  {source: "Institute Y", target: "Company 2", value: 9},
  {source: "Company 1", target: "Company 2", value: 6},
  {source: "Company 2", target: "Gov Agency", value: 11}
];
```

## Sankey Diagram: Research Funding Flow

```js
// Prepare data for Sankey diagram
const sankeyData = {
  nodes: nodes.map(n => ({...n, name: n.id})),
  links: links.map(l => ({
    source: nodes.findIndex(n => n.id === l.source),
    target: nodes.findIndex(n => n.id === l.target),
    value: l.value
  }))
};
```

```js
SankeyDiagram(sankeyData, {
  title: "Research Collaboration Network",
  width: 900,
  height: 500,
  nodeWidth: 15,
  nodePadding: 10
})
```

## Citation Network Analysis

```js
// Generate citation network
const papers = d3.range(20).map(i => ({
  id: `Paper ${i + 1}`,
  year: 2015 + Math.floor(i / 4),
  citations: Math.floor(Math.random() * 50) + 5,
  field: ["Physics", "Chemistry", "Biology", "Computer Science"][Math.floor(Math.random() * 4)]
}));

const citationLinks = [];
papers.forEach((paper, i) => {
  // Each paper cites 2-5 earlier papers
  const numCitations = Math.floor(Math.random() * 3) + 2;
  for (let j = 0; j < numCitations && i > 0; j++) {
    const targetIndex = Math.floor(Math.random() * i);
    citationLinks.push({
      source: paper.id,
      target: papers[targetIndex].id,
      year: paper.year
    });
  }
});
```

```js
Plot.plot({
  title: "Citation Network Structure",
  subtitle: "Papers and their citation relationships",
  width: 800,
  height: 600,
  marginTop: 40,
  marginBottom: 40,
  marks: [
    Plot.link(citationLinks, {
      x1: d => papers.find(p => p.id === d.source).year,
      y1: d => papers.find(p => p.id === d.source).citations,
      x2: d => papers.find(p => p.id === d.target).year,
      y2: d => papers.find(p => p.id === d.target).citations,
      stroke: "gray",
      strokeOpacity: 0.3
    }),
    Plot.dot(papers, {
      x: "year",
      y: "citations",
      r: d => Math.sqrt(d.citations),
      fill: "field",
      tip: true
    }),
    Plot.text(papers.filter(p => p.citations > 30), {
      x: "year",
      y: "citations",
      text: "id",
      dy: -10,
      fontSize: 8
    })
  ]
})
```

## Network Metrics

```js
// Calculate network metrics
const degree = {};
links.forEach(link => {
  degree[link.source] = (degree[link.source] || 0) + 1;
  degree[link.target] = (degree[link.target] || 0) + 1;
});

const metricsTable = nodes.map(node => ({
  Node: node.id,
  Type: node.group,
  Degree: degree[node.id] || 0,
  Connections: links.filter(l => l.source === node.id || l.target === node.id).length
}));
```

```js
Inputs.table(metricsTable, {
  columns: ["Node", "Type", "Degree", "Connections"],
  sort: "Degree",
  reverse: true
})
```

## Applications

Network analysis is crucial for understanding[^2]:

- **Collaboration Patterns**: Co-authorship networks
- **Knowledge Transfer**: Citation and reference networks
- **Resource Flow**: Funding and grant networks
- **Social Networks**: Research community structure

---

[^1]: Network science provides tools for analyzing complex relational data. Newman, M.E.J. (2010). Networks: An Introduction. Oxford University Press.

[^2]: For applications in research evaluation, see: Börner, K., et al. (2018). Science Visualization: Transforming Data into Insights. MIT Press.