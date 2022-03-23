import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_PRODUCT } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import ProductNewForm from '../../sections/@dashboard/product/ProductNewForm';

// ----------------------------------------------------------------------
const link = process.env.REACT_APP_API_HOST;

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { productId = 0 } = useParams();
  const isEdit = pathname.includes('edit');

  const [currentProduct, setCurrentProduct] = useState();

  useEffect(() => {
    fetch(`${link}/product/getbyid/${productId}`)
      .then((response) => response.json())
      .then((data) => setCurrentProduct(data))
      .catch((err) => console.log(err));
  }, [productId]);

  return (
    <Page title={!isEdit ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}
          links={[
            { name: 'Tổng quan', href: PATH_DASHBOARD.root },
            { name: 'Sản phẩm', href: PATH_PRODUCT.product.list },
            { name: !isEdit ? 'Thêm mới' : 'Chỉnh sửa' },
          ]}
        />
        <ProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
