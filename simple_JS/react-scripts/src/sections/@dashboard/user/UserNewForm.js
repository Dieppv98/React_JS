import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import imageToBase64 from 'image-to-base64/browser';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_USER } from '../../../routes/paths';

import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Tên đầy đủ không được bỏ trống!'),
    userName: Yup.string().required('Tên tài khoản không được bỏ trống!'),
    password: Yup.string().required('Mật khẩu không được bỏ trống!').min(6, 'Mật khẩu dài ít nhất 6 ký tự!'),
    email: Yup.string().email('Email không đúng định dạng!'),
    tel: Yup.string(),
    address: Yup.mixed(), // url ảnh avatar
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: currentUser?.fullName?.trim() || '',
      userName: currentUser?.userName?.trim() || '',
      email: currentUser?.email?.trim() || '',
      password: '',
      tel: currentUser?.tel?.trim() || '',
      address: currentUser?.address?.trim() || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      console.log('data', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Cập nhật thành công!');
      navigate(PATH_USER.user.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log('file', file);

      if (file) {
        setValue(
          'address',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }} style={{ paddingBottom: '25px', paddingTop: '65px' }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="address"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Khả dụng: *.jpeg, *.jpg, *.png, *.gif
                    <br /> Dung lượng tối đa: {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="fullName" label="Tên đầy đủ" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="userName" label="Tên tài khoản" />

              {/* {!isEdit && <RHFTextField name="password" label="Mật khẩu" />} */}
              <RHFTextField name="password" label="Mật khẩu" />
              <RHFTextField name="tel" label="Số điện thoại" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
