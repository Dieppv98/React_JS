// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppCurrentQuantyProduct,
  AppOverviewProfit,
  AppSalesPerformance,
  AppProductPerformance,
} from '../../sections/@dashboard/general/app';
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  return (
    <Page title="Tổng quan">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={7}>
            <AppOverviewProfit />
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <AppCurrentQuantyProduct />
          </Grid>

          <Grid item xs={12} md={6} lg={7}>
            <AppSalesPerformance />
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <AppProductPerformance />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
