import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
// @mui
import {
  Card,
  CardHeader,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
} from '@mui/material';
//
import { FormProvider } from '../../../../components/hook-form';
import { BaseOptionChart } from '../../../../components/chart';
// utils
import { fNumber, fCurrencyVND } from '../../../../utils/formatNumber';
import { UserListHead } from '../../user/list';

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

const TABLE_HEAD_DETAIL = [
  { id: 'name', label: 'Phân loại', alignRight: false },
  { id: 'numberTotal', label: 'Số lượng', alignRight: false },
  { id: 'totalPrice', label: 'Doanh thu', alignRight: false, color: '#00a08a' },
];

export default function AppSalesPerformance() {
  const theme = useTheme();
  const [seriesSelect, setSeriesSelect] = useState(1);
  const [dataChart, setDataChart] = useState([]);
  const [dataStartDate, setDataStartDate] = useState([]);
  const [dataEndDate, setDataEndDate] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState('');
  const [dataDialog, setDataDialog] = useState([]);

  const methods = useForm({});

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

  const getDataDialog = async (startDate, endDate) => {
    await fetch(`${link}/ReportReceipt/getDetailSalesPerformance?startDate=${startDate}&endDate=${endDate}`)
      .then((response) => response.json())
      .then((rs) => setDataDialog(rs))
      .catch((error) => console.error('Error:', error));

    setOpenDialog(true);
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
            const str = `Từ ${dataStartDate[dataPointIndex]} - ${dataEndDate[dataPointIndex]} (doanh thu ${fNumber(
              dataRevenue[dataPointIndex]
            )} vnđ)`;
            setTitleDialog(str);
            getDataDialog(dataStartDate[dataPointIndex], dataEndDate[dataPointIndex]);
          }
        },
      },
    },
    yaxis: [
      {
        // seriesName: 'Số sản phẩm',
        axisTicks: { show: true },
        title: { text: 'Doanh thu (vnđ)', style: { fontSize: '14px', fontFamily: 'ui-rounded' } },
        labels: { show: true, formatter: (value) => fCurrencyVND(value) },
      },
      {
        // seriesName: 'Doanh thu',
        opposite: true,
        axisTicks: { show: true },
        title: { text: 'Số sản phẩm', style: { fontSize: '14px', fontFamily: 'ui-rounded' } },
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

      <Dialog open={openDialog} fullWidth maxWidth="md" onClose={() => setOpenDialog(false)}>
        <DialogTitle style={{ fontSize: '22px' }}>Chi tiết hiệu quả doanh số</DialogTitle>
        <FormProvider methods={methods}>
          <DialogContent style={{ maxHeight: '540px' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {titleDialog}
            </Typography>
            <Stack spacing={1}>
              <TableContainer>
                <Table>
                  <TableBody>
                    {dataDialog.map((row, index) => {
                      const { revenue, productName, numberProduct, lstInfo } = row;
                      return (
                        <TableRow hover key={index} tabIndex={-1} sx={{ borderBottom: 0.1 }}>
                          <TableCell align="center" style={{ padding: '0' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Stack>{productName}</Stack>
                            <Stack>{`(Bán: ${numberProduct} sp - Doanh thu: ${revenue} vnđ)`}</Stack>
                          </TableCell>
                          <TableCell align="center" style={{ padding: '0' }}>
                            <Table>
                              <UserListHead headLabel={TABLE_HEAD_DETAIL} rowCount={lstInfo.length} />
                              {lstInfo.map((r) => {
                                const { name, numberTotal, totalPrice } = r;
                                return (
                                  // eslint-disable-next-line react/jsx-key
                                  <TableBody>
                                    <TableRow hover tabIndex={-1}>
                                      <TableCell>{name}</TableCell>
                                      <TableCell align="center">{numberTotal}</TableCell>
                                      <TableCell align="center" style={{ color: 'rgb(60 221 0)' }}>{`${fNumber(
                                        totalPrice
                                      )} vnđ`}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                );
                              })}
                            </Table>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Card>
  );
}
