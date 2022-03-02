import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth/login',
      element: <Login />,
      children: [
        { element: <Navigate to="auth/login" replace />, index: true },
        { path: 'auth/login', element: <Navigate to="auth/login" replace />, index: true },
      ],
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: '/dashboard', element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: '/dashboard/one', element: <PageOne /> },
        { path: '/dashboard/two', element: <PageTwo /> },
        { path: '/dashboard/three', element: <PageThree /> },
        {
          path: '',
          children: [
            // { element: <Navigate to="/dashboard/user/four" replace />, index: true },
            { path: '/product/list', element: <ProductList /> },
            { path: '/product/new', element: <ProductCreate /> },
            { path: 'product/edit/:productId', element: <ProductCreate /> },
            { path: 'size/list', element: <SizeList /> },
            { path: 'color/list', element: <ColorList /> },

            { path: '/dashboard/user/six', element: <PageSix /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
const PageSix = Loadable(lazy(() => import('../pages/PageSix')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const ProductList = Loadable(lazy(() => import('../pages/product/ProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/product/ProductCreate')));
const SizeList = Loadable(lazy(() => import('../pages/size/SizeList')));
const ColorList = Loadable(lazy(() => import('../pages/color/ColorList')));
