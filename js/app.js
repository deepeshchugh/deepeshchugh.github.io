
import old_data from './data/AVG.json' assert { type: 'json' };

import AAPL from './data/AAPL.json' assert { type: 'json' };
import AXP from './data/AXP.json' assert { type: 'json' };
import BA from './data/BA.json' assert { type: 'json' };
import CAT from './data/CAT.json' assert { type: 'json' };
import CSCO from './data/CSCO.json' assert { type: 'json' };
import CVX from './data/CVX.json' assert { type: 'json' };
import DIS from './data/DIS.json' assert { type: 'json' };
import DWDP from './data/DWDP.json' assert { type: 'json' };
import GS from './data/GS.json' assert { type: 'json' };
import HD from './data/HD.json' assert { type: 'json' };
import IBM from './data/IBM.json' assert { type: 'json' };
import INTC from './data/INTC.json' assert { type: 'json' };
import JNJ from './data/JNJ.json' assert { type: 'json' };
import JPM from './data/JPM.json' assert { type: 'json' };
import KO from './data/KO.json' assert { type: 'json' };
import MCD from './data/MCD.json' assert { type: 'json' };
import MMM from './data/MMM.json' assert { type: 'json' };
import MRK from './data/MRK.json' assert { type: 'json' };
import MSFT from './data/MSFT.json' assert { type: 'json' };
import NKE from './data/NKE.json' assert { type: 'json' };
import PFE from './data/PFE.json' assert { type: 'json' };
import PG from './data/PG.json' assert { type: 'json' };
import TRV from './data/TRV.json' assert { type: 'json' };
import UNH from './data/UNH.json' assert { type: 'json' };
import UTX from './data/UTX.json' assert { type: 'json' };
import V from './data/V.json' assert { type: 'json' };
import VZ from './data/VZ.json' assert { type: 'json' };
import WBA from './data/WBA.json' assert { type: 'json' };
import WMT from './data/WMT.json' assert { type: 'json' };
import XOM from './data/XOM.json' assert { type: 'json' };

const data = [];

for (const d of old_data) {
  var obj = {};
  obj['date'] = d['date'];
  obj['close'] = d['close'];
  data.push(obj)
}
var parseTime = d3.timeParse("%Y-%m-%d");
data.map((d) => d['date'] = parseTime(d.date))

const index_stocks_list = ['AAPL', 'AXP', 'BA', 'CAT', 'CSCO', 'CVX', 'DIS', 'DWDP', 'GS', 'HD', 'IBM', 'INTC', 'JNJ', 'JPM', 'KO', 'MCD', 'MMM', 'MRK', 'MSFT', 'NKE', 'PFE', 'PG', 'TRV', 'UNH', 'UTX', 'V', 'VZ', 'WBA', 'WMT', 'XOM'];

const all_stocks_old_data = {};
all_stocks_old_data['AAPL'] = AAPL;
all_stocks_old_data['AXP'] = AXP;
all_stocks_old_data['BA'] = BA;
all_stocks_old_data['CAT'] = CAT;
all_stocks_old_data['CSCO'] = CSCO;
all_stocks_old_data['CVX'] = CVX;
all_stocks_old_data['DIS'] = DIS;
all_stocks_old_data['DWDP'] = DWDP;
all_stocks_old_data['GS'] = GS;
all_stocks_old_data['HD'] = HD;
all_stocks_old_data['IBM'] = IBM;
all_stocks_old_data['INTC'] = INTC;
all_stocks_old_data['JNJ'] = JNJ;
all_stocks_old_data['JPM'] = JPM;
all_stocks_old_data['KO'] = KO;
all_stocks_old_data['MCD'] = MCD;
all_stocks_old_data['MMM'] = MMM;
all_stocks_old_data['MRK'] = MRK;
all_stocks_old_data['MSFT'] = MSFT;
all_stocks_old_data['NKE'] = NKE;
all_stocks_old_data['PFE'] = PFE;
all_stocks_old_data['PG'] = PG;
all_stocks_old_data['TRV'] = TRV;
all_stocks_old_data['UNH'] = UNH;
all_stocks_old_data['UTX'] = UTX;
all_stocks_old_data['V'] = V;
all_stocks_old_data['VZ'] = VZ;
all_stocks_old_data['WBA'] = WBA;
all_stocks_old_data['WMT'] = WMT;
all_stocks_old_data['XOM'] = XOM;

