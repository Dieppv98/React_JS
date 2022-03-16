// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { AppAreaInstalled, AppCurrentQuantyProduct, AppOverviewProfit } from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  return (
    <Page title="Tổng quan">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={6} lg={7}>
            <AppAreaInstalled />
          </Grid> */}
          <Grid item xs={12} md={6} lg={6}>
            <AppOverviewProfit />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentQuantyProduct />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
