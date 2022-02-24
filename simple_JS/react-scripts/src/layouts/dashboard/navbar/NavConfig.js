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
          { title: 'Người dùng', path: '/dashboard/user/four' },
          { title: 'Sản phẩm', path: '/dashboard/user/five' },
          { title: 'Size', path: '/dashboard/user/six' },
          { title: 'Màu sắc', path: '/dashboard/user/six' },
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
    ],
  },
];

export default sidebarConfig;
