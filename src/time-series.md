# Time Series Analysis

Time series data is ubiquitous in research, from economic indicators to climate measurements. This page demonstrates various techniques for analyzing and visualizing temporal data[^1].

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {Timeline} from "./components/timeline.js";
```

## Climate Data Analysis

### Temperature Anomalies Over Time

```js
// Generate synthetic climate data
const startDate = new Date(1950, 0, 1);
const endDate = new Date(2024, 0, 1);
const monthlyData = d3.timeMonth.range(startDate, endDate).map(date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Simulate warming trend with seasonal variation
  const trend = (year - 1950) * 0.015;
  const seasonal = Math.sin((month / 12) * 2 * Math.PI) * 10;
  const noise = d3.randomNormal(0, 2)();
  const anomaly = trend + seasonal/10 + noise;
  
  return {
    date: date,
    temperature: anomaly,
    year: year,
    month: month,
    decade: Math.floor(year / 10) * 10
  };
});

// Calculate moving average
const movingAverage = (data, window) => {
  return data.map((d, i) => {
    const start = Math.max(0, i - window/2);
    const end = Math.min(data.length, i + window/2);
    const subset = data.slice(start, end);
    return {
      ...d,
      ma: d3.mean(subset, d => d.temperature)
    };
  });
};

const dataWithMA = movingAverage(monthlyData, 12);
```

```js
Plot.plot({
  title: "Global Temperature Anomalies (1950-2024)",
  subtitle: "Monthly observations with 12-month moving average",
  width: 900,
  height: 400,
  marginLeft: 60,
  x: {label: "Year →"},
  y: {label: "↑ Temperature Anomaly (°C)", grid: true, zero: true},
  marks: [
    Plot.ruleY([0], {stroke: "black", strokeWidth: 1}),
    Plot.line(dataWithMA, {
      x: "date",
      y: "temperature",
      stroke: "lightgray",
      strokeWidth: 0.5,
      opacity: 0.5
    }),
    Plot.line(dataWithMA, {
      x: "date",
      y: "ma",
      stroke: "red",
      strokeWidth: 2,
      tip: true
    }),
    Plot.text(["Monthly Data"], {
      x: new Date(1960, 0),
      y: -3,
      fill: "lightgray"
    }),
    Plot.text(["12-Month Average"], {
      x: new Date(1960, 0),
      y: -2,
      fill: "red"
    })
  ]
})
```

### Seasonal Decomposition

Time series often contain trend, seasonal, and irregular components[^2]. Here we decompose the signal:

```js
// Extract trend, seasonal, and residual components
const yearlyData = d3.rollup(
  monthlyData,
  v => d3.mean(v, d => d.temperature),
  d => d.year
);

const monthlyAverages = d3.rollup(
  monthlyData,
  v => d3.mean(v, d => d.temperature),
  d => d.month
);

const decomposed = monthlyData.map(d => {
  const trend = yearlyData.get(d.year) || 0;
  const seasonal = monthlyAverages.get(d.month) || 0;
  const residual = d.temperature - trend - seasonal;
  
  return {
    date: d.date,
    observed: d.temperature,
    trend: trend,
    seasonal: seasonal,
    residual: residual
  };
});
```

```js
Plot.plot({
  title: "Seasonal Decomposition of Temperature Data",
  width: 900,
  height: 600,
  marginLeft: 60,
  facet: {
    data: decomposed.flatMap(d => [
      {date: d.date, value: d.observed, component: "Observed"},
      {date: d.date, value: d.trend, component: "Trend"},
      {date: d.date, value: d.seasonal, component: "Seasonal"},
      {date: d.date, value: d.residual, component: "Residual"}
    ]),
    y: "component"
  },
  marks: [
    Plot.frame(),
    Plot.line(decomposed.flatMap(d => [
      {date: d.date, value: d.observed, component: "Observed"},
      {date: d.date, value: d.trend, component: "Trend"},
      {date: d.date, value: d.seasonal, component: "Seasonal"},
      {date: d.date, value: d.residual, component: "Residual"}
    ]), {
      x: "date",
      y: "value",
      fy: "component",
      stroke: d => ({
        "Observed": "black",
        "Trend": "red",
        "Seasonal": "blue",
        "Residual": "gray"
      }[d.component])
    })
  ]
})
```

## Economic Indicators

### Multiple Time Series Comparison

```js
// Generate economic indicators
const economicData = [];
const indicators = ["GDP Growth", "Inflation", "Unemployment", "Interest Rate"];
const dates = d3.timeMonth.range(new Date(2019, 0), new Date(2024, 11));

