import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';

import { PATH_USER } from '../../routes/paths';
// hooks
import { FormProvider } from '../../components/hook-form';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'fullName', label: 'Tên nhân viên', alignRight: false },
  { id: 'userName', label: 'Mã nhân viên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'tel', label: 'Số điện thoại', alignRight: false },
  { id: 'modifyDate', label: 'Ngày cập nhật', alignRight: false },
  { id: '' },
];

const link = process.env.REACT_APP_API_HOST;
console.log('link', link);

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Keywords: filterName || '' }),
  };

  useEffect(() => {
    fetch(`${link}/user/getall`, requestOptions)
      .then((response) => response.json())
      .then((data) => setUserList(data.data))
      .catch((err) => console.log(err));
  }, []);

  console.log('userList', userList);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleOpenModalDelete = async (id) => {
    setUserId(id);
    await fetch(`${link}/user/getbyid/${id}`)
      .then((response) => response.json())
      .then((data) => setUserName(data.userName))
      .catch((error) => console.error('Error:', error));
    setOpenDialogDelete(true);
  };

  const handleOpenModalReset = async (id) => {
    setUserId(id);
    await fetch(`${link}/user/getbyid/${id}`)
      .then((response) => response.json())
      .then((data) => setUserName(data.userName))
      .catch((error) => console.error('Error:', error));
    setOpenDialogReset(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;
  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && Boolean(filterName);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogReset, setOpenDialogReset] = useState(false);

  const onSubmitReset = async () => {
    try {
      await fetch(`${link}/user/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      })
        .then((response) => response.json())
        .then((rs) => {
          console.log('rs', rs);
          if (rs >= 1) {
            enqueueSnackbar('Cập nhật thành công!');
            setOpenDialogReset(false);
          } else {
            enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitDelete = async () => {
    try {
      await fetch(`${link}/user/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      })
        .then((response) => response.json())
        .then((rs) => {
          console.log('rs', rs);
          if (rs >= 1) {
            enqueueSnackbar('Cập nhật thành công!');
            setOpenDialogDelete(false);
            fetch(`${link}/user/getall`, requestOptions)
              .then((response) => response.json())
              .then((data) => setUserList(data.data))
              .catch((err) => console.log(err));
          } else {
            enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const methods = useForm({
    resolver: yupResolver(),
  });

  const ICON = {
    mr: 2,
    width: 60,
    height: 60,
  };

  return (
    <Page title="Danh mục người dùng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách người dùng"
          links={[{ name: '', href: '' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_USER.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm mới
            </Button>
          }
          sx={{ height: 24 }}
        />

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={userList.length} numSelected={selected.length} />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, fullName, userName, email, tel, modifyDate } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{fullName}</TableCell>
                        <TableCell align="center">{userName}</TableCell>
                        <TableCell align="center">{email}</TableCell>
                        <TableCell align="center">{tel}</TableCell>
                        <TableCell align="center">{modifyDate}</TableCell>
                        <TableCell align="center">
                          <UserMoreMenu
                            onDelete={() => handleOpenModalDelete(id)}
                            userId={id}
                            onReset={() => handleOpenModalReset(id)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={7} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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

      <Dialog open={openDialogDelete} fullWidth maxWidth="xs" onClose={() => setOpenDialogDelete(false)}>
        <FormProvider methods={methods}>
          <DialogContent sx={{ textAlign: 'center', padding: '24px 0px 0px' }}>
            <Iconify icon={'emojione:warning'} sx={{ ...ICON, color: '#ff5e00' }} />
            <Stack spacing={1}>Xác nhận xóa tài khoản "{userName}"</Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => onSubmitDelete()}>
              Xác nhận
            </Button>
            <Button onClick={() => setOpenDialogDelete(false)}>Hủy</Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <Dialog open={openDialogReset} fullWidth maxWidth="xs" onClose={() => setOpenDialogReset(false)}>
        <FormProvider methods={methods}>
          <DialogContent sx={{ textAlign: 'center', padding: '24px 0px 0px' }}>
            <Iconify icon={'emojione:warning'} sx={{ ...ICON, color: '#ff5e00' }} />
            <Stack spacing={1}>Mật khẩu của tài khoản "{userName}"</Stack>
            <Stack spacing={1}>sẽ được đặt về mặc định là:</Stack>
            <Stack spacing={1}>123456789</Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => onSubmitReset()}>
              Xác nhận
            </Button>
            <Button onClick={() => setOpenDialogReset(false)}>Hủy</Button>
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
