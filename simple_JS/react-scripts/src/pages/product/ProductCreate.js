import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_PRODUCT } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { name = '' } = useParams();
  const isEdit = pathname.includes('edit');

  const currentUser = _userList.find((user) => paramCase(user.name) === name);
  return (
    <Page title={!isEdit ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}
          links={[
            { name: 'Tổng quan', href: PATH_DASHBOARD.root },
            { name: 'Sản phẩm', href: PATH_PRODUCT.product.list },
            { name: !isEdit ? 'Thêm mới' : capitalCase(name) },
          ]}
        />

        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
