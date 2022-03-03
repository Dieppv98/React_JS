// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  billing: getIcon('ic_billing'),
  static: getIcon('ic_static'),
  settings: getIcon('ic_settings'),
  logout: getIcon('ic_logout'),
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Tổng quan',
    items: [
      { title: 'Phân tích tổng quan', path: '/dashboard/one', icon: ICONS.analytics },
      // { title: 'Two', path: '/dashboard/two', icon: ICONS.ecommerce },
      // { title: 'Three', path: '/dashboard/three', icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Chức năng',
    items: [
      {
        title: 'Danh mục',
        path: '',
        icon: ICONS.dashboard,
        children: [
          { title: 'Sản phẩm', path: 'product/list' },
          { title: 'Size', path: 'size/list' },
          { title: 'Màu sắc', path: 'color/list' },
          { title: 'Người dùng', path: 'user/list' },
          // { title: 'Thông tin cá nhân', path: '' },
          // { title: 'Đổi mật khẩu', path: 'account/changePassword' },
        ],
      },
      {
        title: 'Nhập liệu',
        path: '',
        icon: ICONS.billing,
        children: [
          { title: 'Phiếu nhập hàng', path: '' },
          { title: 'Phiếu doanh thu', path: '' },
        ],
      },
      {
        title: 'Thống kê',
        path: '',
        icon: ICONS.static,
        children: [
          { title: 'Thống kê chi phí', path: '' },
          { title: 'Thống kê doanh thu', path: '' },
        ],
      },
      {
        title: 'Quản trị hệ thống',
        path: '',
        icon: ICONS.settings,
        children: [
          { title: 'Cài đặt quyền truy cập', path: '' },
          { title: 'Cài đặt vai trò', path: '' },
        ],
      },
      // {
      //   title: 'Đăng xuất',
      //   path: '',
      //   icon: ICONS.logout,
      //   onClick: 'handleLogout',
      // },
    ],
  },
];

export default sidebarConfig;
