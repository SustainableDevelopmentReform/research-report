// See https://observablehq.com/framework/config for documentation.
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItKatex from "markdown-it-katex";

export default {
  // The app's title; used in the sidebar and webpage titles.
  title: "Research Report Publishing Platform",
  
  // Configure markdown-it plugins
  markdownIt: (md) => md.use(MarkdownItFootnote).use(MarkdownItKatex),

  // The pages and sections in the sidebar. If you don't specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {name: "Home", path: "/"},
    {
      name: "Data Visualization",
      pages: [
        {name: "Statistical Analysis", path: "/statistical-analysis"},
        {name: "Time Series", path: "/time-series"},
        {name: "Geospatial Data", path: "/geospatial"},
        {name: "Network Analysis", path: "/network-analysis"},
      ]
    },
    {
      name: "Reports & Tables",
      pages: [
        {name: "Data Tables", path: "/data-tables"},
        {name: "Methods & References", path: "/methods"},
      ]
    }
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: `<link rel="icon" href="observable.png" type="image/png" sizes="32x32">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-uj2P2BRlhRHt0cojKSRVqpbGN6F39TGsI+AX8CuaUtL6v6ldH8TZvVoNVVV6b3W4" crossorigin="anonymous">`,

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: `Built with Observable Framework on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}.`,
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};