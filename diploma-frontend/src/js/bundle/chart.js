import { Chart } from 'chart.js/auto';
import getMonth from '../helpers/getMonth';
import { amountFormater } from '../helpers/amountViewFormating';
import getMinMaxValue from '../helpers/getMinMaxvalues';

function createChartData(data, from) {
  const chartDataObject = {};

  data.forEach((el) => {
    const month = getMonth(el.date, 'letters');
    if (!chartDataObject[month]) {
      chartDataObject[month] = [];
    }
    if (el.from === from) {
      chartDataObject[month].push(-el.amount);
    } else {
      chartDataObject[month].push(el.amount);
    }
  });

  return chartDataObject;
}

function summOfArr(arr) {
  const result = arr.reduce((sum, current) => sum + Math.abs(current), 0);
  return result;
}

function getExpenseAndEntrance(arr) {
  let expense = 0;
  let entr = 0;

  arr.map((arrayItem) => {
    if (arrayItem > 0) {
      entr += arrayItem;
    } else {
      expense += Math.abs(arrayItem);
    }
    return true;
  });

  return { expense, entr };
}

export default function createChart(element, data, from, stackedView = false) {
  const colorPrimary = '#116ACC';
  const colorPositive = '#76CA66';
  const colorNegative = '#FD4E5D';

  let maxValue = 0;
  let minValue = 0;
  let dataset = [];

  const chartData = createChartData(data, from);

  const chartSumms = Object.values(chartData).map((ar) => summOfArr(ar));
  const minMaxValuesObj = getMinMaxValue(chartSumms);
  maxValue = minMaxValuesObj.max;
  minValue = minMaxValuesObj.min;

  const scalesOptions = {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      afterTickToLabelConversion: (ctx) => {
        ctx.ticks = [];
        ctx.ticks.push({
          value: 0,
          label: `0 ₽`,
        });
        ctx.ticks.push({
          value: minValue,
          label: `${amountFormater(Math.ceil(minValue))} ₽`,
        });
        ctx.ticks.push({
          value: maxValue,
          label: `${amountFormater(Math.ceil(maxValue))} ₽`,
        });
      },
      position: 'right',
      stacked: true,
      grace: Infinity,
      border: {
        display: false,
      },
      ticks: {},
      grid: {
        display: false,
      },
      max: maxValue,
    },
  };

  const labels = Object.keys(chartData);

  if (!stackedView) {
    dataset = [
      {
        data: chartSumms,
        backgroundColor: colorPrimary,
      },
    ];
  } else {
    const datasetValues = { expense: [], entrance: [] };

    for (const key in chartData) {
      if (typeof key === 'string') {
        const currentArr = chartData[key];
        const expAndEnt = getExpenseAndEntrance(currentArr);
        datasetValues.expense.push(expAndEnt.expense);
        datasetValues.entrance.push(expAndEnt.entr);
      }
    }

    dataset = [
      {
        data: datasetValues.expense,
        label: 'Expense',
        backgroundColor: colorNegative,
      },
      {
        data: datasetValues.entrance,
        label: 'Entrance',
        backgroundColor: colorPositive,
      },
    ];
  }

  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    },
  };

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(element, {
    type: 'bar',
    data: {
      labels,
      datasets: dataset,
    },
    valueAxis: {
      title: {
        text: 'millions',
      },
      position: 'right',
    },
    options: {
      maxBarThickness: 58,
      grid: {
        display: false,
      },
      layout: {},
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        chartAreaBorder: {
          borderColor: 'black',
          borderWidth: 1,
        },
      },
      scales: scalesOptions,
    },
    plugins: [chartAreaBorder],
  });
}
