# Research Report Publishing Platform

Welcome to the **Research Report Publishing Platform** - a modern framework for creating interactive data visualizations and professional research reports. This platform combines the power of Observable Framework with sophisticated PDF generation to bridge the gap between dynamic web dashboards and traditional academic publishing.

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
```

## Platform Overview

This demonstration site showcases the capabilities of combining **Observable Framework** with academic research workflows. Navigate through the examples in the sidebar to explore different visualization types and report formats.

### Quick Statistics Dashboard

```js
// Generate sample metrics for dashboard
const metrics = {
  papers: 1247,
  citations: 8934,
  hIndex: 42,
  collaborators: 186
};

const monthlyData = d3.range(12).map(i => ({
  month: d3.timeFormat("%b")(new Date(2024, i)),
  publications: Math.floor(Math.random() * 20) + 80,
  citations: Math.floor(Math.random() * 500) + 700
}));
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Publications</h2>
    <span class="big">${metrics.papers.toLocaleString()}</span>
    <span class="muted">Total papers</span>
  </div>
  <div class="card">
    <h2>Citations</h2>
    <span class="big">${metrics.citations.toLocaleString()}</span>
    <span class="muted">Total citations</span>
  </div>
  <div class="card">
    <h2>h-index</h2>
    <span class="big">${metrics.hIndex}</span>
    <span class="muted">Research impact</span>
  </div>
  <div class="card">
    <h2>Collaborators</h2>
    <span class="big">${metrics.collaborators}</span>
    <span class="muted">Co-authors</span>
  </div>
</div>

### Research Output Trends

```js
Plot.plot({
  title: "Monthly Research Metrics (2024)",
  subtitle: "Publications and citations by month",
  marginLeft: 60,
  height: 300,
  y: {grid: true},
  marks: [
    Plot.barY(monthlyData, {
      x: "month",
      y: "publications",
      fill: "steelblue",
      tip: true
    }),
    Plot.lineY(monthlyData, {
      x: "month", 
      y: "citations",
      stroke: "orange",
      strokeWidth: 2,
      marker: true
    }),
    Plot.text(monthlyData, Plot.selectLast({
      x: "month",
      y: "citations",
      text: ["Citations"],
      textAnchor: "start",
      dx: 10,
      fill: "orange"
    })),
    Plot.text(monthlyData, Plot.selectLast({
      x: "month",
      y: "publications", 
      text: ["Publications"],
      textAnchor: "start",
      dx: 10,
      fill: "steelblue"
    }))
  ]
})
```

## Key Features

### 📊 Rich Data Visualizations
Explore our comprehensive visualization examples including statistical plots, time series analysis, geographic maps, and network diagrams[^1]. Each example demonstrates best practices for academic data presentation.

### 📄 Professional PDF Export
Every page on this site can be exported to PDF with automatic formatting, page breaks, and QR codes linking back to the interactive version[^2]. The export system handles complex layouts including multi-page tables and figures.

### 🔬 Reproducible Research
All data processing happens at build time using JavaScript data loaders, ensuring reproducibility and version control[^3]. View the source code for any visualization directly in your browser.

## Sample Visualizations Gallery

```js
// Create sample data for different chart types
const categories = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'];
const funding = categories.map(cat => ({
  category: cat,
  amount: Math.random() * 1000000 + 500000,
  growth: (Math.random() - 0.5) * 20
}));
```

<div class="grid grid-cols-2">
  <div>

```js
Plot.plot({
  title: "Research Funding by Field",
  marginLeft: 120,
  marginBottom: 50,
  x: {
    label: "Funding (millions)",
    tickFormat: d => `$${(d/1000000).toFixed(1)}M`
  },
  marks: [
    Plot.barX(funding.sort((a, b) => b.amount - a.amount), {
      y: "category",
      x: "amount",
      fill: d => d.growth > 0 ? "green" : "red",
      tip: true
    })
  ]
})
```

  </div>
  <div>

