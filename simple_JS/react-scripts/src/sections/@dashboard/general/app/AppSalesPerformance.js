import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const link = process.env.REACT_APP_API_HOST;

const chart_select = [
  {
    key: '7 ngày gần đây',
    value: '1',
  },
  {
    key: '1 tháng gần đây',
    value: '2',
  },
  {
    key: '3 tháng gần đây',
    value: '3',
  },
  {
    key: 'Từ trước đến nay',
    value: '4',
  },
];

const CHART_DATA = [
  {
    name: 'Doanh thu',
    type: 'column',
    data: [23, 15, 52, 45, 45, 62, 26],
  },
  {
    name: 'Số sản phẩm',
    type: 'area',
    data: [44, 55, 41, 67, 11, 22, 27],
  },
];

export default function AnalyticsWebsiteVisits() {
  const theme = useTheme();
  const [seriesSelect, setSeriesSelect] = useState(1);
  const [dataChart, setDataChart] = useState([]);
  const [seriesData, setSeriesData] = useState([
    { name: 'Chi phí', type: 'column', data: [] },
    { name: 'Doanh thu', type: 'area', data: [] },
  ]);

  const handleChangeSeriesSelect = (event) => {
    console.log('event', event.target.value);
    setSeriesSelect(event.target.value);
    fetch(`${link}/ReportReceipt/loadChartProfitOverview?profitOverview=${event.target.value}`)
      .then((response) => response.json())
      .then((rs) => {
        setDataChart(rs);
        const data = [
          { name: 'Doanh thu', type: 'column', data: [rs.cost] },
          { name: 'Số sản phẩm', type: 'area', data: [rs.revenue] },
        ];
        setSeriesData(data);
        console.log('dataChart', dataChart);
      });
  };

  const chartOptions = merge(BaseOptionChart(), {
    dataLabels: { enabled: true },
    legend: { floating: true, horizontalAlign: 'center' },
    chart: {
      type: 'column',
      toolbar: { show: true },
    },
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '33%' } },
    // title: {
    //   text: 'XYZ - Stock Analysis (2009 - 2016)',
    //   align: 'center',
    //   offsetX: 0,
    // },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '04/01/2003', '04/01/2003', '04/01/2003'],
    xaxis: { type: 'string' },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        title: {
          text: 'Số sản phẩm',
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: 'Doanh thu',
        opposite: true,
        axisTicks: {
          show: true,
        },
        title: {
          text: 'Doanh thu (vnđ)',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Tổng quan hiệu quả doanh số"
        subheader="Phân tích doanh số và doanh thu | Soleil Boutique"
        action={
          <TextField
            select
            fullWidth
            value={seriesSelect}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesSelect}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            {chart_select.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </TextField>
        }
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