const all_stocks_data = {};
for (const stock of index_stocks_list) {
  var this_stock = [];
  for (const d of all_stocks_old_data[stock]) {
    var obj = {};
    obj['date'] = d['date'];
    obj['close'] = d['close'];
    this_stock.push(obj)
  }
  var parseTime = d3.timeParse("%Y-%m-%d");
  this_stock.map((d) => d['date'] = parseTime(d.date))
  all_stocks_data[stock] = this_stock;
}


const maxDate = d3.max(data, d => d.date);
const minDate = d3.min(data, d => d.date);
const svgwidth = 400;
const svgHeight = 100;

var spiralFirstGraphStart = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
var spiralFirstGraphEnd = new Date(minDate.getFullYear() + 1, minDate.getMonth(), 1);

var spiralSecondGraphStart = new Date(maxDate.getFullYear() - 1, minDate.getMonth(), 1);
var spiralSecondGraphEnd = new Date(maxDate.getFullYear(), minDate.getMonth(), 1);

const changeDomain = function(originalData, newDomain, additionalColumnName) {

  var timeDiff = d3.min(originalData, d => d.date).getTime() - newDomain[0].getTime();
  const newData = [];
  for (const d of originalData) {
    var obj = {};
    obj['date'] = new Date(d['date'].getTime() - timeDiff);
    obj['date'] = new Date(obj['date'].getFullYear(), obj['date'].getMonth(), obj['date'].getDate())
    obj[additionalColumnName] = d[additionalColumnName];
    newData.push(obj)
  }
  return newData;
}

const makeProgressive = function(originalData, columnName) {
  var starting_val = originalData[0][columnName];
  var offset = 0.0;
  if (starting_val == 0.0) {
    offset = 1.0;
  }
  const newData = [];
  for (const d of originalData) {
    var obj = {};
    obj['date'] = d['date'];
    obj[columnName] = (d[columnName] - starting_val) / (starting_val + offset) ;
    obj[columnName] = obj[columnName] * 100;
    newData.push(obj)
  }
  return newData;
}

const combineDates = function(date_range_1, date_range_2) {
  var combined = date_range_1.concat(date_range_2);
  var unique_combined = combined.filter((item, pos) => combined.indexOf(item) === pos);
  var sorted_combined = unique_combined.sort(function(a,b){
    return a - b
  });
  return sorted_combined;
}

const getRangedData = function(startDate, endDate, columnName)  {
  return getRangedDataFromArray(data, startDate, endDate, columnName);
}

const getRangedDataFromArray = function(array, startDate, endDate, columnName)  {
  const rangedData = [];
  const minYear = 2014;
  const minMonth = 1
  var minDay = 1
  if (startDate.getFullYear() == minYear
    && startDate.getMonth() == minMonth
    && startDate.getDate() == minDay) {
    while (minDay < array[0].date.getDate()) {
      var obj = {};
      obj['date'] = new Date(minYear, minMonth, minDay);
      obj[columnName] = array[0][columnName];
      rangedData.push(obj);
      minDay += 1;
    }
  }
  for (const d of array) {
    if (d['date'] >= startDate && d['date'] <= endDate) {
      var obj = {};
      obj['date'] = d['date'];
      obj[columnName] = d[columnName];
      rangedData.push(obj);
    }
  }
  return rangedData;
}

var globalRangedData_1 = getRangedData(spiralFirstGraphStart, spiralFirstGraphEnd, 'close');
var globalRangedData_2 = getRangedData(spiralSecondGraphStart, spiralSecondGraphEnd, 'close');

