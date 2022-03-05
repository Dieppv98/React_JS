// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Đăng nhập">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h2" gutterBottom>
                  Soleil Boutique
                </Typography>
              </Box>
            </Stack>

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
