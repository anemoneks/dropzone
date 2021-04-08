import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Owner',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [
      {
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'mdi mdi-gauge',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/owner/payments',
        title: 'Payments',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/owner/bills',
        title: 'Bills',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'Committee',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [
      {
        path: '/committee/houses',
        title: 'Houses',
        icon: 'mdi mdi-home',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/users',
        title: 'Users',
        icon: 'mdi mdi-account-multiple',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/bills',
        title: 'Bills',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/payments',
        title: 'Payments',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/receipts',
        title: 'Receipts',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/roles',
        title: 'Roles',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/committee/visitors',
        title: 'Visitors',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'Guard',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [
      {
        path: '/guard/houses',
        title: 'Houses',
        icon: 'mdi mdi-home',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/guard/visitors',
        title: 'Visitors',
        icon: 'mdi mdi-home',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'administration',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [
      {
        path: '/component/administration/houses',
        title: 'Houses',
        icon: 'mdi mdi-home',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/administration/users',
        title: 'Users',
        icon: 'mdi mdi-account-multiple',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/administration/bills',
        title: 'Bills',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/administration/payments',
        title: 'Payments',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/component/administration/roles',
        title: 'Roles',
        icon: 'mdi mdi-cash-usd',
        class: '',
        extralink: false,
        submenu: []
      },
    ]
  },
  {
    path: '',
    title: 'administration',
    icon: 'mdi mdi-dots-horizontal',
    class: 'nav-small-cap',
    extralink: true,
    submenu: [],
  },
  {
    path: '/component/card',
    title: 'Card',
    icon: 'mdi mdi-blur-radial',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/accordion',
    title: 'Accordion',
    icon: 'mdi mdi-equal',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/alert',
    title: 'Alert',
    icon: 'mdi mdi-message-bulleted',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/carousel',
    title: 'Carousel',
    icon: 'mdi mdi-view-carousel',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/dropdown',
    title: 'Dropdown',
    icon: 'mdi mdi-arrange-bring-to-front',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/modal',
    title: 'Modal',
    icon: 'mdi mdi-tablet',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/pagination',
    title: 'Pagination',
    icon: 'mdi mdi-backburger',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/poptool',
    title: 'Popover & Tooltip',
    icon: 'mdi mdi-image-filter-vintage',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/progressbar',
    title: 'Progressbar',
    icon: 'mdi mdi-poll',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/rating',
    title: 'Ratings',
    icon: 'mdi mdi-bandcamp',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/tabs',
    title: 'Tabs',
    icon: 'mdi mdi-sort-variant',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/timepicker',
    title: 'Timepicker',
    icon: 'mdi mdi-calendar-clock',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/buttons',
    title: 'Button',
    icon: 'mdi mdi-toggle-switch',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/toast',
    title: 'Toast',
    icon: 'mdi mdi-alert',
    class: '',
    extralink: false,
    submenu: []
  }
];
