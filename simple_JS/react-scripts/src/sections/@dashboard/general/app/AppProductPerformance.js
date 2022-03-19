import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, TextField } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------
const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;
const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

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

// ----------------------------------------------------------------------

export default function AppProductPerformance() {
  const theme = useTheme();
  const [seriesSelect, setSeriesSelect] = useState(1);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    fetch(`${link}/ReportReceipt/loadChartPie?salesProductOverview=${seriesSelect}`)
      .then((response) => response.json())
      .then((rs) => {
        setSeriesData(rs);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleChangeSeriesSelect = (event) => {
    console.log('event', event.target.value);
    setSeriesSelect(event.target.value);
    fetch(`${link}/ReportReceipt/loadChartPie?salesProductOverview=${event.target.value}`)
      .then((response) => response.json())
      .then((rs) => {
        setSeriesData(rs);
      })
      .catch((error) => console.error('Error:', error));
  };

  const chartOptions = merge(BaseOptionChart(), {
    labels: seriesData.map((o) => o.productName),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: true },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => `${fNumber(seriesName)} sản phẩm`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            value: {
              formatter: (val) => fNumber(val),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${fNumber(sum)} sp`;
              },
              label: 'Tổng bán',
              color: theme.palette.text.primary,
            },
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="Tổng quan doanh số sản phẩm"
        subheader="Tỷ lệ doanh số sản phẩm đã bán"
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
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart
          type="pie"
          series={seriesData.map((o) => o.numberProductSaled)}
          options={chartOptions}
          height={280}
        />
      </ChartWrapperStyle>
    </Card>
  );
}
