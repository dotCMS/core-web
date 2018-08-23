import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const mockData = {
    'content-types': {
        route: <ActivatedRouteSnapshot> {
            pathFromRoot: [
                {
                    routeConfig: null,
                },
                {
                    routeConfig: {
                        path: ''
                    },

                },
                {
                    routeConfig: {
                        loadChildren: 'app/portlets/content-types/content-types.module#ContentTypesModule',
                        path: 'content-types-angular'
                    },
                    data: {}
                },
                {
                    routeConfig: {
                        path: ''
                    }
                },
            ]
        },
        state: <RouterStateSnapshot>  {
            url: '/content-types-angular'
        }
    },
    'categories': {
        route: <ActivatedRouteSnapshot> {
            pathFromRoot: [
                {
                    routeConfig: null,
                },
                {
                    routeConfig: {
                        path: ''
                    },

                },
                {
                    routeConfig: {
                        path: 'c',
                    },
                    data: {}
                },
                {
                    params: {
                        id: 'categories'
                    },
                    routeConfig: {
                        path: ':id',
                        component: {}
                    },
                    data: {}
                },
            ]
        },
        state: <RouterStateSnapshot>  {
            url: '/c/categories'
        }
    },
    'content-types-create': {
        route: <ActivatedRouteSnapshot> {
            pathFromRoot: [
                {
                    routeConfig: null,
                },
                {
                    routeConfig: {
                        path: ''
                    },

                },
                {
                    routeConfig: {
                        loadChildren: 'app/portlets/content-types/content-types.module#ContentTypesModule',
                        path: 'content-types-angular'
                    },
                    data: {}
                },
                {
                    routeConfig: {
                        path: 'create/:type',
                        component: {}
                    },
                    params: {
                        type: 'content'
                    },
                    data: {}
                },
            ]
        },
        state: <RouterStateSnapshot>  {
            url: '/content-types-angular/create/content'
        }
    }
};