const getYearMonthOrder = function(firstMonth) {


  firstMonth = (firstMonth + 3) % 12; //shift by 3 to match graphic labelling order
  var baseOrder = ['Jan', 'Feb', 'Mar' ,'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var idx = 0;
  while (idx < 12) {

    if(idx == firstMonth) {
      return baseOrder;
    }

    baseOrder.push(baseOrder.shift());

    idx++;

  }

}

const getCombinedQuadrantLabels = function(orderOne, orderTwo) {

  var combinedLabels = []
  var idx = 0;
  while (idx < 12) {
    if (idx % 3 == 0) {
      combinedLabels.push(orderOne[idx] + " / " + orderTwo[idx])
    } else {
      combinedLabels.push("")
    }
    idx++;
  }

  return combinedLabels;
}
const genRadialGraph = function(rangedData_1, rangedData_2, columnName) {

  const sideLength = 400
  const inner = 0.35 * sideLength/2;
  const outer = 0.9 * sideLength/2;
  const fixedDateRange = [new Date(1999,1,1), new Date(2000,1,1)]

  var rangedData1MonthOrder = getYearMonthOrder(d3.min(rangedData_1, d => d.date).getMonth());
  var rangedData2MonthOrder = getYearMonthOrder(d3.min(rangedData_2, d => d.date).getMonth());
  const combinedLabels = getCombinedQuadrantLabels(rangedData1MonthOrder, rangedData2MonthOrder);
  var transformedData_1 = makeProgressive(
    changeDomain(rangedData_1, fixedDateRange, columnName), columnName);
  var transformedData_2 = makeProgressive(
    changeDomain(rangedData_2, fixedDateRange, columnName), columnName);
  const xDomain = combineDates(transformedData_1.map((d) => d.date), transformedData_2.map((d) => d.date))
  const xScale = d3.scaleBand(
    xDomain,
    [ 0, 2 * Math.PI ]
  )

  const yDomain = [
    Math.min(d3.min(transformedData_1, d => d[columnName]), d3.min(transformedData_2, d => d[columnName])),
    Math.max(d3.max(transformedData_1, d => d[columnName]), d3.max(transformedData_2, d => d[columnName]))
  ]
  const yScale = d3.scaleLinear( yDomain , [ inner, outer ])

  // var transformedData_1 = changeDomain(rangedData_1, fixedDateRange, columnName);
  // var transformedData_2 = changeDomain(rangedData_2, fixedDateRange, columnName);

  var arc = d3.arc()
    .innerRadius(d => yScale(d.close))
    .outerRadius(d => yScale(d.close + 1))
    .startAngle(d => xScale(d.date))
    .endAngle(d => xScale(d.date) + xScale.bandwidth())
    .padAngle(0.01)
    .padRadius(inner);

  const radial_chart = function () {

    var yAxis = g => g
      .attr('text-anchor', 'middle')
      .call(g => g.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 100)
        .attr('y', (-1 * sideLength/2) + 20)
        .attr('dy', '-1em')
        .style('fill', '#1a1a1a')
        .text('Closing Price % Change (From Selection Start)')
      )
      .call(g => g.selectAll('g')
        .data(yScale.ticks(5))
        .join('g')
        .attr('fill', 'none')
        .call(g => g.append('circle')
          .style('stroke', '#aaa')
          .style('stroke-opacity', 0.5)
          .attr('r', yScale))
        .call(g => g.append('text')
          .attr('y', d => -yScale(d))
          .attr('dy', '0.35em')
          .style('stroke', '#fff')
          .style('stroke-width', 5)
          .style("fill",'#1a1a1a')
          .text(yScale.tickFormat(6, 's'))
          .clone(true)
          .style('stroke', 'none')));



    // var xAxisRed = g => g
    //   .attr('text-anchor', 'middle')
    //   .call(g => g.selectAll('g')
    //     .data([ 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar' ])
    //     .join('g')
    //     .attr('transform', (d,i,arr) => `
    //       rotate(${ i * 360/arr.length })
    //       translate(${inner - 10},0)
    //     `)
    //     .call(g => g.append('line')
    //       .attr('x1', -5)
    //       .attr('x2', outer - inner + 10)
    //       .style('stroke', '#aaa'))
    //     .call(g => g.append('text')
    //       .attr('transform', (d,i,arr) => ((i * 360/arr.length) % 360 > 180
    //         ? "rotate(90)translate(0,16)"
    //         : "rotate(-90)translate(0,-9)"))
    //       .style('font-family', 'sans-serif')
    //       .attr('fill', '#D55E00')
    //       .style('font-size', 10)
    //       .text(d => d)))


    var xAxis = g => g
      .attr('text-anchor', 'middle')
      .call(g => g.selectAll('g')
        .data(combinedLabels)
        .join('g')
        .attr('transform', (d,i,arr) => `
          rotate(${ i * 360/arr.length })
          translate(${inner},0)
        `)
        .call(g => g.append('line')
          .attr('x1', -5)
          .attr('x2', outer - inner + 10)
          .style('stroke', '#aaa'))
        .call(g => g.append('text')
          .attr('transform', (d,i,arr) => ((i * 360/arr.length) % 360 > 180
            ? "rotate(90)translate(0,16)"
            : "rotate(-90)translate(0,-9)"))
          .style('font-family', 'sans-serif')
          .style('font-size', 10)
          // .attr('fill', '#56B4E9')
          .text(d => d)))
    // clear all existing svg elements
    d3.selectAll("#radial > *").remove()
    const svg = d3.select("#radial")

    const container = svg.append('g')
      .attr('class', 'container')
      .attr('transform', `translate(${ sideLength/2 },${ sideLength/2 })`)
      .style('font-size', 10)
      .style('font-family', 'sans-serif')

    const container2 = svg.append('g')
      .attr('class', 'container')
      .attr('transform', `translate(${ sideLength/2 },${ sideLength/2 })`)
      .style('font-size', 10)
      .style('font-family', 'sans-serif')

    container
    .selectAll('path')
      .data( transformedData_1 )
      .join('path')
      .style('fill', d => '#56B4E9')
      .style('stroke', d => '#56B4E9')
      .attr('d', arc)

    container2
      .selectAll('path')
      .data( transformedData_2 )
      .join('path')
      .style('fill', d => '#D55E00')
      .style('stroke', d => '#D55E00')
      .attr('d', arc)

    container.append('g')
      .call(xAxis)

    container.append('g')
      .call(yAxis)

    container2.append('g')
      .call(xAxis)

    container2.append('g')
      .call(yAxis)

    return svg.node()

  }


  const create_radial_chart = function () {
    // d3.select("body")
    //   .append(radial_chart);
    radial_chart();
  }

  create_radial_chart();
}

