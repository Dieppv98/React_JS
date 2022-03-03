import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton } from '@mui/material';
// routes
import { PATH_USER } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  userId: PropTypes.number,
  onReset: PropTypes.func,
};

export default function UserMoreMenu({ onDelete, userId, onReset }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Xóa
        </MenuItem>

        <MenuItem component={RouterLink} to={`${PATH_USER.root}/edit/${userId}`}>
          <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem onClick={onReset} sx={{ color: '#ff5e00' }}>
          <Iconify icon={'eva:refresh-fill'} sx={{ ...ICON }} />
          Reset mật khẩu
        </MenuItem>
      </MenuPopover>
    </>
  );
}
