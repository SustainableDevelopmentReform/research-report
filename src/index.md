# Welcome to Observable Framework

Observable Framework is a powerful tool for creating data-driven reports and interactive dashboards.

## Getting Started

This template provides a starting point for your Observable Framework projects. It includes:

- **File-based routing**: Create pages by adding Markdown files to the `src/` directory
- **Data loaders**: Process data at build time with JavaScript data loaders
- **Interactive visualizations**: Use D3.js and Observable Plot for rich data visualizations
- **PDF export**: Convert your reports to professional PDFs

## Example Visualization

Here's a simple example using Observable Plot:

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
```

```js
// Generate some sample data
const data = d3.range(100).map(i => ({
  x: i,
  y: Math.sin(i / 10) * 20 + Math.random() * 10
}));
```

```js
// Create a line chart
Plot.plot({
  marks: [
    Plot.line(data, {x: "x", y: "y", stroke: "steelblue"}),
    Plot.dot(data, {x: "x", y: "y", fill: "steelblue"})
  ],
  grid: true,
  height: 400
})
```

## Project Structure

```
src/
├── index.md          # This file - the homepage
├── components/       # Reusable visualization components
│   ├── timeline.js   # Timeline visualization component
│   └── sankey-diagram.js # Sankey diagram component
└── data/            # Data loaders and static data files
    └── example.csv.js # Example data loader
```

## Next Steps

1. **Add pages**: Create new `.md` files in the `src/` directory
2. **Load data**: Add data loaders to `src/data/`
3. **Create visualizations**: Use the included components or create your own
4. **Build and deploy**: Run `npm run build` to generate a static site

## Resources

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [Observable Plot](https://observablehq.com/plot/)
- [D3.js](https://d3js.org/)

---

*Built with Observable Framework*