import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
//
import { BaseOptionChart } from '../../../../components/chart';
// utils
import { fNumber, fCurrencyVND } from '../../../../utils/formatNumber';

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

export default function AppSalesPerformance() {
  const theme = useTheme();
  const [seriesSelect, setSeriesSelect] = useState(1);
  const [dataChart, setDataChart] = useState([]);
  const [dataStartDate, setDataStartDate] = useState([]);
  const [dataEndDate, setDataEndDate] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);

  useEffect(() => {
    fetch(`${link}/ReportReceipt/drawChartSalesPerformance?salesPerformance=${seriesSelect}`)
      .then((response) => response.json())
      .then((rs) => {
        setDataChart(rs);
        setDataStartDate(rs.map((x) => x.startDate));
        setDataEndDate(rs.map((x) => x.endDate));
        setDataRevenue(rs.map((x) => x.numberRevenue));
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleChangeSeriesSelect = (event) => {
    setSeriesSelect(event.target.value);
    fetch(`${link}/ReportReceipt/drawChartSalesPerformance?salesPerformance=${event.target.value}`)
      .then((response) => response.json())
      .then((rs) => {
        setDataChart(rs);
        setDataStartDate(rs.map((x) => x.startDate));
        setDataEndDate(rs.map((x) => x.endDate));
        setDataRevenue(rs.map((x) => x.numberRevenue));
      });
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { floating: true, horizontalAlign: 'center' },
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '33%' } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: dataChart.map((o) => o.ojectName),
    xaxis: { type: 'string' },
    dataLabels: { enabled: true, formatter: (value) => `${fNumber(value)}` },
    chart: {
      type: 'column',
      toolbar: { show: true },
      events: {
        click: (event, chartContext, config) => {
          const dataPointIndex = config.dataPointIndex;
          if (dataPointIndex > -1) {
            console.log('dataStartDate', dataStartDate[dataPointIndex]);
            console.log('dataEndDate', dataEndDate[dataPointIndex]);
            console.log('dataRevenue', dataRevenue[dataPointIndex]);
          }
        },
      },
    },
    yaxis: [
      {
        seriesName: 'Số sản phẩm',
        axisTicks: { show: true },
        title: { text: 'Số sản phẩm', style: { fontSize: '14px', fontFamily: 'ui-rounded' } },
        labels: { show: true, formatter: (value) => fCurrencyVND(value) },
      },
      {
        seriesName: 'Doanh thu',
        opposite: true,
        axisTicks: { show: true },
        title: { text: 'Doanh thu (vnđ)', style: { fontSize: '14px', fontFamily: 'ui-rounded' } },
        labels: { show: true, formatter: (value) => fCurrencyVND(value) },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: theme.palette.background.primary,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${fNumber(y)}`;
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
        <ReactApexChart
          type="line"
          series={[
            {
              name: 'Doanh thu',
              type: 'column',
              data: dataChart.map((o) => o.numberRevenue),
            },
            {
              name: 'Số sản phẩm',
              type: 'area',
              data: dataChart.map((o) => o.numberProduct),
            },
          ]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
