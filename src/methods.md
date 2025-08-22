# Research Methods

This page provides comprehensive documentation of research methodologies, from experimental design to data analysis pipelines[^1].

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {Timeline} from "./components/timeline.js";
```

## Experimental Design

### Randomized Controlled Trial Design

```js
// Generate RCT allocation data
const participants = 200;
const allocationData = d3.range(participants).map(i => {
  const randomNum = Math.random();
  const block = Math.floor(i / 4);
  const group = randomNum < 0.5 ? "Control" : "Treatment";
  
  return {
    id: i + 1,
    block: `Block ${block + 1}`,
    group: group,
    baseline: d3.randomNormal(100, 15)(),
    age: Math.floor(d3.randomNormal(45, 12)()),
    gender: Math.random() < 0.55 ? "Female" : "Male",
    randomization: randomNum
  };
});

// Calculate group balance
const groupBalance = d3.rollup(
  allocationData,
  v => ({
    count: v.length,
    meanAge: d3.mean(v, d => d.age),
    femalePercent: (d3.sum(v, d => d.gender === "Female" ? 1 : 0) / v.length * 100),
    meanBaseline: d3.mean(v, d => d.baseline)
  }),
  d => d.group
);
```

```js
Plot.plot({
  title: "Randomized Group Allocation",
  subtitle: "Balanced allocation across treatment arms",
  width: 800,
  height: 400,
  facet: {
    data: allocationData,
    x: "group",
    label: null
  },
  marks: [
    Plot.rectY(allocationData, Plot.binX({y: "count"}, {
      x: "age",
      fill: "group",
      fillOpacity: 0.7
    })),
    Plot.ruleY([0])
  ]
})
```

### Allocation Balance Check

```js
const balanceTable = Array.from(groupBalance, ([group, stats]) => ({
  Group: group,
  N: stats.count,
  "Mean Age": stats.meanAge.toFixed(1),
  "Female %": stats.femalePercent.toFixed(1),
  "Baseline Mean": stats.meanBaseline.toFixed(2)
}));
```

```js
Inputs.table(balanceTable, {
  columns: ["Group", "N", "Mean Age", "Female %", "Baseline Mean"]
})
```

## Power Analysis & Sample Size

### Statistical Power Calculation

```js
// Power analysis parameters
function calculatePower(n, effectSize, alpha = 0.05) {
  // Simplified power calculation for demonstration
  const criticalZ = 1.96; // for alpha = 0.05
  const nonCentrality = effectSize * Math.sqrt(n / 2);
  const power = 1 - (1 / (1 + Math.exp(2 * (nonCentrality - criticalZ))));
  return power;
}

// Generate power curves for different effect sizes
const sampleSizes = d3.range(10, 500, 10);
const effectSizes = [0.2, 0.5, 0.8]; // Small, medium, large

const powerData = effectSizes.flatMap(es => 
  sampleSizes.map(n => ({
    n: n,
    power: calculatePower(n, es),
    effectSize: `d = ${es}`,
    label: es === 0.2 ? "Small" : es === 0.5 ? "Medium" : "Large"
  }))
);
```

```js
Plot.plot({
  title: "Statistical Power Analysis",
  subtitle: "Power as a function of sample size and effect size",
  width: 800,
  height: 400,
  x: {label: "Sample Size per Group →"},
  y: {label: "↑ Statistical Power", domain: [0, 1]},
  color: {legend: true},
  marks: [
    Plot.line(powerData, {
      x: "n",
      y: "power",
      stroke: "effectSize",
      strokeWidth: 2
    }),
    Plot.ruleY([0.8], {stroke: "red", strokeDasharray: "5,5"}),
    Plot.text([{x: 450, y: 0.82}], {
      x: "x",
      y: "y",
      text: ["80% Power"],
      fill: "red",
      fontSize: 12
    })
  ]
})
```

## Data Collection Framework

### Multi-Source Data Integration

```js
// Enhanced data collection visualization
const dataCollection = {
  "Primary Sources": {
    "Surveys": 1250,
    "Interviews": 48,
    "Field Observations": 320,
    "Focus Groups": 12
  },
  "Secondary Sources": {
    "Academic Papers": 847,
    "Government Reports": 156,
    "Industry Data": 423,
    "Historical Records": 234
  },
  "Digital Sources": {
    "API Endpoints": 12,
    "Web Scraping": 8,
    "Database Queries": 234,
    "Social Media": 1567
  }
};
```

```js
Plot.plot({
  title: "Data Collection Sources",
  subtitle: "Multi-method approach for comprehensive coverage",
  width: 900,
  height: 400,
  marginLeft: 150,
  x: {label: "Number of Data Points →"},
  marks: [
    Plot.barX(
      Object.entries(dataCollection).flatMap(([category, sources]) =>
        Object.entries(sources).map(([source, count]) => ({
          source: source,
          category: category,
          count: count
        }))
      ),
      {
        x: "count",
        y: "source",
        fill: "category",
        sort: {y: "-x"},
        tip: true
      }
    ),
    Plot.ruleX([0])
  ]
})
```

## Sampling Methodology

### Stratified Random Sampling Design

```js
// Generate stratified sampling visualization
const populationSize = 10000;
const sampleSize = 500;
const strata = [
  {name: "Urban High Income", size: 0.15, weight: 1.2},
  {name: "Urban Low Income", size: 0.25, weight: 1.5},
  {name: "Suburban", size: 0.35, weight: 1.0},
  {name: "Rural", size: 0.25, weight: 1.3}
];

