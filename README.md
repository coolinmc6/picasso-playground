# README

See the charts in this playground live on [https://coolinmc6.github.io/picasso-playground/](https://coolinmc6.github.io/picasso-playground/).

## Chart Directory

|Chart|Picasso.js Example|My Work|
|:---:|:---|:---|
|Bar with Labels|||
|Line|||
|Point Distribution|||
|Scatterplot|||

## Building a Picasso Chart

#### 1. Get the Data

- There are a number of ways that you can import the data that I need to learn. 
- Importing a JavaScript object:

```js
const data = [
  {
    "type":"matrix",
    "data":[
      ["Year","Sales","Margin"],
      [946702800000,-2025.2609171933589,0.8141905696394521],
      [978325200000,-2667.853260722808,0.948172968335995],
      [1009861200000,-340.12980025757145,1.180761999186037],
      [2429931600000,410574.4343443844,4.680776871803438]
    ]
  }
]
```
- the basic format is an array of objects: `[ {}, {} ]` but there is typically only one object in the array
- the object has a general format like this:

```js
const dataObject = {
  type: "matrix",
  data: [
    ["Column1", "Column2"], // column headings
    [1, 45],
    [2, 55],
    // etc
  ]
}
```
- The data object has a type of "matrix" (if, of course, it is a JS object and not an import of CSV, JSON, etc.) and a
data property that is an array of arrays
- The first array is the column headers
- All other arrays are the data points or the "row" of data

#### 2. Create the Scales

- Building a scale is really not that hard. Because Picasso does that part for you, 
what I'm really doing is building an *object* with the correct properties
- Here are a few examples of scales:

```js
// ========================
// Y-AXIS / Y-COORDINATE

// Line Chart 
const yLeftScale = {
  data: { field: 'Sales' },
  invert: true,
  expand: 0.2
};

// Point Distribution
const yScale = {
  data: { extract: { field: 'Year' } }
}

// Scatterplot
const yScale = {
  data: { field: 'Sales' },
  expand: 0.2,
  invert: true
}

// ========================
// X-AXIS / X-COORDINATE

// Line Chart
const xScale = {
  data: { extract: { field: 'Year' } } 
}

// Scatterplot
const xScale = {
  data: { field: 'Margin' },
  expand: 0.1       
}

// Point Matrix
const xScale = {
  data: { extract: { field: 'Month' } }
}

// ========================
// COLOR

// Point Distribution
const colorScale = {
  data: {
    extract: {
      field: 'Year'
    }
  },
  type: 'color'
}
```
- They all have pretty much the same thing: a `data` property that says what field you need
and then for color, you just need to add the `type`: "color"

#### 3. Create the Axes, Legend, Gridlines

- The way I am building the axes is just by creating objects. They are all very simple because they are just objects.
Unlike scales, the name of the object (e.g. "yAxis") doesn't matter as much as it
does for the scales (and that's just how I've built them - you'll see why below)
- There are just a few main properties:
  - `type` - "axis"
  - `key` - the name of the axis
  - `scale` - what scale are you using; the name of the scale
  - `dock` - where are you putting it? "left", "right", "bottom", "top"?

```js
const yAxis = {
  type: 'axis',
  key: 'y-axis',
  scale: 'yScale', // whatever the name of your scale is
  dock: 'left'
}

const xAxis = {
  type: 'axis',
  key: 'x-axis',
  scale: 'xScale', // whatever the name of your scale is
  dock: 'bottom'
}

// Line Chart
const yLeftAxis = {
  type: 'axis',
  dock: 'left',
  scale: yLeftScale,
  formatter: {
    type: 'd3-number',
    format: '$,.1r'
  },
  settings: {
    labels: {
        fill: colors.sales // #ff0000
    }
  }
}
```
- in the Line Chart axis I am using d3's number formatter to get currency and my labels are red
- Legends are pretty easy as well.
```js
// Legend

// 
const legend = {
  type: 'legend-cat',
  dock: 'right',
  scale: 'color'
}

// 
const legend = {
  type: 'legend-cat',
  dock: 'top',
  scale: {
    type: 'categorical-color',
    data: ['Sales', 'Margin'],
    range: [colors.sales, colors.margin]
  }
}
```
- Gridlines are pretty self-explanatory

```js
const gridlines = {
  key: 'gridlines',
  type: 'grid-line',
  y: 'yScale'
}
```


#### 4. Build the Shapes (Lines, Boxes, etc.)

- It'll be easier to show the various shapes

##### Boxes

- In this example, I used a function to return a box element:

```js
const box = ({ id,start,end,width,fill,minHeightPx}) => {
  const b = {
    key: id,
    type: 'box',
    data: {
      extract: {
        field: 'Dim',
        props: {
          start,
          end
        }
      }
    },
    settings: {
      orientation: 'horizontal',
      major: { scale: 'y' },
      minor: { scale: 'v' },
      box: {
        width,
        fill,
        minHeightPx
      }
    }
  };
  
  return b;
}

const components = [
  // other components
  box({ id: 'bars', start: 0, end: { field: 'Measure' }, width: 0.5, fill: '#fa0' }),
  box({ id: 'target', start: { field: 'Target' }, end: { field: 'Target' }, width: 1.0, fill: '#111', minHeightPx: 3 }),
]
```
- **CM:** Unpack this later - there is a lot here that I don't entirely understand but nothing is super difficult
- See [Bar Chart with Labels](https://coolinmc6.github.io/picasso-playground/proj1/bar-labels1.html) for more

##### Lines
- I also don't entirely understand how line charts work. Here is one example:

```js
const collection = {
  key: 'lines',
  data: {
    extract: {
      field: 'Year',
      props: {
        margin: { field: 'Margin' },
        sales: { field: 'Sales' }
      }
    }
  }
}
// in this example:  t: xScale,
const buildLine = ( scale, ref, stroke, dash) => {
  return {
    type: 'line',
    data: {
      collection: 'lines'
    },
    settings: {
      coordinates: {
        major: { scale: 't' },
        minor: { scale, ref }
      },
      layers: {
        curve: 'monotone',
        line: {
          stroke,
          strokeDashArray: dash
        }
      }
    }
  }
}

picasso.chart({
  element: document.getElementById('container'),
  data,
  settings: {
    collections: [collection],
    scales: {
      yLeftScale,
      yRightScale,
      xScale,
      t: xScale,
    },
    components: [
      yLeftAxis,
      yRightAxis,
      xAxis,
      line('yRightScale', 'margin', colors.margin),
      line('yLeftScale', 'sales', colors.sales, '2 4'),
    ]
  }
})
```

##### Points

- **CM:** Do this when I've learned it

#### 5. Build the Chart



## Concepts

### Dimension vs Measures

**Dimension**

> A dimension is a structure that categorizes facts and measures in order to enable users to answer business questions

It is how we categorize the data. In Picasso, the **dimension is the major scale**.

- [https://data-warehouses.net/glossary/datadimensions.html](https://data-warehouses.net/glossary/datadimensions.html)