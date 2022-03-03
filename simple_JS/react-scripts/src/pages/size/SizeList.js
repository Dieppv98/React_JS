import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
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
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
// hooks
import { FormProvider, RHFTextField } from '../../components/hook-form';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user/list';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'name', label: 'Tên size', alignRight: false },
];

const link = process.env.REACT_APP_API_HOST;
console.log('link', link);

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('ten_san_pham');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState([]);

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Keywords: filterName || '' }),
  };

  useEffect(() => {
    fetch(`${link}/size/get`, requestOptions)
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

  const handleOpenModal = () => {
    setOpenDialogAdd(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  const [openDialogAdd, setOpenDialogAdd] = useState(false);

  const NewDetailSchema = Yup.object().shape({
    name: Yup.string().required('Bạn chưa nhập tên size!'),
  });

  const defaultValues = {
    name: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewDetailSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const info = {
        name: data.name.trim(),
      };
      await fetch(`${link}/size/checkDuplicatedSize?size=${info.name}`)
        .then((response) => response.json())
        .then((rs) => {
          if (rs === true) {
            console.log('rs1234', rs);
            fetch(`${link}/size/add`, {
              method: 'POST',
              body: JSON.stringify(info),
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((result) => {
                if (result === 1) {
                  console.log('Success:', result);
                  enqueueSnackbar('Cập nhật thành công!');
                  setOpenDialogAdd(false);
                  fetch(`${link}/size/get`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => setUserList(data.data));
                } else {
                  enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
                }
              })
              .catch((error) => console.error('Error:', error));
          }
          if (rs === false) {
            enqueueSnackbar(`Size đã tồn tại!`, { variant: 'warning' });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Danh mục size">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách size"
          links={[{ name: '', href: '' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} />}
              onClick={() => handleOpenModal()}
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
                    const { id, name } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{name}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={3} sx={{ py: 3 }}>
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
        <DialogTitle>Thêm mới size</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={1}>
              <RHFTextField name="name" label="Size" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              Lưu
            </Button>
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
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