export function addDraggable(svg, xScale, yScale, marginLeft, marginTop, marginRight, marginBottom) {
  var rect_width = xScale(new Date(2019, 0, 0)) - xScale(new Date(2018, 0, 0));

  var rect = svg.append('rect')
    .attr('x', xScale(spiralFirstGraphStart))
    .attr('y', marginTop)
    .attr('width', rect_width)
    .attr('height', svgHeight)
    .attr('stroke', 'black')
    .attr('fill', '#56B4E9')
    .attr('fill-opacity', 0.2)
    .attr('stroke-dasharray', "0 5")
    .attr("id", 'blue_selection')
    .classed('draggable',true);
  rect.on('mousedown', startDrag);
  rect.on('mousemove', drag);
  rect.on('mouseup', endDrag);
  rect.on('mouseleave', endDrag);

  var rect_2 = svg.append('rect')
    .attr('x', xScale(spiralSecondGraphStart))
    .attr('y', marginTop)
    .attr('width', rect_width)
    .attr('height', svgHeight)
    .attr('stroke', 'black')
    .attr('fill', '#D55E00')
    .attr('fill-opacity', 0.2)
    .attr('stroke-dasharray', "0 5")
    .attr('border-top', 0)
    .attr('border-bottom', 0)
    .attr("id", 'red_selection')
    .classed('draggable',true);
  rect_2.on('mousedown', startDrag);
  rect_2.on('mousemove', drag);
  rect_2.on('mouseup', endDrag);
  rect_2.on('mouseleave', endDrag);

  var selectedElement = false, offset;

  function startDrag() {
    var target = d3.select(d3.event.target);
    if (d3.event.target.classList.contains('draggable')) {
      selectedElement = d3.event.target;
      offset = getMousePosition(d3.event, d3.event.target);
      offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
    }
  }
  function drag() {
    if (selectedElement) {
      d3.event.preventDefault();
      var selection = d3.event.target.id;
      var coord = getMousePosition(d3.event, d3.event.target);
      selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
      var x = coord.x - offset.x;
      var xDate = xScale.invert(x);
      var snapToGrid = getGridSnap(xDate);
      var updated_coord_x = xScale(new Date(snapToGrid.snapYear, snapToGrid.snapMonth));
      selectedElement.setAttributeNS(null, "x", updated_coord_x);
      if (selection == 'red_selection') {
        globalRangedData_2 = getRangedData(new Date(snapToGrid.snapYear, snapToGrid.snapMonth, 1), new Date(snapToGrid.snapYear + 1, snapToGrid.snapMonth, 1), 'close');
      } else {
        globalRangedData_1 = getRangedData(new Date(snapToGrid.snapYear, snapToGrid.snapMonth, 1), new Date(snapToGrid.snapYear + 1, snapToGrid.snapMonth, 1), 'close');
      }
      update_info_boxes(d3.min(globalRangedData_1, d => d['date']),
        d3.max(globalRangedData_1, d => d['date']),
        d3.min(globalRangedData_2, d => d['date']),
        d3.max(globalRangedData_2, d => d['date']))
      genRadialGraph(globalRangedData_1, globalRangedData_2, 'close')
      create_indv_charts(d3.min(globalRangedData_1, d => d['date']),
        d3.max(globalRangedData_1, d => d['date']),
        d3.min(globalRangedData_2, d => d['date']),
        d3.max(globalRangedData_2, d => d['date']));
    }
  }
  function getGridSnap(xDate) {
    var xMonth = xDate.getMonth();
    var xYear = xDate.getFullYear();
    var xMinMonth = minDate.getMonth();
    var xMinYear = minDate.getFullYear();
    var xMaxMonth = maxDate.getMonth();
    var xMaxYear = maxDate.getFullYear();
    if (xYear < xMinYear) {
      return {
        'snapMonth' : xMinMonth,
        'snapYear' : xMinYear
      }
    } else if (xYear == xMinYear && xMonth < xMinMonth) {
      return {
        'snapMonth' : xMinMonth,
        'snapYear' : xMinYear
      }
    } else if (xYear > xMaxYear) {
      return {
        'snapMonth' : xMaxMonth,
        'snapYear' : xMaxYear
      }
    } else if (xYear == xMaxYear && xMonth > xMaxMonth) {
      return {
        'snapMonth' : xMaxMonth,
        'snapYear' : xMaxYear
      }
    } else {
      return {
        'snapMonth' : xMonth,
        'snapYear' : xYear
      }
    }
  }
  function endDrag(evt) {
    selectedElement = null;
  }
  function getMousePosition(evt, node) {
    var CTM = node.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }
}

