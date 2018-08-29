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
        },
        crumb: {
            label: 'Content Types',
            url: '/dotAdmin/#/content-types-angular',
            messageKey: 'content-types-angular',
            dataId: undefined,
            queryParams: undefined
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
        },
        crumb: {
            label: 'Categories',
            url: '/dotAdmin/#/c/categories',
            messageKey: 'categories',
            dataId: undefined,
            queryParams: undefined
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
        },
        crumb: {
            label: 'Create Content',
            url: '/dotAdmin/#/content-types-angular/create/content',
            messageKey: 'create-content',
            dataId: undefined,
            queryParams: undefined
        }
    },
    'edit-page': {
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
                        loadChildren: 'app/portlets/dot-edit-page/dot-edit-page.module#DotEditPageModule',
                        path: 'edit-page'
                    },
                    data: {}
                },
                {
                    routeConfig: {
                        loadChildren: 'app/portlets/dot-edit-page/content/dot-edit-content.module#DotEditContentModule',
                        path: 'content'
                    },
                    data: {}
                },
                {
                    routeConfig: {
                        component: {},
                        path: ''
                    },
                    data: {}
                },
            ]
        },
        state: <RouterStateSnapshot>  {
            url: '/edit-page/content?url=%2Fabout-us%2Findex&language_id=1'
        },
        crumb: {
            label: 'Edit Page Content',
            url: '/dotAdmin/#/edit-page/content',
            messageKey: 'edit-page-content',
            dataId: undefined,
            queryParams: {
                url: '/about-us/index',
                language_id: '1'
            }
        }
    },
    'edit-content-type': {
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
                        component: {},
                        path: 'edit/:id'
                    },
                    data: {},
                    params: {
                        id: '4c441ada-944a-43af-a653-9bb4f3f0cb2b'
                    },
                }
            ]
        },
        state: <RouterStateSnapshot>  {
            url: '/dotAdmin/#/content-types-angular/edit/4c441ada-944a-43af-a653-9bb4f3f0cb2b'
        },
        crumb: {
            label: 'Edit Banner',
            url: '/dotAdmin/#/content-types-angular/edit/4c441ada-944a-43af-a653-9bb4f3f0cb2b',
            messageKey: 'edit',
            dataId: '4c441ada-944a-43af-a653-9bb4f3f0cb2b',
            queryParams: undefined
        }
    },
    'page-layout': {
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
                        loadChildren: 'app/portlets/dot-edit-page/dot-edit-page.module#DotEditPageModule',
                        path: 'edit-page'
                    },
                    data: {}
                },
                {
                    routeConfig: {
                        path: '',
                        component: {}
                    },

                },
                {
                    data: {
                        excludeCrumbTrail: true
                    },
                    loadChildren: 'app/portlets/dot-edit-page/layout/dot-edit-layout.module#DotEditLayoutModule',
                    path: 'layout'
                },
                {
                    routeConfig: {
                        path: '',
                        component: {}
                    },

                },
            ]
        },
        state: <RouterStateSnapshot>  {
            url: 'http://localhost:8080/dotAdmin/#/edit-page/layout?url=%2Fabout-us%2Findex&language_id=1'
        },
        crumb: {
            label: 'Edit Page',
            url: '/dotAdmin/#/edit-page',
            messageKey: 'edit-page',
            dataId: undefined,
            queryParams: undefined
        }
    }
};

mockData['edit-page'].route.queryParams = {
    url: '/about-us/index',
    language_id: '1'
};

mockData['edit-content-type'].route.data = {
    contentType: {
        name: 'Banner',
        id: '4c441ada-944a-43af-a653-9bb4f3f0cb2b'
    }
};