indicators.forEach(indicator => {
  let value = indicator === "GDP Growth" ? 2 :
              indicator === "Inflation" ? 2 :
              indicator === "Unemployment" ? 5 : 3;
  
  dates.forEach(date => {
    // Add random walk with bounds
    value += d3.randomNormal(0, 0.3)();
    value = Math.max(0, Math.min(10, value));
    
    // Add COVID shock
    if (date >= new Date(2020, 2) && date <= new Date(2020, 6)) {
      if (indicator === "Unemployment") value += 5;
      if (indicator === "GDP Growth") value -= 3;
    }
    
    economicData.push({
      date: date,
      indicator: indicator,
      value: value,
      year: date.getFullYear()
    });
  });
});
```

```js
Plot.plot({
  title: "Economic Indicators (2019-2024)",
  subtitle: "Comparing key economic metrics over time",
  width: 900,
  height: 500,
  marginLeft: 60,
  marginRight: 120,
  x: {label: null},
  y: {label: "↑ Percentage (%)", grid: true},
  color: {legend: true},
  marks: [
    Plot.lineY(economicData, {
      x: "date",
      y: "value",
      stroke: "indicator",
      strokeWidth: 2,
      tip: true
    }),
    Plot.ruleX([new Date(2020, 2)], {
      stroke: "red",
      strokeDasharray: "5,5"
    }),
    Plot.text(["Pandemic Start"], {
      x: new Date(2020, 2),
      y: 10,
      fill: "red",
      fontSize: 10,
      dx: 5
    })
  ]
})
```

## Forecasting

### Time Series Forecasting with Confidence Intervals

```js
// Create historical data and forecast
const historicalMonths = 60;
const forecastMonths = 24;
const allMonths = historicalMonths + forecastMonths;

// Generate base time series with trend and seasonality
const forecastData = d3.range(allMonths).map(i => {
  const date = d3.timeMonth.offset(new Date(2020, 0), i);
  const trend = i * 0.5;
  const seasonal = Math.sin((i / 12) * 2 * Math.PI) * 20;
  const noise = i < historicalMonths ? d3.randomNormal(0, 5)() : 0;
  
  const value = 100 + trend + seasonal + noise;
  
  // Generate forecast with increasing uncertainty
  const isForecast = i >= historicalMonths;
  const forecastValue = isForecast ? value + d3.randomNormal(0, 2)() : null;
  const uncertainty = isForecast ? (i - historicalMonths) * 2 : 0;
  
  return {
    date: date,
    actual: !isForecast ? value : null,
    forecast: forecastValue,
    lower: forecastValue ? forecastValue - uncertainty : null,
    upper: forecastValue ? forecastValue + uncertainty : null,
    type: isForecast ? "Forecast" : "Historical"
  };
});
```

```js
Plot.plot({
  title: "Time Series Forecast with Prediction Intervals",
  subtitle: "24-month forecast with 95% confidence bands",
  width: 900,
  height: 400,
  marginLeft: 60,
  x: {label: "Date →"},
  y: {label: "↑ Value", grid: true},
  marks: [
    // Confidence interval
    Plot.areaY(forecastData.filter(d => d.forecast), {
      x: "date",
      y1: "lower",
      y2: "upper",
      fill: "lightblue",
      fillOpacity: 0.3
    }),
    // Historical data
    Plot.line(forecastData.filter(d => d.actual), {
      x: "date",
      y: "actual",
      stroke: "black",
      strokeWidth: 2
    }),
    // Forecast
    Plot.line(forecastData.filter(d => d.forecast), {
      x: "date",
      y: "forecast",
      stroke: "blue",
      strokeWidth: 2,
      strokeDasharray: "5,5"
    }),
    // Dividing line
    Plot.ruleX([d3.timeMonth.offset(new Date(2020, 0), historicalMonths)], {
      stroke: "gray",
      strokeDasharray: "2,2"
    }),
    Plot.text(["Historical"], {
      x: new Date(2022, 0),
      y: 170,
      fill: "black"
    }),
    Plot.text(["Forecast"], {
      x: new Date(2025, 6),
      y: 170,
      fill: "blue"
    })
  ]
})
```

## Event Timeline

Using our custom Timeline component to show research milestones[^3]:

```js
// Define research project milestones
const milestones = [
  {date: new Date(2023, 0, 15), label: "Project Initiation", type: "start"},
  {date: new Date(2023, 2, 1), label: "Literature Review Complete", type: "milestone"},
  {date: new Date(2023, 5, 15), label: "Data Collection Phase 1", type: "data"},
  {date: new Date(2023, 8, 1), label: "Preliminary Analysis", type: "analysis"},
  {date: new Date(2023, 11, 1), label: "Data Collection Phase 2", type: "data"},
  {date: new Date(2024, 2, 15), label: "Statistical Analysis Complete", type: "analysis"},
  {date: new Date(2024, 5, 1), label: "First Draft Complete", type: "writing"},
  {date: new Date(2024, 7, 15), label: "Peer Review", type: "review"},
  {date: new Date(2024, 9, 1), label: "Revisions Complete", type: "writing"},
  {date: new Date(2024, 10, 15), label: "Publication", type: "end"}
];
```

```js
Timeline(milestones, {
  title: "Research Project Timeline",
  startDate: new Date(2023, 0, 1),
  endDate: new Date(2024, 11, 31),
  height: 300,
  width: 900
})
```

## Autocorrelation Analysis

### ACF and PACF Plots

Autocorrelation helps identify patterns and dependencies in time series data[^4].

```js
// Calculate autocorrelation function
function calculateACF(data, maxLag = 20) {
  const mean = d3.mean(data);
  const variance = d3.variance(data);
  const n = data.length;
  
  return d3.range(0, maxLag + 1).map(lag => {
    if (lag === 0) return {lag: 0, acf: 1, significant: true};
    
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += (data[i] - mean) * (data[i + lag] - mean);
    }
    
    const acf = sum / ((n - lag) * variance);
    const criticalValue = 1.96 / Math.sqrt(n); // 95% confidence
    
    return {
      lag: lag,
      acf: acf,
      significant: Math.abs(acf) > criticalValue,
      upper: criticalValue,
      lower: -criticalValue
    };
  });
}

