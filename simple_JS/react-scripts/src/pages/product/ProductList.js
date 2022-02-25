import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
// @mui
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Avatar,
  Button,
  Checkbox,
  Container,
  Typography,
  TablePagination,
} from '@mui/material';

import ProductMoreMenu from '../../sections/@dashboard/user/list/ProductMoreMenu';
import { PATH_DASHBOARD, PATH_PRODUCT } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userList } from '../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'ten_san_pham', label: 'Tên sản phẩm', alignRight: false },
  { id: 'ma_san_pham', label: 'Mã sản phẩm', alignRight: false },
  { id: 'total_quantity', label: 'Tổng nhập từ trước đến nay', alignRight: false, color: '#00a08a' },
  { id: 'quantity_current', label: 'Số lượng hiện tại', alignRight: false, color: '#28a745' },
  { id: 'unit_name', label: 'Đơn vị tính', alignRight: false },
  { id: 'created_date', label: 'Ngày tạo', alignRight: false },
  { id: 'lstChiTiet', label: 'Chi tiết', alignRight: false },
  { id: '' },
];

const TABLE_HEAD_DETAIL = [
  { id: 'ten_size', label: 'Size', alignRight: false },
  { id: 'ten_mau_sac', label: 'Tên màu sắc', alignRight: false },
  { id: 'quantity', label: 'Tổng nhập', alignRight: false, color: '#00a08a' },
  { id: 'quantity_current', label: 'Số lượng hiện tại', alignRight: false, color: '#28a745' },
  { id: 'price', label: 'Giá nhập (vnđ)', alignRight: false },
  { id: 'quantity_limit', label: 'Giới hạn cảnh báo', alignRight: false },
];
// ----------------------------------------------------------------------
// console.log(process.env.REACT_APP_API_HOST);
const link = process.env.REACT_APP_API_HOST;

export default function UserList() {
  const theme = useTheme();
  const { themeStretch } = useSettings();

  const [userList, setUserList] = useState([]);
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Keywords: '' }),
  };

  useEffect(() => {
    fetch(`${link}/product/getall`, requestOptions)
      .then((response) => response.json())
      .then((data) => setUserList(data.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(userList);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('ten_san_pham');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userList.filter((user) => !selected.includes(user.ten_san_pham));
    setSelected([]);
    setUserList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Page title="Danh mục sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[{ name: '', href: '' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_PRODUCT.product.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Thêm mới
            </Button>
          }
          sx={{ height: 24 }}
        />

        <Card>
          <UserListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

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
                      lstChiTiet,
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
                          <Table>
                            <UserListHead headLabel={TABLE_HEAD_DETAIL} rowCount={lstChiTiet.length} />
                            {lstChiTiet.map((r) => {
                              const {
                                id,
                                ten_size,
                                ten_mau_sac,
                                quantity,
                                quantity_current,
                                money_str,
                                quantity_limit,
                              } = r;

                              return (
                                // eslint-disable-next-line react/jsx-key
                                <TableBody>
                                  <TableRow hover key={r.id} id={r.id} tabIndex={-1}>
                                    <TableCell align="center">{ten_size}</TableCell>
                                    <TableCell align="center">{ten_mau_sac}</TableCell>
                                    <TableCell align="center" style={{ color: 'rgb(0 206 178)' }}>
                                      {quantity == null ? 'Không có' : quantity}
                                    </TableCell>
                                    <TableCell align="center" style={{ color: 'rgb(0 224 51)' }}>
                                      {quantity_current == null ? 'Không có' : quantity_current}
                                    </TableCell>
                                    <TableCell align="center" style={{ color: '#ff0b0b' }}>
                                      {money_str === '0' ? '' : money_str}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      title="Gửi email thông báo khi số lượng trong kho tới giới hạn!"
                                    >
                                      {quantity_limit == null ? '' : `${quantity_limit} sp`}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              );
                            })}
                          </Table>
                        </TableCell>

                        <TableCell align="center">
                          {/* <UserMoreMenu onDelete={() => handleDeleteUser(id)} userName={ten_san_pham} /> */}
                          <ProductMoreMenu onPlus={() => handleDeleteUser(id)} productId={id} />
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

// export default function PageOne() {
//   const [dataTable, setDatatable] = useState([]);

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/todos')
//       .then((response) => response.json())
//       .then((data) => setDatatable(data))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <Page title="Page One">
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Id</TableCell>
//               <TableCell align="right">Title</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {dataTable.map((row) => (
//               <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                 <TableCell component="th" scope="row">
//                   {row.id}
//                 </TableCell>
//                 <TableCell align="right">{row.title}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Page>
//   );
// }
