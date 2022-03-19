import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import { alpha, useTheme, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';
import Iconify from '../../../../components/Iconify';
// utils
import { fNumber } from '../../../../utils/formatNumber';
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

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

export default function AppOverviewProfit() {
  const theme = useTheme();
  const [seriesSelect, setSeriesSelect] = useState(1);
  const [dataChart, setDataChart] = useState([]);
  const [seriesData, setSeriesData] = useState([
    { name: 'Chi phí', data: [] },
    { name: 'Doanh thu', data: [] },
  ]);

  useEffect(() => {
    fetch(`${link}/ReportReceipt/loadChartProfitOverview?profitOverview=${seriesSelect}`)
      .then((response) => response.json())
      .then((rs) => {
        setDataChart(rs);
        const data = [
          { name: 'Chi phí', data: [rs.cost] },
          { name: 'Doanh thu', data: [rs.revenue] },
        ];
        setSeriesData(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleChangeSeriesSelect = (event) => {
    console.log('event', event.target.value);
    setSeriesSelect(event.target.value);
    fetch(`${link}/ReportReceipt/loadChartProfitOverview?profitOverview=${event.target.value}`)
      .then((response) => response.json())
      .then((rs) => {
        setDataChart(rs);
        const data = [
          { name: 'Chi phí', data: [rs.cost] },
          { name: 'Doanh thu', data: [rs.revenue] },
        ];
        setSeriesData(data);
        console.log('dataChart', dataChart);
      });
  };

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.error.dark, theme.palette.success.main],

    legend: { floating: true, horizontalAlign: 'center' },
    chart: {
      type: 'bar',
      toolbar: { show: true },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [`Chi phí: ${dataChart.costString} vnđ`, `Doanh thu: ${dataChart.revenueString} vnđ`],
    },
    dataLabels: {
      enabled: true,
      formatter: (w) => `${fNumber(w)} vnđ`,
    },
    yaxis: [
      {
        axisTicks: { show: true },
        title: { text: 'Số tiền (vnđ)' },
        ticks: {
          callback: (label) => `${label / 1000} k`,
        },
        formatter: (w) => `${fNumber(w)} vnđ`,
      },
    ],
    tooltip: {
      y: {
        formatter: (val) => `$${val}`,
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 8,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Tổng quan lợi nhuận"
        subheader={`Lợi nhuận: ${dataChart.profit > 0 ? '+' : ''} ${dataChart.profitString} vnđ | 
        ${dataChart.profit > 0 ? 'Tình hình đang khả quan' : 'Tình hình khổng ổn rồi'}`}
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
      <IconWrapperStyle
        style={{ margin: '5px 24px -20px' }}
        sx={{
          ...(dataChart.profit < 0 && {
            color: 'error.main',
            bgcolor: alpha(theme.palette.error.main, 0.16),
          }),
        }}
      >
        <Iconify
          width={22}
          height={22}
          icon={dataChart.profit >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
        />
      </IconWrapperStyle>

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={seriesData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