```

```js
const temperatureValues = monthlyData.map(d => d.temperature);
const acfData = calculateACF(temperatureValues, 36);

Plot.plot({
  title: "Autocorrelation Function (ACF)",
  subtitle: "Testing for serial correlation in temperature data",
  width: 800,
  height: 300,
  marginBottom: 40,
  x: {label: "Lag (months) →", domain: [0, 36]},
  y: {label: "↑ ACF", domain: [-0.5, 1], grid: true, zero: true},
  marks: [
    Plot.ruleY([0], {stroke: "black"}),
    Plot.ruleY(acfData[0].upper, {stroke: "blue", strokeDasharray: "5,5", opacity: 0.5}),
    Plot.ruleY(acfData[0].lower, {stroke: "blue", strokeDasharray: "5,5", opacity: 0.5}),
    Plot.lineY(acfData, {
      x: "lag",
      y: "acf",
      stroke: "gray",
      strokeWidth: 0.5
    }),
    Plot.dot(acfData, {
      x: "lag",
      y: "acf",
      r: 3,
      fill: d => d.significant ? "red" : "gray"
    })
  ]
})
```

## Volatility Analysis

### Rolling Standard Deviation

```js
// Calculate rolling volatility
const rollingWindow = 12;
const volatilityData = monthlyData.map((d, i) => {
  const start = Math.max(0, i - rollingWindow);
  const end = i + 1;
  const window = monthlyData.slice(start, end).map(d => d.temperature);
  
  return {
    date: d.date,
    volatility: d3.deviation(window),
    temperature: d.temperature
  };
}).filter((d, i) => i >= rollingWindow);
```

```js
Plot.plot({
  title: "Temperature Volatility Over Time",
  subtitle: "12-month rolling standard deviation",
  width: 900,
  height: 400,
  marginLeft: 60,
  y: {
    label: "↑ Volatility (σ)",
    grid: true
  },
  marks: [
    Plot.areaY(volatilityData, {
      x: "date",
      y: "volatility",
      fill: "steelblue",
      fillOpacity: 0.3
    }),
    Plot.line(volatilityData, {
      x: "date",
      y: "volatility",
      stroke: "steelblue",
      strokeWidth: 2,
      tip: true
    })
  ]
})
```

## Change Point Detection

Identifying structural breaks in time series[^5]:

```js
// Simple change point detection using cumulative sum
function detectChangePoints(data, threshold = 2) {
  const mean = d3.mean(data);
  const sd = d3.deviation(data);
  
  let cusum = 0;
  const cusumData = data.map((value, i) => {
    cusum += (value - mean) / sd;
    return {
      index: i,
      value: value,
      cusum: cusum,
      changePoint: Math.abs(cusum) > threshold
    };
  });
  
  return cusumData;
}

