import { createRouter, createWebHistory, useRouter } from 'vue-router'

import { routes } from './routesEnumeration.js'
import {useAuthenticationStore} from '../stores/accessSecurity/AuthenticationStoreImplementation';
import { paths } from '@/router/routesEnumeration';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

export const navigateTo = (route) => {
    let store = useAuthenticationStore();
    let guardianNeeded = false;
    routes.forEach( r => {
        if( r.path === route && r.isProtectedRoute === true ) {
            guardianNeeded = true;
            return;
        }
    })
    if( guardianNeeded === true && store.authenticationData === null ) {
        router.push( paths.login );
    } else {
        router.push( route );
    }
}

export default router
