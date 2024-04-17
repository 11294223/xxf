import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

// 1. 配置路由
const routes = [
    {
        path: "/",
        component: () => import("../components/xxf-20.vue")
    },
    {
        path: "/xxf-10",
        component: () => import("../components/xxf-10.vue")
    },
    {
        path: "/xxf-20",
        component: () => import("../components/xxf-20.vue")
    },
    {
        path: "/xxf-30",
        component: () => import("../components/xxf-30.vue")
    },
    {
        path: "/xxf-50",
        component: () => import("../components/xxf-50.vue")
    },
];

// 2.返回一个 router 实列，为函数，配置 history 模式
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 3.导出路由   去 main.ts 注册 router.ts
export default router;
