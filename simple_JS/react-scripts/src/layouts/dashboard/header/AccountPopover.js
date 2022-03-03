import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Divider, MenuItem, Avatar, Button } from '@mui/material';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
// routes
import { PATH_AUTH, PATH_ACCOUNT } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Đã xảy ra lỗi khi đăng xuất!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg" alt="Rayan Moran" />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        style={{ left: '50px' }}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <MenuItem sx={{ m: 1 }}>
          <Button variant="text" startIcon={<Iconify icon={'ic:sharp-account-circle'} />} style={{ color: '#ff45f1' }}>
            Thông tin cá nhân
          </Button>
        </MenuItem>
        <MenuItem sx={{ m: 1 }} to={PATH_ACCOUNT.account.changepassword}>
          <Button
            variant="text"
            component={RouterLink}
            to={PATH_ACCOUNT.account.changepassword}
            startIcon={<Iconify icon={'ic:sharp-change-circle'} />}
            style={{ color: '#ff5e00' }}
          >
            Đổi mật khẩu
          </Button>
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1 }} onClick={handleLogout}>
          <Button variant="text" startIcon={<Iconify icon={'mdi:logout'} />} style={{ color: 'red' }}>
            Đăng xuất
          </Button>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
