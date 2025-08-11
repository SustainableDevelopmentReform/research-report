# Research Methods

This page documents the methodological approach and data processing pipeline used in this research[^1].

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
```

## Data Collection Framework

Our research employs a multi-source data collection strategy:

```js
// Data collection parameters
const dataCollection = {
  "Primary Sources": {
    "Surveys": 1250,
    "Interviews": 48,
    "Field Observations": 320
  },
  "Secondary Sources": {
    "Academic Papers": 847,
    "Government Reports": 156,
    "Industry Data": 423
  },
  "Digital Sources": {
    "API Endpoints": 12,
    "Web Scraping": 8,
    "Database Queries": 234
  }
};

const collectionChart = Plot.plot({
  title: "Data Collection Sources",
  marginLeft: 150,
  marks: [
    Plot.barX(
      Object.entries(dataCollection).flatMap(([category, sources]) =>
        Object.entries(sources).map(([source, count]) => ({
          source: `${source}`,
          category,
          count
        }))
      ),
      {
        x: "count",
        y: "source",
        fill: "category",
        sort: {y: "-x"}
      }
    ),
    Plot.ruleX([0])
  ]
});

display(collectionChart);
```

## Sampling Methodology

### Stratified Random Sampling

We employed stratified random sampling to ensure representative coverage across key demographic variables:

```js
const samplingData = d3.range(100).map(i => ({
  stratum: ["Urban", "Suburban", "Rural"][Math.floor(i / 33.33)],
  age: 18 + Math.random() * 62,
  income: 20000 + Math.random() * 180000,
  selected: Math.random() > 0.7
}));

const samplingPlot = Plot.plot({
  title: "Stratified Sampling Distribution",
  grid: true,
  marks: [
    Plot.dot(samplingData, {
      x: "age",
      y: "income",
      fill: "stratum",
      fillOpacity: d => d.selected ? 1 : 0.3,
      r: d => d.selected ? 4 : 2
    }),
    Plot.frame()
  ]
});

display(samplingPlot);
```

## Data Processing Pipeline

```js
const pipeline = `
graph LR
    A[Raw Data] --> B[Data Cleaning]
    B --> C[Validation]
    C --> D[Transformation]
    D --> E[Feature Engineering]
    E --> F[Analysis]
    F --> G[Results]
    
    B --> H[Quality Checks]
    H --> C
    
    D --> I[Normalization]
    I --> E
`;

display(html`<div class="pipeline-diagram">
  <pre>${pipeline}</pre>
  <p><em>Figure: Data processing pipeline showing transformation stages</em></p>
</div>`);
```

## Statistical Methods

### Regression Analysis

```js
// Generate sample regression data
const regressionData = d3.range(50).map(i => {
  const x = i * 2;
  const y = 2.5 * x + 10 + (Math.random() - 0.5) * 20;
  return {x, y};
});

// Calculate regression line
const xMean = d3.mean(regressionData, d => d.x);
const yMean = d3.mean(regressionData, d => d.y);
const slope = d3.sum(regressionData, d => (d.x - xMean) * (d.y - yMean)) / 
              d3.sum(regressionData, d => (d.x - xMean) ** 2);
const intercept = yMean - slope * xMean;

const regressionPlot = Plot.plot({
  title: "Linear Regression Model",
  grid: true,
  marks: [
    Plot.dot(regressionData, {x: "x", y: "y", fill: "steelblue"}),
    Plot.line([[0, intercept], [100, slope * 100 + intercept]], {
      stroke: "red",
      strokeWidth: 2
    }),
    Plot.text([`y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`], {
      x: 80,
      y: 200,
      fill: "red"
    })
  ]
});

display(regressionPlot);
```

## Validation Techniques

### Cross-Validation Results

```js
const cvFolds = 5;
const cvResults = d3.range(cvFolds).map(i => ({
  fold: `Fold ${i + 1}`,
  training: 0.85 + Math.random() * 0.1,
  validation: 0.82 + Math.random() * 0.1
}));

const cvPlot = Plot.plot({
  title: "5-Fold Cross-Validation Results",
  y: {domain: [0.7, 1], label: "Accuracy"},
  marks: [
    Plot.barY(cvResults, {
      x: "fold",
      y: "training",
      fill: "steelblue",
      title: "Training"
    }),
    Plot.barY(cvResults, {
      x: "fold",
      y: "validation",
      fill: "orange",
      dx: 15,
      title: "Validation"
    }),
    Plot.ruleY([0.7])
  ]
});

display(cvPlot);
```

## Ethical Considerations

Our research adheres to strict ethical guidelines:

```js
const ethicsChecklist = [
  {category: "Informed Consent", status: "✓", notes: "All participants provided written consent"},
  {category: "Data Privacy", status: "✓", notes: "Personal identifiers removed, data encrypted"},
  {category: "IRB Approval", status: "✓", notes: "Approved by Institutional Review Board (#2024-156)"},
  {category: "Conflict of Interest", status: "✓", notes: "No conflicts declared"},
  {category: "Data Retention", status: "✓", notes: "7-year retention policy in secure storage"}
];

display(Inputs.table(ethicsChecklist, {
  columns: ["category", "status", "notes"],
  header: {
    category: "Ethical Requirement",
    status: "Status",
    notes: "Implementation Notes"
  }
}));
```

## Limitations

```js
const limitations = html`
<div class="card">
  <h3>Study Limitations</h3>
  <ul>
    <li><strong>Sample Size:</strong> Limited to N=1,250 due to resource constraints</li>
    <li><strong>Geographic Scope:</strong> Data collection restricted to North American markets</li>
    <li><strong>Temporal Range:</strong> Analysis covers 2020-2024, missing pre-pandemic baseline</li>
    <li><strong>Response Bias:</strong> Online survey methodology may underrepresent certain demographics</li>
    <li><strong>Measurement Error:</strong> Self-reported data subject to recall and social desirability bias</li>
  </ul>
</div>`;

display(limitations);
```

## Reproducibility

All analysis code and anonymized datasets are available in our GitHub repository:

```js
const reproducibility = html`
<div class="info-box">
  <h3>📊 Reproducible Research</h3>
  <p>This research follows open science principles:</p>
  <ul>
    <li>Pre-registered analysis plan: <a href="#">OSF.io/abc123</a></li>
    <li>Analysis code: <a href="#">github.com/research/project</a></li>
    <li>Data availability: <a href="#">doi.org/10.5061/dryad.xxxxx</a></li>
    <li>Docker environment: <code>docker pull research/analysis:v1.0</code></li>
  </ul>
</div>`;

display(reproducibility);
```

---

[^1]: All methodological decisions were made following best practices outlined in *Research Design: Qualitative, Quantitative, and Mixed Methods Approaches* (Creswell & Creswell, 2023).

<style>
.card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.info-box {
  background: #e7f3ff;
  border-left: 4px solid #0066cc;
  padding: 1rem;
  margin: 1rem 0;
}

.pipeline-diagram {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>