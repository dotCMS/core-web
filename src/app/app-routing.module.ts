import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainCoreLegacyComponent } from '@components/main-core-legacy/main-core-legacy-component';
import { MainComponentLegacyComponent } from '@components/main-legacy/main-legacy.component';

import { DotLogOutContainerComponent } from '@components/login/dot-login-component/dot-log-out-container';
import { IframePortletLegacyComponent } from '@components/_common/iframe/iframe-porlet-legacy/index';
import { AuthGuardService } from '@services/guards/auth-guard.service';
import { ContentletGuardService } from '@services/guards/contentlet-guard.service';
import { DefaultGuardService } from '@services/guards/default-guard.service';
import { MenuGuardService } from '@services/guards/menu-guard.service';
import { PublicAuthGuardService } from '@services/guards/public-auth-guard.service';

const PORTLETS_ANGULAR = [
    {
        canActivate: [MenuGuardService],
        canActivateChild: [MenuGuardService],
        path: 'content-types-angular',
        loadChildren: '@portlets/content-types/content-types.module#ContentTypesModule'
    },
    {
        canActivate: [MenuGuardService],
        canActivateChild: [MenuGuardService],
        path: 'rules',
        loadChildren: '@portlets/dot-rules/dot-rules.module#DotRulesModule'
    },
    {
        canActivate: [MenuGuardService],
        canActivateChild: [MenuGuardService],
        path: 'dot-browser',
        loadChildren: '@portlets/dot-site-browser/dot-site-browser.module#DotSiteBrowserModule'
    },
    {
        path: 'pl',
        loadChildren:
            '@components/_common/pattern-library/pattern-library.module#PatternLibraryModule'
    },
    {
        path: 'notLicensed',
        loadChildren: '@components/not-licensed/not-licensed.module#NotLicensedModule'
    },
    {
        path: 'edit-page',
        loadChildren: '@portlets/dot-edit-page/dot-edit-page.module#DotEditPageModule'
    },
    {
        canActivate: [MenuGuardService],
        path: '',
        children: []
    }
];
const PORTLETS_IFRAME = [
    {
        canActivateChild: [MenuGuardService],
        path: 'c',
        children: [
            {
                component: IframePortletLegacyComponent,
                path: ':id',
                children: [
                    {
                        loadChildren:
                            '@portlets/dot-porlet-detail/dot-portlet-detail.module#DotPortletDetailModule',
                        path: ':asset'
                    }
                ]
            },
            {
                path: '',
                children: []
            }
        ]
    },
    {
        canActivateChild: [ContentletGuardService],
        path: 'add',
        children: [
            {
                component: IframePortletLegacyComponent,
                path: ':id'
            },
            {
                path: '',
                children: []
            }
        ]
    }
];

const appRoutes: Routes = [
    {
        canActivate: [PublicAuthGuardService],
        path: 'public',
        loadChildren: '@components/login/login-page.module#LoginPageModule'
    },
    {
        canActivate: [AuthGuardService],
        children: [
            {
                path: 'rules',
                loadChildren: '@portlets/dot-rules/dot-rules.module#DotRulesModule',
                canActivate: [AuthGuardService]
            }
        ],
        component: MainCoreLegacyComponent,
        path: 'fromCore'
    },
    {
        component: DotLogOutContainerComponent,
        path: 'logout'
    },
    {
        canActivate: [AuthGuardService],
        component: MainComponentLegacyComponent,
        children: [...PORTLETS_IFRAME, ...PORTLETS_ANGULAR],
        path: ''
    },
    {
        canActivate: [DefaultGuardService],
        path: '**',
        children: []
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: true
        })
    ]
})
export class AppRoutingModule {}