const chart = function() {
  // Declare the chart dimensions and margins.
  const width = svgwidth;
  const height = svgHeight;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const xScale = d3.scaleUtc(d3.extent(data, d => d.date),
    [marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const yScale = d3.scaleLinear([0, d3.max(data, d => d.close)],
    [height - marginBottom, marginTop]);



  // Declare the line generator.
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.close));

  // Create the SVG container.
  const svg = d3.select("#selection")
  // var one_year = x(new Date("2017-01-01T05:00Z")); //x(new Date("2000-01-01T16:00Z"));

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Daily close ($)"));

  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", '#F0E442')
    .attr("stroke-width", 1.5)
    .attr("d", line(data));

  addDraggable(svg, xScale, yScale, marginLeft, marginTop, marginRight, marginBottom, minDate, maxDate);
  return svg.node();
}

const create_chart = function () {
  // d3.select("body")
  //   .append(chart);
  chart();
}

const indv_chart = function(rangedData_1, rangedData_2, columnName, stockName) {
  // Declare the chart dimensions and margins.
  const width = 190;
  const height = 190;
  const marginTop = 30;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 30;


  // Declare the x (horizontal position) scale.
  const xScale = d3.scaleUtc(d3.extent(rangedData_1, d => d.date),
    [marginLeft, width - marginRight]);

  var ymax = Math.max(
    d3.max(rangedData_1, d => d[columnName]), d3.max(rangedData_2, d => d[columnName]));
  // Declare the y (vertical position) scale.
  const yScale = d3.scaleLinear([0, ymax],
    [height - marginBottom, marginTop]);

  var rangedDateUpdated_2 = changeDomain(rangedData_2,
    [d3.min(rangedData_1, d => d['date'])], columnName);
  // Declare the line generator.
  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d[columnName]));

  // Create the SVG container.
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
  // var one_year = x(new Date("2017-01-01T05:00Z")); //x(new Date("2000-01-01T16:00Z"));

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", width / 4)
        .attr("y", marginBottom - 20)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("-> Blue Selection Date"))
    .call(g => g.append("text")
      .attr("x", width / 2.5)
      .attr("y", marginBottom - 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(stockName));

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(yScale).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", marginTop)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Daily close ($)"));


  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", '#56B4E9')
    .attr("stroke-width", 1.5)
    .attr("d", line(rangedData_1));
  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", '#D55E00')
    .attr("stroke-width", 1.5)
    .attr("d", line(rangedDateUpdated_2));

  return svg.node();
}

