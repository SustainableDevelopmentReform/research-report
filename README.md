# Observable Framework Template

A modern, file-based framework for creating data-driven reports and interactive dashboards with built-in PDF export capabilities.

## Features

- 📊 **Data Visualization**: Built on D3.js and Observable Plot
- 📁 **File-based Routing**: Markdown files become pages automatically
- 🔄 **Data Loaders**: Process data at build time with JavaScript
- 📄 **PDF Export**: Convert your reports to professional PDFs
- 🎨 **Customizable Components**: Reusable visualization components
- ⚡ **Hot Reloading**: See changes instantly during development

## Quick Start

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. Clone this template to your new project:
```bash
# Copy the template to a new directory
cp -r template-export/ my-new-project/
cd my-new-project/
```

2. Install dependencies:
```bash
npm install
```

3. Install PDF export dependencies (optional):
```bash
npm run pdf:install
```

4. Start the development server:
```bash
npm run dev
```

Your site will be available at http://localhost:3000

## Project Structure

```
.
├── src/                    # Source files
│   ├── index.md           # Homepage
│   ├── components/        # Reusable visualization components
│   │   ├── timeline.js    # Timeline visualization
│   │   └── sankey-diagram.js # Sankey diagram
│   └── data/             # Data loaders and static data
│       └── example.csv.js # Example data loader
├── pdf-export/           # PDF export module
│   ├── src/             # PDF conversion source code
│   └── config/          # PDF configuration
├── dist/                # Build output (gitignored)
├── observablehq.config.js # Framework configuration
└── package.json         # Dependencies and scripts
```

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build static site to `./dist`
- `npm run clean` - Clear data loader cache

### PDF Export
- `npm run pdf:install` - Install PDF dependencies (run once)
- `npm run pdf:export` - Convert built site to PDFs
- `npm run pdf:build` - Build site and export to PDF
- `npm run pdf:watch` - Watch for changes and auto-export

### Deployment
- `npm run deploy` - Deploy to Observable platform

## Creating Pages

Create new pages by adding Markdown files to the `src/` directory:

```markdown
# My New Page

This is a new page with some JavaScript code:

\`\`\`js
const data = FileAttachment("data/mydata.csv").csv();
\`\`\`

And a visualization:

\`\`\`js
Plot.plot({
  marks: [
    Plot.dot(data, {x: "x", y: "y"})
  ]
})
\`\`\`
```

## Data Loaders

Create data loaders in `src/data/` as JavaScript files:

```javascript
// src/data/mydata.csv.js
export default async function() {
  // Fetch or generate data
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  // Transform data
  return data.map(d => ({
    date: new Date(d.timestamp),
    value: +d.value
  }));
}
```

Use the data in your pages:
```javascript
const data = FileAttachment("data/mydata.csv").csv();
```

## Components

Create reusable visualization components in `src/components/`:

```javascript
// src/components/chart.js
import * as Plot from "npm:@observablehq/plot";

export function createChart(data, options = {}) {
  return Plot.plot({
    marks: [
      Plot.line(data, {x: "date", y: "value", ...options})
    ],
    grid: true,
    ...options
  });
}
```

Use components in your pages:
```javascript
import {createChart} from "./components/chart.js";
const chart = createChart(data);
```

## Configuration

Edit `observablehq.config.js` to customize your site:

```javascript
export default {
  title: "My Project",
  pages: [
    {name: "Home", path: "/"},
    {name: "Dashboard", path: "/dashboard"},
    {name: "Reports", path: "/reports"}
  ],
  theme: "default", // or "light", "dark", "slate"
  // ... more options
};
```

## PDF Export Configuration

Customize PDF output in `pdf-export/config/config.json`:

```json
{
  "documents": {
    "dashboard": {
      "format": "A3",
      "orientation": "landscape"
    },
    "report": {
      "format": "A4",
      "orientation": "portrait"
    }
  }
}
```

## Deployment

### Observable Platform
```bash
npm run deploy
```

### Static Hosting
Build the site and host the `dist/` directory:
```bash
npm run build
# Upload dist/ to your hosting service
```

## Resources

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [Observable Plot](https://observablehq.com/plot/)
- [D3.js Documentation](https://d3js.org/)
- [Markdown-it Footnotes](https://github.com/markdown-it/markdown-it-footnote)

## License

This template is open source and available for use in your projects.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

Built with [Observable Framework](https://observablehq.com/framework/)