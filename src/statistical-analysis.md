# Statistical Analysis

This page demonstrates various statistical visualization techniques commonly used in academic research. All visualizations are interactive and can be exported to PDF with professional formatting[^1].

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
```

## Distribution Analysis

Understanding data distributions is fundamental to statistical analysis. Below we explore various ways to visualize and analyze distributions[^2].

### Normal Distribution Comparison

```js
// Generate sample data from different distributions
const normal1 = d3.range(1000).map(() => d3.randomNormal(100, 15)());
const normal2 = d3.range(1000).map(() => d3.randomNormal(110, 20)());
const skewed = d3.range(1000).map(() => Math.pow(d3.randomUniform(0, 1)(), 2) * 200);

const allData = [
  ...normal1.map(v => ({value: v, group: "Control Group", type: "normal"})),
  ...normal2.map(v => ({value: v, group: "Treatment Group", type: "normal"})),
  ...skewed.map(v => ({value: v, group: "Skewed Sample", type: "skewed"}))
];
```

```js
Plot.plot({
  title: "Distribution Comparison: Histogram with Density Curves",
  subtitle: "Comparing control, treatment, and skewed distributions",
  width: 800,
  height: 400,
  marginBottom: 50,
  x: {label: "Value →"},
  y: {label: "↑ Density"},
  color: {legend: true},
  marks: [
    Plot.rectY(allData, Plot.binX({y: "proportion"}, {
      x: "value",
      fill: "group",
      fillOpacity: 0.5,
      thresholds: 30
    })),
    Plot.lineY(allData, Plot.binX({y: "proportion"}, {
      x: "value",
      stroke: "group",
      strokeWidth: 2,
      curve: "catmull-rom",
      thresholds: 30
    }))
  ]
})
```

### Box Plots and Violin Plots

Box plots provide a concise summary of distributions, showing median, quartiles, and outliers[^3].

```js
// Generate data for multiple experimental conditions
const conditions = ["Baseline", "Low Dose", "Medium Dose", "High Dose", "Control"];
const experimentData = [];

conditions.forEach((condition, i) => {
  const mean = 50 + i * 10;
  const sd = 5 + i * 2;
  const n = 100;
  
  for (let j = 0; j < n; j++) {
    experimentData.push({
      condition,
      value: d3.randomNormal(mean, sd)(),
      replicate: j % 10,
      significant: i > 2
    });
  }
});
```

```js
Plot.plot({
  title: "Treatment Response by Dosage",
  subtitle: "Box plots showing distribution of responses",
  width: 700,
  height: 400,
  marginLeft: 100,
  y: {grid: true, label: "Response Value"},
  marks: [
    Plot.boxY(experimentData, {
      x: "condition",
      y: "value",
      fill: d => d.significant ? "orange" : "steelblue",
      fillOpacity: 0.5
    }),
    Plot.dot(experimentData.filter(d => Math.random() < 0.1), {
      x: "condition",
      y: "value",
      r: 2,
      fill: "black",
      fillOpacity: 0.3
    })
  ]
})
```

## Correlation and Regression

### Scatter Plot Matrix

Exploring relationships between multiple variables simultaneously[^4].

```js
// Generate correlated variables
const n = 200;
const correlatedData = d3.range(n).map(() => {
  const x1 = d3.randomNormal(0, 1)();
  const x2 = x1 * 0.7 + d3.randomNormal(0, 1)() * 0.3;
  const x3 = x1 * 0.3 + x2 * 0.5 + d3.randomNormal(0, 1)() * 0.4;
  const y = x1 * 2 + x2 * 1.5 + x3 * 0.5 + d3.randomNormal(0, 1)();
  
  return {
    "Variable A": x1,
    "Variable B": x2,
    "Variable C": x3,
    "Outcome": y
  };
});
```

```js
// Create scatter plot with regression line
const x = "Variable A";
const y = "Outcome";

