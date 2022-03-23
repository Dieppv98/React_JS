// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_PRODUCT = '/product';
const ROOTS_SIZE = '/size';
const ROOTS_COLOR = '/color';
const ROOTS_USER = '/user';
const ROOTS_ACCOUNT = '/account';
const ROOTS_RECEIPT = '/receipt';
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
};

export const PATH_PRODUCT = {
  root: ROOTS_PRODUCT,
  product: {
    root: path(ROOTS_PRODUCT, ''),
    list: path(ROOTS_PRODUCT, '/list'),
    new: path(ROOTS_PRODUCT, '/new'),
    edit: path(ROOTS_PRODUCT, '/edit'),
  },
};

export const PATH_SIZE = {
  root: ROOTS_SIZE,
  size: {
    root: path(ROOTS_SIZE, ''),
    list: path(ROOTS_SIZE, '/list'),
  },
};

export const PATH_COLOR = {
  root: ROOTS_COLOR,
  color: {
    root: path(ROOTS_COLOR, ''),
    list: path(ROOTS_COLOR, '/list'),
  },
};

export const PATH_USER = {
  root: ROOTS_USER,
  user: {
    root: path(ROOTS_USER, ''),
    list: path(ROOTS_USER, '/list'),
    new: path(ROOTS_USER, '/new'),
    edit: path(ROOTS_USER, '/edit'),
  },
};

export const PATH_ACCOUNT = {
  root: ROOTS_ACCOUNT,
  account: {
    root: path(ROOTS_ACCOUNT, ''),
    changepassword: path(ROOTS_ACCOUNT, '/changePassword'),
  },
};

export const PATH_RECEIPT = {
  root: ROOTS_RECEIPT,
  receipt: {
    root: path(ROOTS_RECEIPT, ''),
    list: path(ROOTS_RECEIPT, '/list'),
    new: path(ROOTS_RECEIPT, '/new'),
  },
};
