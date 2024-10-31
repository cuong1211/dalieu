// configs/menu.ts

interface MenuItem {
    title: string;
    icon?: string;
    route?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Yêu cầu cứu trợ',
        icon: 'bi bi-list-task',
        route: 'request.index',
    },
    {
        title: 'Hệ thống',
        icon: 'bi bi-gear',
        children: [
            {
                title: 'Quản lý tài khoản',
                route: 'user.index',
                icon: 'bi bi-person-gear'
            },
            {
                title: 'Phân quyền',
                route: 'permission',
                icon: 'bi bi-shield-lock'
            },
            {
                title: 'Vai trò',
                route: 'role',
                icon: 'bi bi-person-badge'
            },
            // {
            //     title: 'Cấu hình',
            //     route: 'settings',
            //     icon: 'bi bi-sliders'
            // }
        ],
    },
    // {
    //     title: 'Báo cáo & Thống kê',
    //     icon: 'bi bi-graph-up',
    //     children: [
    //         {
    //             title: 'Báo cáo chiến dịch',
    //             route: 'report.mission',
    //             icon: 'bi bi-file-earmark-text'
    //         },
    //         {
    //             title: 'Thống kê vật tư',
    //             route: 'report.supplies',
    //             icon: 'bi bi-bar-chart-line'
    //         },
    //         {
    //             title: 'Hoạt động TNV',
    //             route: 'report.volunteer',
    //             icon: 'bi bi-person-video2'
    //         }
    //     ]
    // }
];