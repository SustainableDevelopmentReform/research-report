# Data Tables & Reports

Professional data presentation is essential for research communication[^1]. This page demonstrates advanced table formatting and reporting capabilities.

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
```

## Research Dataset Summary

```js
// Generate comprehensive research dataset
const researchData = d3.range(50).map(i => ({
  id: `SUBJ-${String(i + 1).padStart(3, '0')}`,
  age: Math.floor(d3.randomNormal(45, 15)()),
  gender: Math.random() > 0.5 ? "Male" : "Female",
  group: i < 25 ? "Control" : "Treatment",
  baseline: d3.randomNormal(100, 15)(),
  followup1: d3.randomNormal(i < 25 ? 100 : 110, 15)(),
  followup2: d3.randomNormal(i < 25 ? 100 : 115, 18)(),
  completed: Math.random() > 0.1,
  site: ["Site A", "Site B", "Site C"][Math.floor(Math.random() * 3)]
}));

// Calculate derived metrics
const enrichedData = researchData.map(d => ({
  ...d,
  change1: d.followup1 - d.baseline,
  change2: d.followup2 - d.baseline,
  percentChange: ((d.followup2 - d.baseline) / d.baseline * 100)
}));
```

## Interactive Data Table

```js
const viewOption = Inputs.select(["Summary", "Full Dataset", "By Group", "By Site"], {
  value: "Summary",
  label: "View"
});
```

```js
const getTableData = () => {
  if (viewOption === "Summary") {
    const summary = d3.rollup(
      enrichedData,
      v => ({
        n: v.length,
        meanAge: d3.mean(v, d => d.age),
        meanBaseline: d3.mean(v, d => d.baseline),
        meanFollowup1: d3.mean(v, d => d.followup1),
        meanFollowup2: d3.mean(v, d => d.followup2),
        meanChange: d3.mean(v, d => d.change2),
        completed: d3.sum(v, d => d.completed ? 1 : 0)
      }),
      d => d.group
    );
    
    return Array.from(summary, ([group, stats]) => ({
      Group: group,
      N: stats.n,
      "Mean Age": stats.meanAge.toFixed(1),
      "Baseline": stats.meanBaseline.toFixed(2),
      "Follow-up 1": stats.meanFollowup1.toFixed(2),
      "Follow-up 2": stats.meanFollowup2.toFixed(2),
      "Mean Change": stats.meanChange.toFixed(2),
      "Completion Rate": `${(stats.completed / stats.n * 100).toFixed(1)}%`
    }));
  } else if (viewOption === "By Site") {
    const bySite = d3.rollup(
      enrichedData,
      v => ({
        control: d3.sum(v, d => d.group === "Control" ? 1 : 0),
        treatment: d3.sum(v, d => d.group === "Treatment" ? 1 : 0),
        meanAge: d3.mean(v, d => d.age),
        meanChange: d3.mean(v, d => d.change2)
      }),
      d => d.site
    );
    
    return Array.from(bySite, ([site, stats]) => ({
      Site: site,
      Control: stats.control,
      Treatment: stats.treatment,
      Total: stats.control + stats.treatment,
      "Mean Age": stats.meanAge.toFixed(1),
      "Mean Change": stats.meanChange.toFixed(2)
    }));
  } else if (viewOption === "By Group") {
    return enrichedData.filter(d => d.completed).map(d => ({
      ID: d.id,
      Group: d.group,
      Age: d.age,
      Gender: d.gender,
      Baseline: d.baseline.toFixed(2),
      "Follow-up 2": d.followup2.toFixed(2),
      Change: d.change2.toFixed(2),
      "% Change": d.percentChange.toFixed(1)
    }));
  } else {
    return enrichedData.map(d => ({
      ID: d.id,
      Site: d.site,
      Group: d.group,
      Age: d.age,
      Gender: d.gender,
      Baseline: d.baseline.toFixed(2),
      "FU1": d.followup1.toFixed(2),
      "FU2": d.followup2.toFixed(2),
      "Δ1": d.change1.toFixed(2),
      "Δ2": d.change2.toFixed(2),
      Status: d.completed ? "Complete" : "Dropout"
    }));
  }
};
```

```js
Inputs.table(getTableData(), {
  sort: viewOption === "Summary" ? "Group" : "ID",
  reverse: false,
  layout: "auto"
})
```

## Statistical Summary Report

```js
// Generate comprehensive statistics
const generateStats = (data, label) => {
  const values = data.map(d => d.followup2 - d.baseline);
  return {
    Measure: label,
    N: data.length,
    Mean: d3.mean(values).toFixed(2),
    SD: d3.deviation(values).toFixed(2),
    SE: (d3.deviation(values) / Math.sqrt(data.length)).toFixed(3),
    "95% CI": `[${(d3.mean(values) - 1.96 * d3.deviation(values) / Math.sqrt(data.length)).toFixed(2)}, ${(d3.mean(values) + 1.96 * d3.deviation(values) / Math.sqrt(data.length)).toFixed(2)}]`,
    Min: d3.min(values).toFixed(2),
    Q1: d3.quantile(values, 0.25).toFixed(2),
    Median: d3.median(values).toFixed(2),
    Q3: d3.quantile(values, 0.75).toFixed(2),
    Max: d3.max(values).toFixed(2)
  };
};

