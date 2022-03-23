import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Toolbar, InputAdornment } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

ReceiptListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ReceiptListToolbar({ filterName, onFilterName }) {
  return (
    <RootStyle>
      <InputStyle
        stretchStart={240}
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Nhập từ khóa cần tìm..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </RootStyle>
  );
}