const create_indv_chart = function (rangedData1, rangedData2, stockName) {
  var node = indv_chart(rangedData1, rangedData2, 'close', stockName);
  d3.select("#auxiliary-displays")
    .append(() => node);
}

const create_indv_charts = function (startDate1, endDate1, startDate2, endDate2) {
  d3.selectAll("#auxiliary-displays > *").remove()

  for (const stock of index_stocks_list) {
    var stock_data = all_stocks_data[stock];
    create_indv_chart(
      getRangedDataFromArray(stock_data, startDate1, endDate1, 'close'),
      getRangedDataFromArray(stock_data, startDate2, endDate2, 'close'),
      stock
    )
  }
}

const update_info_boxes = function (rangeOneStart, rangeOneEnd, rangeTwoStart, rangeTwoEnd) {
  d3.selectAll("#blue-range > *").remove()
  d3.selectAll("#red-range > *").remove()

  d3.select("#blue-range")
    .append('span')
    .html(("Blue Selection: "
      + rangeOneStart.toLocaleString('en-us',{month:'short', year:'numeric'})
      + " - "
      + rangeOneEnd.toLocaleString('en-us',{month:'short', year:'numeric'})
      ));

  d3.select("#red-range")
    .append('span')
    .html(("Red Selection: "
      + rangeTwoStart.toLocaleString('en-us',{month:'short', year:'numeric'})
      + " - "
      + rangeTwoEnd.toLocaleString('en-us',{month:'short', year:'numeric'})
    ));
}



create_chart();
update_info_boxes(spiralFirstGraphStart, spiralFirstGraphEnd,
  spiralSecondGraphStart, spiralSecondGraphEnd)
create_indv_charts(spiralFirstGraphStart, spiralFirstGraphEnd,
  spiralSecondGraphStart, spiralSecondGraphEnd);
genRadialGraph(globalRangedData_1, globalRangedData_2, 'close');