```js
Plot.plot({
  title: "Funding Growth Rate",
  marginBottom: 50,
  y: {
    label: "Growth (%)",
    grid: true,
    zero: true
  },
  marks: [
    Plot.dot(funding, {
      x: "category",
      y: "growth",
      r: d => Math.sqrt(d.amount / 10000),
      fill: d => d.growth > 0 ? "green" : "red",
      tip: true
    }),
    Plot.ruleY([0])
  ]
})
```

  </div>
</div>

## Mathematical Equations

The platform supports mathematical notation using TeX. For example, the normal distribution probability density function:

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

Or inline equations like the correlation coefficient: $r = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i - \bar{x})^2}\sqrt{\sum_{i=1}^{n}(y_i - \bar{y})^2}}$

## Interactive Controls

```js
const yearInput = Inputs.range([2015, 2024], {value: 2024, step: 1, label: "Year"});
const year = Generators.input(yearInput);
```

```js
const fieldSelect = Inputs.select(categories, {value: "Physics", label: "Field of Study"});
const field = Generators.input(fieldSelect);
```

<div class="grid grid-cols-2">
  <div>${yearInput}</div>
  <div>${fieldSelect}</div>
</div>

You selected: **${field}** in **${year}**

## Data Tables

```js
const tableData = funding.map(d => ({
  Field: d.category,
  "Funding Amount": d3.format("$,.0f")(d.amount),
  "Growth Rate": d3.format("+.1%")(d.growth / 100),
  "Researchers": Math.floor(Math.random() * 1000) + 500,
  "Publications": Math.floor(Math.random() * 5000) + 1000
}));
```

```js
Inputs.table(tableData, {
  columns: ["Field", "Funding Amount", "Growth Rate", "Researchers", "Publications"],
  header: {
    Field: "Research Field",
    "Funding Amount": "Annual Funding",
    "Growth Rate": "YoY Growth"
  },
  width: {
    Field: 150,
    "Funding Amount": 120,
    "Growth Rate": 100
  },
  sort: "Funding Amount",
  reverse: true
})
```

## Getting Started

### For Researchers
1. **Explore the examples** - Navigate through the sidebar to see different visualization types
2. **View the source** - Click on any code block to see how visualizations are created
3. **Export to PDF** - Use the PDF export feature to create print-ready reports

### For Developers
1. **Clone the repository**: 
   ```bash
   git clone https://github.com/SustainableDevelopmentReform/research-report.git
   ```
2. **Install dependencies**: 
   ```bash
   npm install && cd pdf-export && npm install
   ```
3. **Start developing**: 
   ```bash
   npm run dev
   ```

## Platform Architecture

This platform combines several powerful technologies:

- **Observable Framework** - Reactive data visualizations and notebooks[^4]
- **D3.js** - Low-level visualization primitives
- **Observable Plot** - High-level grammar of graphics
- **Puppeteer** - Automated PDF generation
- **GitHub Pages** - Free hosting for public research

## Citations and References

This demonstration uses synthetic data for illustration purposes. In real research applications, you would load your actual datasets and include proper citations[^5].

---

[^1]: Observable Framework provides a reactive programming model where visualizations automatically update when data changes. This is particularly useful for exploratory data analysis and interactive dashboards.

[^2]: The PDF export pipeline uses Puppeteer to render pages with print-specific CSS, ensuring that tables don't break across pages and figures are properly captioned. QR codes are automatically injected to link print versions to their interactive counterparts.

[^3]: Data loaders run at build time, not runtime, which means your data processing is version-controlled and reproducible. This follows best practices for computational reproducibility in research.

[^4]: The architecture is inspired by computational notebooks like Jupyter, but with better support for web deployment and interactivity. See [Observable Framework documentation](https://observablehq.com/framework/) for technical details.

[^5]: For real research projects, we recommend using a reference manager like Zotero or Mendeley to maintain your bibliography, then importing formatted citations into your markdown files.