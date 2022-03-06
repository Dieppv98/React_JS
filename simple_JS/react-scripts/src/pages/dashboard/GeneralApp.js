// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  // AppWidget,
  AppWelcome,
  // AppFeatured,
  // AppNewInvoice,
  // AppTopAuthors,
  // AppTopRelated,
  AppAreaInstalled,
  // AppWidgetSummary,
  AppCurrentDownload,
  // AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
