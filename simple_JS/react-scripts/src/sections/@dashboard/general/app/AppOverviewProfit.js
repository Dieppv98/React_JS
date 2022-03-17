import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
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

export default function BankingBalanceStatistics() {
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
      });
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
    colors: [theme.palette.error.main, theme.palette.success.main],
    dataLabels: { enabled: true },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [`Chi phí: ${dataChart.costString} vnđ`, `Doanh thu: ${dataChart.revenueString} vnđ`],
      color: 'red',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (val) => `${val}`,
        title: {
          formatter: (seriesName) => `${seriesName}`,
          color: 'black',
        },
        color: 'black',
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

      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={seriesData} options={chartOptions} height={364} />
      </Box>

      {/* {chart_select.map((item) => (
        <Box key={item.value} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.value === seriesData && (
            <ReactApexChart type="bar" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))} */}
    </Card>
  );
}
