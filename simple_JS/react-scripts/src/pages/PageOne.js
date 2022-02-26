// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// ----------------------------------------------------------------------

export default function PageFour() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Tổng quan">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Trang tổng quan
        </Typography>
        <Typography gutterBottom>Comming soon</Typography>
      </Container>
    </Page>
  );
}
