import { useEffect, useState } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
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

// ----------------------------------------------------------------------

const link = process.env.REACT_APP_API_HOST;

export default function AppCurrentQuantyProduct() {
  const theme = useTheme();

  const [infoChart, setInfoChart] = useState(0);

  useEffect(() => {
    fetch(`${link}/report/loadChartProductOverview`)
      .then((response) => response.json())
      .then((rs) => setInfoChart(rs))
      .catch((error) => console.error('Error:', error));
  }, []);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.success.main, theme.palette.warning.main],
    labels: [
      `Đã bán: ${infoChart.totalSaled} (${infoChart.percentSaled}%)`,
      `Còn tồn: ${infoChart.totalProductInventory} (${infoChart.percentInventory}%)`,
    ],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: () => `sản phẩm`,
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            value: {
              formatter: (val) => fNumber(val),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `${fNumber(sum)} sp`;
              },
              label: 'Tổng nhập',
            },
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Tổng quan tình hình kho hàng" subheader="Hiện tại" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart
          type="donut"
          series={[infoChart.totalSaled, infoChart.totalProductInventory]}
          options={chartOptions}
          height={300}
        />
      </ChartWrapperStyle>
    </Card>
  );
}
