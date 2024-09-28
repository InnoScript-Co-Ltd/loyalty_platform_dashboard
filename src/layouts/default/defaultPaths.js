import { paths } from "../../constants/paths";

export const items = [
    {
        key: '0',
        label: 'menu_dashboard',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-desktop',
        url: "/dashboard"
    },
    {
        key: "1",
        label: "menu_promotion",
        icon: "pi pi-fw pi-verified",
        url: paths.promotion
    },
    {
        key: "2",
        label: "menu_category",
        icon: "pi pi-fw pi-list",
        url: paths.category
    },
    {
        key: "3",
        label: "menu_item",
        icon: "pi pi-fw pi-box",
        url: paths.item
    },
    {
        key: '4',
        label: 'menu_member',
        icon: 'pi pi-fw pi-user-plus',
        children: [
            {
                key: '4-1',
                label: 'menu_members',
                icon: 'pi pi-fw pi-list',
                url: paths.member
            },
            {
                key: '4-2',
                label: 'menu_member_card',
                icon: 'pi pi-fw pi-id-card',
                url: paths.memberCard
            },
            {
                key: '3-3',
                label: 'menu_discount',
                icon: 'pi pi-fw pi-money-bill',
                url: paths.discount
            },
            {
                key: '3-4',
                label: 'menu_member_order',
                icon: 'pi pi-fw pi-shopping-bag',
                url: paths.memberOrder
            },
        ]
    },
    {
        key: "5",
        label: "menu_user",
        icon: "pi pi-fw pi-user",
        children: [
            {
                key: "5-1",
                label: "menu_list",
                icon: "pi pi-fw pi-list",
                url: paths.user
            },
            {
                key: "5-2",
                label: "menu_create",
                icon: "pi pi-fw pi-plus",
                url: paths.userCreate
            },
        ]
    },
    {
        key: '6',
        label: 'menu_administrator',
        icon: 'pi pi-fw pi-users',
        children: [
            {
                key: '6-1',
                label: 'menu_list',
                icon: 'pi pi-fw pi-list',
                url: paths.admin
            },
            {
                key: '6-2',
                label: 'menu_create',
                icon: 'pi pi-fw pi-plus',
                url: paths.adminCreate
            }
        ]
    },
    {
        key: '7',
        label: 'menu_location',
        icon: 'pi pi-fw pi-flag',
        children: [
            {
                key: '7-1',
                label: 'menu_country',
                icon: 'pi pi-fw pi-list',
                url: paths.country
            },
            {
                key: '7-2',
                label: 'menu_region_and_state',
                icon: 'pi pi-fw pi-list',
                url: paths.regionAndState
            },
            {
                key: '7-3',
                label: 'menu_city',
                icon: 'pi pi-fw pi-list',
                url: paths.city
            },
            {
                key: '7-4',
                label: 'menu_township',
                icon: 'pi pi-fw pi-list',
                url: paths.township
            },
        ]
    },
    {
        key: "8",
        label: "menu_shop",
        icon: "pi pi-fw pi-shopping-bag",
        url: paths.shop
    },
    {
        key: '15',
        url: "/setting",
        label: 'menu_setting',
        icon: 'pi pi-fw pi-cog'
    },
];
