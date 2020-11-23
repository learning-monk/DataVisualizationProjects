# Stream Graph with D3.js

**This chart analyses population changes of top 10 economies over the period 1960-2017.**

https://www.investopedia.com/insights/worlds-top-economies/

As per this article, here is the list of top 10 economies in the World by GDP:

1. United States
2. China
3. Japan
4. Germany
5. India
6. United Kingdom
7. France
8. Italy
9. Brazil
10. Canada

**Why choose Stream Graph?**

- Stream Graph is a variation of stacked area chart.
- Instead of plotting values against a fixed axis, values are displaced around a varying central baseline
- Stream Graphs are more aesthetically pleasing
- The size of each individual is proportional to the values in each category
- Stream Graphs are ideal for displaying high volume datasets
- The downside of Stream Graphs is, they are usually cluttered with large volumes of data.

If you would like to learn more about Stream Graph, check this Wikipedia article:

https://en.wikipedia.org/wiki/Streamgraph

**About dataset:**

https://www.kaggle.com/imdevskp/world-population-19602018

- This dataset captures population over time for the top 10 countries
- However, data is in a LONG format
- Our first step in data transformation is to convert this LONG format data to WIDE format
- Then, stack the data which suits the stream graph
