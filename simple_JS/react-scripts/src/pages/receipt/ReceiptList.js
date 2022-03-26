import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Card,
  Button,
  Container,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material';

import { PATH_RECEIPT } from '../../routes/paths';
// hooks
import { FormProvider, RHFSelect, RHFTextField } from '../../components/hook-form';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead } from '../../sections/@dashboard/user/list';
import ReceiptListToolbar from '../../sections/@dashboard/receipt/ReceiptListToolbar';
import { fNumber } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'code', label: 'Mã phiếu', alignRight: false },
  { id: 'name', label: 'Tên phiếu', alignRight: false },
  { id: 'typeReceipt', label: 'Loại phiếu', alignRight: false, color: '#00a08a' },
  { id: 'receiptDate', label: 'Ngày nhập', alignRight: false, color: '#28a745' },
  { id: 'numberItem', label: 'Số mặt hàng', alignRight: false },
  { id: 'totalProduct', label: 'Số sp', alignRight: false },
  { id: 'totalPrice', label: 'Chi phí (vnđ)', alignRight: false },
  { id: '' },
];

const ICON = {
  mr: 2,
  width: 20,
  height: 20,
};

// ----------------------------------------------------------------------

const link = process.env.REACT_APP_API_HOST;
console.log('link', link);

export default function UserList() {
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('ten_san_pham');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);
  const [productName, setProductName] = useState('');
  const [productIdModal, setProductIdModal] = useState(0);
  const [colorList, setColorList] = useState([]);

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Keywords: filterName || '' }),
  };

  useEffect(() => {
    fetch(`${link}/receipt/getall`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        setUserList(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleOpenModal = async (id) => {
    await fetch(`${link}/product/getbyid/${id}`)
      .then((response) => response.json())
      .then((data) => setInfoModal(data))
      .catch((error) => console.error('Error:', error));
    setOpenDialogAdd(true);
  };

  const setInfoModal = async (data) => {
    setProductIdModal(data.id);
    setProductName(data.ten_san_pham);

    await fetch(`${link}/color/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Keywords: '' }),
    })
      .then((response) => response.json())
      .then((rs) => setColorList(rs.data));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const methods = useForm({});

  return (
    <Page title="Phiếp nhập hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách phiếu nhập hàng"
          links={[{ name: '', href: '' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_RECEIPT.receipt.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm mới
            </Button>
          }
          sx={{ height: 24 }}
        />

        <Card>
          <ReceiptListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 'auto' }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={userList.length} />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, code, name, typeReceipt, receiptDate, numberItem, totalProduct, totalPrice } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} sx={{ borderBottom: 0.1 }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{code}</TableCell>
                        <TableCell align="center">{name}</TableCell>
                        <TableCell style={{ color: typeReceipt === 1 ? 'rgb(0 224 114)' : 'rgb(255 37 37)' }}>
                          {typeReceipt === 1 ? 'Phiếu nhập hàng' : 'Phiếu phát sinh'}
                        </TableCell>
                        <TableCell align="center"> {receiptDate}</TableCell>
                        <TableCell align="center">{numberItem}</TableCell>
                        <TableCell align="center">{totalProduct}</TableCell>
                        <TableCell align="center">{fNumber(totalPrice)}</TableCell>

                        <TableCell align="center">
                          <Button type="Button" title="Xem chi tiết phiếu" onClick={() => handleOpenModal(id)}>
                            <Iconify icon={'bi:eye-fill'} sx={{ ...ICON }} />
                          </Button>

                          {/*                         
                          <ProductMoreMenu onPlus={() => handleOpenModal(id)} productId={id} /> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Dialog open={openDialogAdd} fullWidth maxWidth="xs" onClose={() => setOpenDialogAdd(false)}>
        <DialogTitle>Thêm mới một phân loại</DialogTitle>
        <FormProvider methods={methods}>
          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              SP: {productName}
            </Typography>
            <Stack spacing={1}>
              <RHFSelect name="color" label="Màu sắc" style={{ marginBottom: '15px' }}>
                <option value={0}>Màu sắc</option>
                {colorList.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="quantity_limit" type="number" label="Giới hạn gửi cảnh báo (sp)" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogAdd(false)}>Đóng</Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Page>
  );
}

// ----------------------------------------------------------------------
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter(
      (_user) =>
        _user.ten_san_pham.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.ma_san_pham.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
