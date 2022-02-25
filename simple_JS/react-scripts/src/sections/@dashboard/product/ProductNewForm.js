import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Button } from '@mui/material';
import Iconify from '../../../components/Iconify';
// routes
import { PATH_PRODUCT } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  // const { enqueueSnackbar } = useSnackbar();

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
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      navigate(PATH_PRODUCT.product.list);
    } catch (error) {
      console.error(error);
    }
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
              <Button variant="contained" href={PATH_PRODUCT.product.list} color={'error'}>
                Quay lại
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
