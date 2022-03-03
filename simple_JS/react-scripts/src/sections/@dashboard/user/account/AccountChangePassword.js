import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import useSettings from '../../../../hooks/useSettings';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------

const link = process.env.REACT_APP_API_HOST;

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  // const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu cũ không được bỏ trống!'),
    newPassword: Yup.string().min(6, 'Mật khẩu phải dài ít nhất 6 ký tự').required('Mật khẩu không được bỏ trống!'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không chính xác!'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await fetch(`${link}/user/changePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 0 }),
      })
        .then((response) => response.json())
        .then((rs) => {
          console.log('rs', rs);
          if (rs >= 1) {
            enqueueSnackbar('Cập nhật thành công!');
            reset();
          } else {
            enqueueSnackbar('Cập nhật thất bại!', { variant: 'error' });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Đổi mật khẩu">
      <Container maxWidth={themeStretch ? false : 'sm'}>
        <HeaderBreadcrumbs
          heading="Đổi mật khẩu tài khoản của bạn"
          links={[{ name: '', href: '' }]}
          action={''}
          sx={{ height: 24 }}
        />
        <Card sx={{ p: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} alignItems="flex-end">
              <RHFTextField name="oldPassword" type="password" label="Mật khẩu cũ" />

              <RHFTextField name="newPassword" type="password" label="Mật khẩu mới" />

              <RHFTextField name="confirmPassword" type="password" label="Xác nhận lại mật khẩu" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}
