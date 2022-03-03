import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_USER } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewForm from '../../sections/@dashboard/user/UserNewForm';

// ----------------------------------------------------------------------
const link = process.env.REACT_APP_API_HOST;

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { userId = 0 } = useParams();
  const isEdit = pathname.includes('edit');

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    fetch(`${link}/user/getbyid/${userId}`)
      .then((response) => response.json())
      .then((data) => setCurrentUser(data))
      .catch((err) => console.log(err));
  }, [userId]);

  return (
    <Page title={!isEdit ? 'Thêm mới người dùng' : 'Chỉnh sửa người dùng'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới người dùng' : 'Chỉnh sửa người dùng'}
          links={[
            { name: 'Tổng quan', href: PATH_DASHBOARD.root },
            { name: 'Người dùng', href: PATH_USER.user.list },
            { name: !isEdit ? 'Thêm mới' : 'Chỉnh sửa' },
          ]}
        />
        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