// Calculate regression
const xValues = correlatedData.map(d => d[x]);
const yValues = correlatedData.map(d => d[y]);
const xMean = d3.mean(xValues);
const yMean = d3.mean(yValues);

const num = d3.sum(xValues.map((xi, i) => (xi - xMean) * (yValues[i] - yMean)));
const den = d3.sum(xValues.map(xi => Math.pow(xi - xMean, 2)));
const slope = num / den;
const intercept = yMean - slope * xMean;
const r2 = Math.pow(num / Math.sqrt(den * d3.sum(yValues.map(yi => Math.pow(yi - yMean, 2)))), 2);
```

```js
Plot.plot({
  title: `Regression Analysis: ${x} vs ${y}`,
  subtitle: `R² = ${r2.toFixed(3)}, y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
  width: 600,
  height: 500,
  grid: true,
  marks: [
    Plot.dot(correlatedData, {
      x: x,
      y: y,
      fill: "steelblue",
      fillOpacity: 0.5,
      r: 3
    }),
    Plot.line(correlatedData, {
      x: x,
      y: d => slope * d[x] + intercept,
      stroke: "red",
      strokeWidth: 2
    }),
    Plot.text([`R² = ${r2.toFixed(3)}`], {
      x: xMean,
      y: d3.max(yValues) * 0.9,
      fill: "red",
      fontSize: 14
    })
  ]
})
```

## Hypothesis Testing

### t-Test Visualization

Visualizing the results of statistical tests helps communicate significance[^5].

```js
// Simulate t-test scenario
const group1 = d3.range(50).map(() => d3.randomNormal(100, 15)());
const group2 = d3.range(50).map(() => d3.randomNormal(108, 15)());

// Calculate t-statistic
const mean1 = d3.mean(group1);
const mean2 = d3.mean(group2);
const var1 = d3.variance(group1);
const var2 = d3.variance(group2);
const n1 = group1.length;
const n2 = group2.length;

const pooledSE = Math.sqrt(var1/n1 + var2/n2);
const tStat = (mean2 - mean1) / pooledSE;
const df = n1 + n2 - 2;

// Simplified p-value approximation using normal distribution for large df
// For df > 30, t-distribution approximates normal distribution
const pValue = Math.abs(tStat) > 3.5 ? 0.0005 : 
               Math.abs(tStat) > 2.5 ? 0.01 :
               Math.abs(tStat) > 2.0 ? 0.05 :
               Math.abs(tStat) > 1.5 ? 0.1 : 0.2;

const testResult = {
  "Group 1 Mean": mean1.toFixed(2),
  "Group 2 Mean": mean2.toFixed(2),
  "Difference": (mean2 - mean1).toFixed(2),
  "t-statistic": tStat.toFixed(3),
  "p-value": pValue < 0.001 ? "< 0.001" : pValue.toFixed(4),
  "Significant": pValue < 0.05 ? "Yes" : "No"
};
```

```js
Inputs.table([testResult], {
  columns: Object.keys(testResult)
})
```

```js
Plot.plot({
  title: "Two-Sample t-Test: Group Comparison",
  subtitle: `p-value ${pValue < 0.05 ? "< 0.05 (Significant)" : "> 0.05 (Not Significant)"}`,
  width: 600,
  height: 400,
  y: {grid: true, label: "Value"},
  marks: [
    Plot.boxY([...group1.map(v => ({group: "Group 1", value: v})),
               ...group2.map(v => ({group: "Group 2", value: v}))], {
      x: "group",
      y: "value",
      fill: d => d.group === "Group 1" ? "steelblue" : "orange",
      fillOpacity: 0.5
    }),
    Plot.ruleY([mean1], {stroke: "steelblue", strokeWidth: 2, strokeDasharray: "5,5"}),
    Plot.ruleY([mean2], {stroke: "orange", strokeWidth: 2, strokeDasharray: "5,5"})
  ]
})
```

## Confidence Intervals

### Parameter Estimation with Confidence Intervals

```js
// Generate bootstrap samples for confidence interval
const originalSample = d3.range(30).map(() => d3.randomNormal(100, 20)());
const bootstrapMeans = d3.range(1000).map(() => {
  const resample = d3.range(originalSample.length).map(() => 
    originalSample[Math.floor(Math.random() * originalSample.length)]
  );
  return d3.mean(resample);
});

const sampleMean = d3.mean(originalSample);
const ci95Lower = d3.quantile(bootstrapMeans.sort(d3.ascending), 0.025);
const ci95Upper = d3.quantile(bootstrapMeans.sort(d3.ascending), 0.975);
```

```js
Plot.plot({
  title: "Bootstrap Confidence Interval",
  subtitle: `95% CI: [${ci95Lower.toFixed(2)}, ${ci95Upper.toFixed(2)}]`,
  width: 700,
  height: 400,
  x: {label: "Sample Mean"},
  y: {label: "Frequency"},
  marks: [
    Plot.rectY(bootstrapMeans, Plot.binX({y: "count"}, {
      x: d => d,
      fill: "steelblue",
      fillOpacity: 0.7
    })),
    Plot.ruleX([sampleMean], {stroke: "red", strokeWidth: 2}),
    Plot.ruleX([ci95Lower, ci95Upper], {stroke: "orange", strokeWidth: 2, strokeDasharray: "5,5"}),
    Plot.text([`Mean: ${sampleMean.toFixed(2)}`], {
      x: sampleMean,
      y: 100,
      dy: -10,
      fill: "red"
    })
  ]
})
```

## Effect Sizes and Power Analysis

### Cohen's d Effect Size

```js
// Calculate Cohen's d
const cohensD = (mean2 - mean1) / Math.sqrt((var1 + var2) / 2);
const effectSize = Math.abs(cohensD) < 0.2 ? "Small" : 
                   Math.abs(cohensD) < 0.5 ? "Medium" :
                   Math.abs(cohensD) < 0.8 ? "Large" : "Very Large";

const effectData = [
  {measure: "Mean Difference", value: mean2 - mean1},
  {measure: "Pooled SD", value: Math.sqrt((var1 + var2) / 2)},
  {measure: "Cohen's d", value: cohensD},
  {measure: "Effect Size", value: effectSize}
];
```

```js
Plot.plot({
  title: "Effect Size Visualization",
  subtitle: `Cohen's d = ${cohensD.toFixed(3)} (${effectSize} effect)`,
  width: 600,
  height: 300,
  x: {domain: [-3, 3], label: "Standardized Effect →"},
  y: {label: "↑ Probability Density"},
  marks: [
    // Control distribution
    Plot.areaY(d3.range(-3, 3, 0.01).map(x => ({
      x: x,
      y: Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI),
      group: "Control"
    })), {x: "x", y: "y", fill: "steelblue", fillOpacity: 0.3}),
    // Treatment distribution
    Plot.areaY(d3.range(-3, 3, 0.01).map(x => ({
      x: x,
      y: Math.exp(-0.5 * Math.pow(x - cohensD, 2)) / Math.sqrt(2 * Math.PI),
      group: "Treatment"
    })), {x: "x", y: "y", fill: "orange", fillOpacity: 0.3}),
    Plot.ruleX([0], {stroke: "steelblue", strokeWidth: 2}),
    Plot.ruleX([cohensD], {stroke: "orange", strokeWidth: 2}),
    Plot.arrow([{x1: 0, x2: cohensD, y: 0.2}], {
      x1: "x1",
      x2: "x2", 
      y: "y",
      stroke: "red",
      strokeWidth: 2
    })
  ]
})
```

## Multiple Comparisons

### ANOVA-style Visualization

```js
// Generate data for multiple groups
const groups = ["Control", "Treatment A", "Treatment B", "Treatment C", "Combined"];
const anovaData = [];

