import PropTypes from 'prop-types';
import * as Yup from 'yup';
import React, { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_PRODUCT } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};
const link = process.env.REACT_APP_API_HOST;

export default function ProductNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar(); // hiển thị thông báo khi cập nhật thành công

  const NewProductSchema = Yup.object().shape({
    ten_san_pham: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    ma_san_pham: Yup.string().required('Mã sản phẩm không được bỏ trống'),
    unit_name: Yup.string().required('Đơn vị tính không được bỏ trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ten_san_pham: currentProduct?.ten_san_pham || '',
      ma_san_pham: currentProduct?.ma_san_pham || '',
      unit_name: currentProduct?.unit_name || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async ({ ma_san_pham, ten_san_pham, unit_name }) => {
    const info = {
      id: currentProduct.id,
      ma_san_pham: ma_san_pham.trim(),
      ten_san_pham: ten_san_pham.trim(),
      unit_name: unit_name.trim(),
    };

    await fetch(`${link}/product/CheckDuplicateMaSanPham?ma_san_pham=${info.ma_san_pham}&id=${info.id}`)
      .then((response) => response.json())
      .then((rs) => {
        if (rs === true) {
          fetch(`${link}/product/checkDuplicateTenSanPham?ten_san_pham=${info.ten_san_pham}&id=${info.id}`)
            .then((data) => data.json())
            .then((result) => {
              if (result === true) {
                fetch(`${link}/product/update`, {
                  method: 'POST',
                  body: JSON.stringify(info),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then((response) => response.json())
                  .then((rs) => {
                    if (rs >= 1) {
                      reset();
                      enqueueSnackbar('Cập nhật thành công!');
                      navigate(PATH_PRODUCT.product.list);
                    } else {
                      enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
                    }
                  })
                  .catch((error) => console.error('Error:', error));
              } else {
                enqueueSnackbar('Tên sản phẩm đã tồn tại!', { variant: 'warning' });
              }
            });
        }
        if (rs === false) {
          enqueueSnackbar(`Mã sản phẩm đã tồn tại!`, { variant: 'warning' });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <RHFTextField name="ten_san_pham" label="Mã sản phẩm" />
              <RHFTextField name="ma_san_pham" label="Tên sản phẩm" />
              <RHFTextField name="unit_name" label="Đơn vị tính" />
            </Box>

            <Stack alignItems="flex-end" textAlign="right" display="block" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Thêm mới' : 'Lưu thay đổi'}
              </LoadingButton>
              {/* <Button variant="contained" href={PATH_PRODUCT.product.list} color={'error'}>
                Quay lại
              </Button> */}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
