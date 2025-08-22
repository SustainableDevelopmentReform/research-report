# Geospatial Data Visualization

Geographic data visualization is essential for spatial analysis in research[^1]. This page demonstrates mapping capabilities using Observable Framework.

```js
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as topojson from "npm:topojson-client";
```

## Choropleth Maps

```js
// Generate sample data for US states
const stateData = [
  {state: "California", value: 85, population: 39538223},
  {state: "Texas", value: 72, population: 29145505},
  {state: "Florida", value: 68, population: 21538187},
  {state: "New York", value: 78, population: 20201249},
  {state: "Pennsylvania", value: 65, population: 13002700},
  {state: "Illinois", value: 70, population: 12812508},
  {state: "Ohio", value: 62, population: 11799448},
  {state: "Georgia", value: 66, population: 10711908},
  {state: "North Carolina", value: 64, population: 10439388},
  {state: "Michigan", value: 61, population: 10077331}
];
```

```js
Plot.plot({
  title: "Research Output by State",
  subtitle: "Top 10 states by population",
  width: 800,
  height: 400,
  marginLeft: 120,
  x: {label: "Research Index →"},
  marks: [
    Plot.barX(stateData.sort((a, b) => b.value - a.value), {
      y: "state",
      x: "value",
      fill: "value",
      tip: true
    })
  ]
})
```

## Point Clustering

```js
// Generate clustered point data
const clusters = 5;
const pointsPerCluster = 50;
const mapPoints = [];

for (let c = 0; c < clusters; c++) {
  const centerLat = 25 + Math.random() * 25;
  const centerLon = -125 + Math.random() * 50;
  
  for (let p = 0; p < pointsPerCluster; p++) {
    mapPoints.push({
      lat: centerLat + d3.randomNormal(0, 2)(),
      lon: centerLon + d3.randomNormal(0, 2)(),
      cluster: `Cluster ${c + 1}`,
      value: Math.random() * 100
    });
  }
}
```

```js
Plot.plot({
  title: "Research Site Locations",
  subtitle: "Clustered sampling sites across regions",
  width: 800,
  height: 500,
  marks: [
    Plot.dot(mapPoints, {
      x: "lon",
      y: "lat", 
      r: d => Math.sqrt(d.value),
      fill: "cluster",
      fillOpacity: 0.6,
      tip: true
    })
  ]
})
```

## Density Heatmaps

```js
Plot.plot({
  title: "Research Activity Density",
  subtitle: "Kernel density estimation of point data",
  width: 800,
  height: 500,
  color: {scheme: "YlOrRd"},
  marks: [
    Plot.density(mapPoints, {
      x: "lon",
      y: "lat",
      fill: "density",
      bandwidth: 20,
      thresholds: 30
    }),
    Plot.dot(mapPoints, {
      x: "lon",
      y: "lat",
      r: 1,
      fill: "black",
      fillOpacity: 0.3
    })
  ]
})
```

## Geographic Patterns

Spatial analysis reveals patterns that might be hidden in non-geographic representations[^2]. Key applications include:

- **Environmental Science**: Climate zones, pollution dispersion
- **Public Health**: Disease spread, healthcare accessibility  
- **Economics**: Regional development, trade flows
- **Urban Planning**: Population density, infrastructure planning

---

[^1]: Geospatial visualization combines cartography with data visualization. See Tufte, E.R. (1983). The Visual Display of Quantitative Information for foundational principles.

[^2]: Spatial autocorrelation and clustering analysis are fundamental to geographic data science. Anselin, L. (1995). Local indicators of spatial association—LISA. Geographical Analysis, 27(2), 93-115.