groups.forEach((group, i) => {
  const mean = 100 + i * 5 + (i === 4 ? 10 : 0); // Combined has extra effect
  const n = 40;
  for (let j = 0; j < n; j++) {
    anovaData.push({
      group: group,
      value: d3.randomNormal(mean, 10)(),
      significant: i === 4
    });
  }
});

// Calculate group means and overall mean
const groupMeans = d3.rollup(anovaData, v => d3.mean(v, d => d.value), d => d.group);
const overallMean = d3.mean(anovaData, d => d.value);
```

```js
Plot.plot({
  title: "Multiple Group Comparison (ANOVA)",
  subtitle: "Comparing treatment effects across groups",
  width: 800,
  height: 500,
  marginBottom: 60,
  y: {grid: true, label: "Response Variable"},
  marks: [
    Plot.dot(anovaData, {
      x: "group",
      y: "value",
      fill: d => d.significant ? "red" : "steelblue",
      fillOpacity: 0.3,
      r: 2
    }),
    Plot.crosshair(anovaData, {
      x: "group",
      y: "value"
    }),
    Plot.ruleY([overallMean], {
      stroke: "black",
      strokeWidth: 2,
      strokeDasharray: "10,5"
    }),
    Plot.text([`Overall Mean: ${overallMean.toFixed(1)}`], {
      x: "Treatment B",
      y: overallMean,
      dy: -10,
      fontSize: 12
    }),
    Plot.dot(Array.from(groupMeans, ([group, mean]) => ({group, mean})), {
      x: "group",
      y: "mean",
      r: 5,
      fill: "red",
      stroke: "white",
      strokeWidth: 2
    })
  ]
})
```

## Summary Statistics Table

```js
const summaryStats = groups.map(group => {
  const groupData = anovaData.filter(d => d.group === group).map(d => d.value);
  return {
    Group: group,
    N: groupData.length,
    Mean: d3.mean(groupData).toFixed(2),
    SD: d3.deviation(groupData).toFixed(2),
    Min: d3.min(groupData).toFixed(2),
    Q1: d3.quantile(groupData, 0.25).toFixed(2),
    Median: d3.median(groupData).toFixed(2),
    Q3: d3.quantile(groupData, 0.75).toFixed(2),
    Max: d3.max(groupData).toFixed(2)
  };
});
```

```js
Inputs.table(summaryStats, {
  columns: ["Group", "N", "Mean", "SD", "Min", "Q1", "Median", "Q3", "Max"]
})
```

## Statistical Methods Notes

The visualizations on this page demonstrate fundamental statistical concepts used in research[^6]. Each plot is designed to be both informative and publication-ready.

### Key Takeaways

1. **Distribution Analysis**: Always examine your data's distribution before choosing statistical tests
2. **Effect Sizes**: Report effect sizes alongside p-values for practical significance
3. **Confidence Intervals**: Provide more information than p-values alone
4. **Multiple Comparisons**: Adjust for multiple testing to avoid false positives
5. **Visualization**: Good statistical graphics can reveal patterns that summary statistics miss

---

[^1]: All statistical visualizations use D3.js and Observable Plot for rendering. The underlying calculations follow standard statistical formulas as described in Cohen (1988) and Tukey (1977).

[^2]: Distribution analysis forms the foundation of statistical inference. Normal distributions are assumed by many parametric tests, making distribution checking a critical first step. See Shapiro-Wilk test for formal normality testing.

[^3]: Box plots were popularized by John Tukey in his 1977 book "Exploratory Data Analysis". They efficiently display the five-number summary: minimum, Q1, median, Q3, and maximum, plus outliers.

[^4]: Correlation does not imply causation. The correlation coefficient r measures linear association strength, ranging from -1 to +1. The coefficient of determination R² represents the proportion of variance explained.

[^5]: The t-test, developed by William Sealy Gosset under the pseudonym "Student", compares means between two groups. It assumes normal distributions and equal variances (for the standard version).

[^6]: For comprehensive statistical methodology, see: Wasserman, L. (2004). "All of Statistics: A Concise Course in Statistical Inference". Springer. ISBN: 978-0-387-40272-7.