const strataSamples = strata.map(stratum => ({
  ...stratum,
  population: Math.floor(populationSize * stratum.size),
  baseSample: Math.floor(sampleSize * stratum.size),
  weightedSample: Math.floor(sampleSize * stratum.size * stratum.weight / 
    d3.sum(strata, d => d.size * d.weight))
}));
```

```js
Inputs.table(strataSamples, {
  columns: ["name", "population", "baseSample", "weightedSample"],
  header: {
    name: "Stratum",
    population: "Population",
    baseSample: "Proportional Sample",
    weightedSample: "Weighted Sample"
  }
})
```

## Survey Design & Validation

### Response Distribution Analysis

```js
// Generate Likert scale response data
const likertQuestions = [
  "The interface is easy to use",
  "The documentation is helpful",
  "The features meet my needs",
  "I would recommend this to others",
  "The performance is satisfactory"
];

const likertResponses = likertQuestions.flatMap(question => {
  const responses = d3.range(100).map(() => {
    const tendency = Math.random();
    return tendency < 0.1 ? 1 :
           tendency < 0.2 ? 2 :
           tendency < 0.4 ? 3 :
           tendency < 0.7 ? 4 : 5;
  });
  
  return [1, 2, 3, 4, 5].map(value => ({
    question: question.substring(0, 25) + "...",
    response: value,
    count: d3.sum(responses, r => r === value),
    label: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"][value - 1]
  }));
});
```

```js
Plot.plot({
  title: "Survey Response Distributions",
  subtitle: "5-point Likert scale responses",
  width: 900,
  height: 400,
  marginLeft: 180,
  x: {label: "Number of Responses →"},
  marks: [
    Plot.barX(likertResponses, {
      x: "count",
      y: "question",
      fill: "response",
      sort: {y: null},
      tip: true
    }),
    Plot.ruleX([0])
  ]
})
```

### Reliability Analysis

```js
// Calculate Cronbach's alpha
const cronbachAlpha = 0.87; // Simulated value
const itemCount = 5;
const correlations = d3.range(itemCount).map(i => 
  d3.range(itemCount).map(j => 
    i === j ? 1 : 0.3 + Math.random() * 0.4
  )
);

const reliabilityMetrics = {
  "Cronbach's Alpha": cronbachAlpha.toFixed(3),
  "Number of Items": itemCount,
  "Average Inter-item Correlation": d3.mean(correlations.flat().filter((v, i) => i % (itemCount + 1) !== 0)).toFixed(3),
  "Interpretation": cronbachAlpha > 0.9 ? "Excellent" : 
                   cronbachAlpha > 0.8 ? "Good" :
                   cronbachAlpha > 0.7 ? "Acceptable" : "Questionable"
};
```

```js
Inputs.table([reliabilityMetrics], {
  columns: Object.keys(reliabilityMetrics)
})
```

## Data Quality Assurance

### Missing Data Patterns

```js
// Generate missing data pattern
const variables = ["Age", "Gender", "Income", "Education", "Employment", "Health Status", "Location"];
const missingPatterns = d3.range(200).map(i => {
  const pattern = {};
  variables.forEach(v => {
    pattern[v] = Math.random() > (v === "Income" ? 0.15 : 0.05);
  });
  return pattern;
});