const changePointData = detectChangePoints(temperatureValues.slice(-120)); // Last 10 years
```

```js
Plot.plot({
  title: "Change Point Detection using CUSUM",
  subtitle: "Identifying structural breaks in the time series",
  width: 900,
  height: 400,
  marginLeft: 60,
  facet: {
    data: changePointData.flatMap(d => [
      {index: d.index, value: d.value, type: "Temperature"},
      {index: d.index, value: d.cusum, type: "CUSUM"}
    ]),
    y: "type",
    shareX: true
  },
  marks: [
    Plot.frame(),
    Plot.line(changePointData.flatMap(d => [
      {index: d.index, value: d.value, type: "Temperature"},
      {index: d.index, value: d.cusum, type: "CUSUM"}
    ]), {
      x: "index",
      y: "value",
      fy: "type",
      stroke: d => d.type === "Temperature" ? "black" : "red"
    }),
    Plot.dot(changePointData.filter(d => d.changePoint).flatMap(d => [
      {index: d.index, value: d.value, type: "Temperature"},
      {index: d.index, value: d.cusum, type: "CUSUM"}
    ]), {
      x: "index",
      y: "value",
      fy: "type",
      fill: "red",
      r: 4
    })
  ]
})
```

## Summary Statistics by Period

```js
const periodStats = d3.rollup(
  monthlyData,
  v => ({
    mean: d3.mean(v, d => d.temperature),
    std: d3.deviation(v, d => d.temperature),
    min: d3.min(v, d => d.temperature),
    max: d3.max(v, d => d.temperature),
    trend: (v[v.length-1].temperature - v[0].temperature) / v.length
  }),
  d => d.decade
);

const statsTable = Array.from(periodStats, ([decade, stats]) => ({
  Decade: `${decade}s`,
  "Mean Temp": stats.mean.toFixed(3),
  "Std Dev": stats.std.toFixed(3),
  "Min": stats.min.toFixed(3),
  "Max": stats.max.toFixed(3),
  "Trend": stats.trend.toFixed(4)
}));
```

```js
Inputs.table(statsTable, {
  columns: ["Decade", "Mean Temp", "Std Dev", "Min", "Max", "Trend"]
})
```

## Methods and Applications

Time series analysis is crucial for understanding temporal patterns in data[^6]. Key applications include:

1. **Climate Science**: Analyzing temperature trends and detecting climate change signals
2. **Economics**: Forecasting GDP, inflation, and market indicators
3. **Epidemiology**: Tracking disease spread and seasonal patterns
4. **Engineering**: Monitoring system performance and detecting anomalies

---

[^1]: Time series analysis involves statistical techniques for analyzing time-ordered data points. Box, G.E.P., Jenkins, G.M., Reinsel, G.C., & Ljung, G.M. (2015). Time Series Analysis: Forecasting and Control (5th ed.). Wiley.

[^2]: Seasonal decomposition separates a time series into trend, seasonal, and residual components. The STL (Seasonal and Trend decomposition using Loess) method is particularly robust. Cleveland, R.B., Cleveland, W.S., McRae, J.E., & Terpenning, I. (1990). STL: A seasonal-trend decomposition procedure based on loess. Journal of Official Statistics, 6(1), 3-73.

[^3]: Timeline visualizations help communicate the temporal sequence of events in research projects. They are particularly useful for project management and presenting research progress to stakeholders.

[^4]: The Autocorrelation Function (ACF) and Partial Autocorrelation Function (PACF) are essential tools for identifying the order of ARIMA models. Ljung, G.M., & Box, G.E.P. (1978). On a measure of lack of fit in time series models. Biometrika, 65(2), 297-303.

[^5]: Change point detection identifies times when the statistical properties of a time series change. The CUSUM (Cumulative Sum) method is one of the simplest approaches. Page, E.S. (1954). Continuous inspection schemes. Biometrika, 41(1/2), 100-115.

[^6]: For comprehensive coverage of modern time series methods, see: Hyndman, R.J., & Athanasopoulos, G. (2021). Forecasting: Principles and Practice (3rd ed.). OTexts. Available online at https://otexts.com/fpp3/