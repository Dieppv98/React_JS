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
} from '@mui/material';

import ProductMoreMenu from '../../sections/@dashboard/user/list/ProductMoreMenu';
import { PATH_PRODUCT, PATH_RECEIPT } from '../../routes/paths';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'ten_san_pham', label: 'Mã phiếu', alignRight: false },
  { id: 'ma_san_pham', label: 'Tên phiếu', alignRight: false },
  { id: 'total_quantity', label: 'Loại phiếu', alignRight: false, color: '#00a08a' },
  { id: 'quantity_current', label: 'Ngày nhập', alignRight: false, color: '#28a745' },
  { id: 'unit_name', label: 'Người nhập', alignRight: false },
  { id: 'created_date', label: 'Số mặt hàng', alignRight: false },
  { id: 'lstChiTiet', label: 'Số sản phẩm', alignRight: false },
  { id: 'lstChiTiet', label: 'Chi phí (vnđ)', alignRight: false },
  { id: '' },
];

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
      .then((data) => setUserList(data.data))
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
          <ReceiptListToolbar filterName={filterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={userList.length} numSelected={selected.length} />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const {
                      id,
                      ten_san_pham,
                      ma_san_pham,
                      total_quantity,
                      quantity_current,
                      unit_name,
                      created_date_str,
                    } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} sx={{ borderBottom: 0.1 }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{ten_san_pham}</TableCell>
                        <TableCell align="center">{ma_san_pham}</TableCell>
                        <TableCell align="center" style={{ color: 'rgb(0 206 178)' }}>
                          {total_quantity}
                        </TableCell>
                        <TableCell align="center" style={{ color: 'rgb(0 224 51)' }}>
                          {quantity_current}
                        </TableCell>
                        <TableCell align="center">{unit_name}</TableCell>
                        <TableCell align="center">{created_date_str}</TableCell>

                        <TableCell align="center">
                          <ProductMoreMenu onPlus={() => handleOpenModal(id)} productId={id} />
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