const missingStats = variables.map(v => ({
  Variable: v,
  "Complete": d3.sum(missingPatterns, d => d[v] ? 1 : 0),
  "Missing": d3.sum(missingPatterns, d => d[v] ? 0 : 1),
  "Missing %": (d3.sum(missingPatterns, d => d[v] ? 0 : 1) / missingPatterns.length * 100).toFixed(1)
}));
```

```js
Plot.plot({
  title: "Missing Data Analysis",
  subtitle: "Completeness by variable",
  width: 800,
  height: 300,
  marginLeft: 100,
  x: {label: "Number of Cases →"},
  marks: [
    Plot.barX(missingStats.flatMap(d => [
      {variable: d.Variable, type: "Complete", count: d.Complete},
      {variable: d.Variable, type: "Missing", count: d.Missing}
    ]), {
      x: "count",
      y: "variable",
      fill: "type",
      sort: {y: null}
    }),
    Plot.ruleX([0])
  ]
})
```

## Qualitative Methods

### Thematic Analysis Framework

```js
// Thematic analysis coding structure
const themes = {
  "User Experience": {
    "Usability": ["Navigation", "Interface", "Accessibility"],
    "Satisfaction": ["Performance", "Features", "Support"],
    "Challenges": ["Learning Curve", "Technical Issues", "Documentation"]
  },
  "Implementation": {
    "Adoption": ["Training", "Onboarding", "Change Management"],
    "Integration": ["Systems", "Workflows", "Data Migration"],
    "Resources": ["Time", "Budget", "Personnel"]
  },
  "Outcomes": {
    "Efficiency": ["Time Savings", "Automation", "Productivity"],
    "Quality": ["Accuracy", "Consistency", "Standards"],
    "Impact": ["ROI", "User Adoption", "Business Value"]
  }
};

