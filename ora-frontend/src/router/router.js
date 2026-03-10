import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routesEnumeration.js'

import { useConnectionStore } from '@/stores/connectionStore'
import { useUserAccessStore } from '@/stores/usersAccessStore'

import { useAuthenticationStore } from '../stores/accessSecurity/AuthenticationStoreImplementation';
import { paths } from '@/router/routesEnumeration';
import { navigationBackOffice } from '@/router/navigationBackOffice'
import Cookies from 'js-cookie'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export const navigateTo = (route) => {
    let store = useAuthenticationStore();
    let guardianNeeded = false;
    routes.forEach(r => {
        if (r.path === route && r.isProtectedRoute === true) {
            guardianNeeded = true;
            return;
        }
    })
    if (guardianNeeded === true && store.authenticationData === null) {
        router.push(paths.login);
    } else {
        router.push(route);
    }
}



const extractProtectedFrontRoutes = (navigation) => {
    const list = []

    navigation.forEach(item => {
        if (item.path) {
            list.push({
                path: item.path,
                grants: item.grants || []
            })
        }

        if (item.children) {
            item.children.forEach(child => {
                list.push({
                    path: item.path,
                    grants: child.grants || item.grants || []
                })
            })
        }
    })

    return list
}

const protectedFrontRoutes = extractProtectedFrontRoutes(navigationBackOffice)
router.beforeEach(async (to, from, next) => {
    const connectionStore = useConnectionStore()
    const hasToken = Cookies.get('access_token')

    if ([paths.login, paths.logout, paths.authenticationReturn].includes(to.path)) {
        return next()
    }

    if (!hasToken) {
        return next(paths.login)
    }

    if (!connectionStore.isAuthenticated || !connectionStore.selectedRole) {
        try {
            await connectionStore.fetchUser()
        } catch (error) {
            Cookies.remove('access_token')
            return next(paths.login)
        }
    }

    const matchingFrontRoute = protectedFrontRoutes.find(r => r.path === to.path);

    if (matchingFrontRoute) {
        const myRole = connectionStore.selectedRole;

        const hasAccess = matchingFrontRoute.grants?.includes(myRole.name);

        if (!hasAccess) {
            return next('/403');
        }
    }

    next()
})
export default router
