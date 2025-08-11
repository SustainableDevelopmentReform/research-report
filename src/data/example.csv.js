// Example data loader that generates sample CSV data
// Data loaders run at build time and their results are cached

export default async function() {
  // Generate sample data
  const data = [];
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  for (const month of months) {
    for (const category of categories) {
      data.push({
        month,
        category,
        value: Math.floor(Math.random() * 100) + 20,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      });
    }
  }
  
  // Return data in a format that can be used by visualizations
  return data;
}

/* 
  Usage in your Markdown files:
  
  ```js
  const data = FileAttachment("data/example.csv").csv({typed: true});
  ```
  
  Or for JSON data loaders:
  
  ```js
  const data = FileAttachment("data/example.json").json();
  ```
*/