const themeData = Object.entries(themes).flatMap(([theme, subthemes]) =>
  Object.entries(subthemes).flatMap(([subtheme, codes]) =>
    codes.map(code => ({
      theme: theme,
      subtheme: subtheme,
      code: code,
      frequency: Math.floor(Math.random() * 50) + 10
    }))
  )
);
```

```js
Plot.plot({
  title: "Thematic Analysis Code Frequency",
  subtitle: "Distribution of codes across themes",
  width: 900,
  height: 500,
  marginLeft: 120,
  color: {legend: true},
  marks: [
    Plot.barX(themeData, {
      x: "frequency",
      y: "code",
      fill: "theme",
      sort: {y: "-x"},
      tip: true
    }),
    Plot.ruleX([0])
  ]
})
```

## Research Timeline

### Project Gantt Chart

```js
const projectPhases = [
  {phase: "Literature Review", start: "2023-01", end: "2023-03", category: "Preparation"},
  {phase: "Study Design", start: "2023-02", end: "2023-04", category: "Preparation"},
  {phase: "Ethics Approval", start: "2023-03", end: "2023-05", category: "Preparation"},
  {phase: "Recruitment", start: "2023-05", end: "2023-07", category: "Data Collection"},
  {phase: "Data Collection", start: "2023-06", end: "2023-10", category: "Data Collection"},
  {phase: "Data Cleaning", start: "2023-09", end: "2023-11", category: "Analysis"},
  {phase: "Statistical Analysis", start: "2023-10", end: "2024-01", category: "Analysis"},
  {phase: "Manuscript Writing", start: "2023-12", end: "2024-03", category: "Dissemination"},
  {phase: "Peer Review", start: "2024-03", end: "2024-05", category: "Dissemination"},
  {phase: "Publication", start: "2024-05", end: "2024-06", category: "Dissemination"}
].map(d => ({
  ...d,
  startDate: new Date(d.start),
  endDate: new Date(d.end),
  duration: d3.timeMonth.count(new Date(d.start), new Date(d.end))
}));
```

```js
Plot.plot({
  title: "Research Project Timeline",
  subtitle: "Gantt chart showing project phases",
  width: 900,
  height: 400,
  marginLeft: 140,
  x: {
    type: "time",
    label: null,
    domain: [new Date("2023-01"), new Date("2024-07")]
  },
  color: {legend: true},
  marks: [
    Plot.rect(projectPhases, {
      x1: "startDate",
      x2: "endDate",
      y: "phase",
      fill: "category",
      tip: true
    }),
    Plot.ruleX([new Date("2024-01")], {
      stroke: "red",
      strokeDasharray: "5,5"
    }),
    Plot.text([{x: new Date("2024-01"), y: 0}], {
      x: "x",
      text: ["2024"],
      dy: -10,
      fill: "red"
    })
  ]
})
```

## Statistical Test Selection Guide

### Decision Tree for Test Selection

```js
const testDecisionData = [
  {scenario: "Compare 2 groups, normal dist", test: "t-test", assumptions: "Normality, Equal variance"},
  {scenario: "Compare 2 groups, non-normal", test: "Mann-Whitney U", assumptions: "Independent samples"},
  {scenario: "Compare >2 groups, normal", test: "ANOVA", assumptions: "Normality, Equal variance"},
  {scenario: "Compare >2 groups, non-normal", test: "Kruskal-Wallis", assumptions: "Independent samples"},
  {scenario: "Paired samples, normal", test: "Paired t-test", assumptions: "Normality of differences"},
  {scenario: "Paired samples, non-normal", test: "Wilcoxon signed-rank", assumptions: "Symmetry"},
  {scenario: "Correlation, normal", test: "Pearson correlation", assumptions: "Linear relationship"},
  {scenario: "Correlation, non-normal", test: "Spearman correlation", assumptions: "Monotonic relationship"},
  {scenario: "Categorical association", test: "Chi-square test", assumptions: "Expected frequency >5"},
  {scenario: "Regression prediction", test: "Linear regression", assumptions: "Linearity, Independence"}
];
```

```js
Inputs.table(testDecisionData, {
  columns: ["scenario", "test", "assumptions"],
  header: {
    scenario: "Research Scenario",
    test: "Recommended Test",
    assumptions: "Key Assumptions"
  }
})
```

## Data Processing Pipeline

### Automated Workflow Visualization

```js
const pipelineSteps = [
  {step: 1, name: "Data Import", duration: 2, status: "complete"},
  {step: 2, name: "Validation", duration: 3, status: "complete"},
  {step: 3, name: "Cleaning", duration: 5, status: "complete"},
  {step: 4, name: "Transformation", duration: 4, status: "running"},
  {step: 5, name: "Feature Engineering", duration: 6, status: "pending"},
  {step: 6, name: "Analysis", duration: 8, status: "pending"},
  {step: 7, name: "Visualization", duration: 3, status: "pending"},
  {step: 8, name: "Reporting", duration: 2, status: "pending"}
];
```

```js
Plot.plot({
  title: "Data Processing Pipeline Status",
  subtitle: "Automated workflow progress",
  width: 800,
  height: 300,
  x: {label: "Processing Time (hours) →"},
  color: {
    domain: ["complete", "running", "pending"],
    range: ["green", "orange", "gray"],
    legend: true
  },
  marks: [
    Plot.barX(pipelineSteps.sort((a, b) => a.step - b.step), {
      x: "duration",
      y: "name",
      fill: "status",
      tip: true
    }),
    Plot.ruleX([0])
  ]
})
```

## Validation Techniques

### Cross-Validation Strategy

```js
const cvFolds = 10;
const cvResults = d3.range(cvFolds).map(i => ({
  fold: i + 1,
  training: 0.85 + Math.random() * 0.08,
  validation: 0.82 + Math.random() * 0.10,
  test: 0.80 + Math.random() * 0.12
}));
```

```js
Plot.plot({
  title: "10-Fold Cross-Validation Results",
  subtitle: "Model performance across validation folds",
  width: 800,
  height: 400,
  y: {domain: [0.7, 1], label: "↑ Accuracy"},
  x: {label: "Fold →"},
  marks: [
    Plot.lineY(cvResults, {
      x: "fold",
      y: "training",
      stroke: "steelblue",
      strokeWidth: 2,
      marker: true
    }),
    Plot.lineY(cvResults, {
      x: "fold",
      y: "validation",
      stroke: "orange",
      strokeWidth: 2,
      marker: true
    }),
    Plot.lineY(cvResults, {
      x: "fold",
      y: "test",
      stroke: "green",
      strokeWidth: 2,
      marker: true
    }),
    Plot.ruleY([0.8], {stroke: "red", strokeDasharray: "5,5"}),
    Plot.text([{x: 9.5, y: 0.95}], {
      x: "x",
      y: "y",
      text: ["Training"],
      fill: "steelblue"
    }),
    Plot.text([{x: 9.5, y: 0.87}], {
      x: "x",
      y: "y",
      text: ["Validation"],
      fill: "orange"
    }),
    Plot.text([{x: 9.5, y: 0.83}], {
      x: "x",
      y: "y",
      text: ["Test"],
      fill: "green"
    })
  ]
})
```

## Ethical Considerations

### Ethics Compliance Dashboard

```js
const ethicsChecklist = [
  {category: "Informed Consent", status: "✓", completion: 100, notes: "All participants provided written consent"},
  {category: "Data Privacy", status: "✓", completion: 100, notes: "Personal identifiers removed, data encrypted"},
  {category: "IRB Approval", status: "✓", completion: 100, notes: "Approved by Institutional Review Board (#2024-156)"},
  {category: "Risk Assessment", status: "✓", completion: 100, notes: "Minimal risk study, benefits outweigh risks"},
  {category: "Data Retention", status: "✓", completion: 100, notes: "7-year retention policy in secure storage"},
  {category: "Participant Compensation", status: "✓", completion: 100, notes: "Fair compensation provided"},
  {category: "Conflict of Interest", status: "✓", completion: 100, notes: "No conflicts declared"},
  {category: "Data Sharing", status: "⚠", completion: 75, notes: "Awaiting repository approval"}
];
```

```js
Inputs.table(ethicsChecklist, {
  columns: ["category", "status", "completion", "notes"],
  header: {
    category: "Ethical Requirement",
    status: "Status",
    completion: "Progress %",
    notes: "Implementation Notes"
  }
})
```

## Study Limitations

```js
const limitations = html`
<div class="card">
  <h3>Methodological Considerations</h3>
  <ul>
    <li><strong>Sample Size:</strong> N=1,250 provides 80% power to detect medium effect sizes (d=0.5)</li>
    <li><strong>Geographic Scope:</strong> Limited to North American markets; results may not generalize globally</li>
    <li><strong>Temporal Range:</strong> 2020-2024 period includes pandemic effects</li>
    <li><strong>Response Rate:</strong> 45% response rate may introduce selection bias</li>
    <li><strong>Measurement:</strong> Self-report measures subject to social desirability bias</li>
    <li><strong>Attrition:</strong> 12% dropout rate in longitudinal component</li>
  </ul>
</div>`;
```

```js
limitations
```

## Reproducibility Framework

```js
const reproducibility = html`
<div class="info-box">
  <h3>📊 Open Science Practices</h3>
  <p>This research follows FAIR principles (Findable, Accessible, Interoperable, Reusable):</p>
  <ul>
    <li><strong>Pre-registration:</strong> <a href="#">OSF.io/abc123</a> - Study protocol and analysis plan</li>
    <li><strong>Data Repository:</strong> <a href="#">doi.org/10.5061/dryad.xxxxx</a> - Anonymized datasets</li>
    <li><strong>Analysis Code:</strong> <a href="#">github.com/research/project</a> - Complete R/Python scripts</li>
    <li><strong>Materials:</strong> <a href="#">osf.io/materials</a> - Survey instruments and protocols</li>
    <li><strong>Docker Environment:</strong> <code>docker pull research/analysis:v1.0</code></li>
    <li><strong>Computational Notebook:</strong> <a href="#">mybinder.org/project</a> - Interactive analysis</li>
  </ul>
  
  <h4>Version Control</h4>
  <ul>
    <li>Data Version: v2.1.0 (2024-03-15)</li>
    <li>Code Version: v1.3.2 (2024-03-20)</li>
    <li>Protocol Version: v1.0.0 (2023-01-10)</li>
  </ul>
</div>`;
```

```js
reproducibility
```

## Methods Summary

This comprehensive methodology framework ensures[^2]:

1. **Rigorous Design**: Appropriate experimental and sampling designs for research questions
2. **Quality Assurance**: Multiple validation and verification steps throughout the pipeline
3. **Transparency**: Complete documentation of methods and procedures
4. **Reproducibility**: Open data and code for independent verification
5. **Ethical Compliance**: Adherence to institutional and professional standards

---

[^1]: Comprehensive methodological guidance based on Creswell, J.W., & Creswell, J.D. (2023). *Research Design: Qualitative, Quantitative, and Mixed Methods Approaches* (6th ed.). SAGE Publications.

[^2]: Best practices in research methodology follow guidelines from: National Academy of Sciences (2019). *Reproducibility and Replicability in Science*. Washington, DC: The National Academies Press.

<style>
.card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.info-box {
  background: #e7f3ff;
  border-left: 4px solid #0066cc;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.info-box h4 {
  margin-top: 1rem;
  color: #0066cc;
}

.pipeline-diagram {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}
</style>