const statsReport = [
  generateStats(enrichedData.filter(d => d.group === "Control"), "Control Group"),
  generateStats(enrichedData.filter(d => d.group === "Treatment"), "Treatment Group"),
  generateStats(enrichedData, "Overall")
];
```

### Table 1: Statistical Summary of Treatment Effects[^2]

```js
Inputs.table(statsReport, {
  columns: ["Measure", "N", "Mean", "SD", "SE", "95% CI", "Min", "Q1", "Median", "Q3", "Max"]
})
```

## Formatted Publication Table

```js
// Create publication-ready table
const publicationTable = d3.rollup(
  enrichedData,
  v => {
    const baseline = v.map(d => d.baseline);
    const followup = v.map(d => d.followup2);
    const change = v.map(d => d.change2);
    
    return {
      n: v.length,
      baseline: `${d3.mean(baseline).toFixed(1)} ± ${d3.deviation(baseline).toFixed(1)}`,
      followup: `${d3.mean(followup).toFixed(1)} ± ${d3.deviation(followup).toFixed(1)}`,
      change: `${d3.mean(change).toFixed(1)} ± ${d3.deviation(change).toFixed(1)}`,
      pValue: d3.mean(change) > 5 ? "< 0.001***" : d3.mean(change) > 2 ? "0.012*" : "0.234"
    };
  },
  d => d.group
);

const pubTableData = Array.from(publicationTable, ([group, stats]) => ({
  "Study Group": group,
  "N": stats.n,
  "Baseline (mean ± SD)": stats.baseline,
  "Follow-up (mean ± SD)": stats.followup,
  "Change (mean ± SD)": stats.change,
  "p-value": stats.pValue
}));
```

### Table 2: Primary Outcome Results by Treatment Group[^3]

```js
Inputs.table(pubTableData, {
  columns: ["Study Group", "N", "Baseline (mean ± SD)", "Follow-up (mean ± SD)", "Change (mean ± SD)", "p-value"]
})
```

*p < 0.05; **p < 0.01; ***p < 0.001

## Missing Data Report

```js
// Analyze missing data patterns
const missingReport = d3.rollup(
  enrichedData,
  v => ({
    enrolled: v.length,
    completed: d3.sum(v, d => d.completed ? 1 : 0),
    dropout: d3.sum(v, d => !d.completed ? 1 : 0),
    dropoutRate: `${((1 - d3.sum(v, d => d.completed ? 1 : 0) / v.length) * 100).toFixed(1)}%`
  }),
  d => d.site,
  d => d.group
);

const missingTableData = [];
missingReport.forEach((groups, site) => {
  groups.forEach((stats, group) => {
    missingTableData.push({
      Site: site,
      Group: group,
      Enrolled: stats.enrolled,
      Completed: stats.completed,
      Dropout: stats.dropout,
      "Dropout Rate": stats.dropoutRate
    });
  });
});
```

### Table 3: Study Completion by Site and Treatment Group[^4]

```js
Inputs.table(missingTableData, {
  columns: ["Site", "Group", "Enrolled", "Completed", "Dropout", "Dropout Rate"],
  sort: "Site"
})
```

## Export Options

Tables can be exported in multiple formats[^5]:
- **CSV**: For data analysis in R, Python, or Excel
- **LaTeX**: For academic publications
- **Markdown**: For reports and documentation
- **PDF**: Via the integrated PDF export pipeline

## Best Practices for Research Tables

1. **Clear Headers**: Use descriptive column names with units
2. **Appropriate Precision**: Report statistics to meaningful decimal places
3. **Missing Data**: Always report and explain missing values
4. **Footnotes**: Use footnotes for methodological details[^6]
5. **Consistency**: Maintain consistent formatting across tables

---

[^1]: Effective table design is crucial for research communication. Few, S. (2012). Show Me the Numbers: Designing Tables and Graphs to Enlighten. Analytics Press.

[^2]: Statistical summaries should include measures of central tendency and dispersion. The 95% confidence interval provides the range of plausible values for the population parameter.

[^3]: Publication tables should follow journal guidelines. Most biomedical journals require reporting of means ± standard deviations and p-values for hypothesis tests.

[^4]: Missing data patterns can introduce bias. Little, R.J.A., & Rubin, D.B. (2019). Statistical Analysis with Missing Data (3rd ed.). Wiley.

[^5]: Data export functionality ensures reproducibility and enables secondary analysis. Follow FAIR principles: Findable, Accessible, Interoperable, and Reusable.

[^6]: Table footnotes should clarify abbreviations, statistical methods, and any data transformations applied. Keep footnotes concise but complete.