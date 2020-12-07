import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { DotRouterService } from '@services/dot-router/dot-router.service';

@Injectable()
export class DotTemplateGuard implements CanLoad {
    constructor(private dotRouterService: DotRouterService) {}

    canLoad(_route: Route, segments: UrlSegment[]): boolean {
        const { path } = segments[1];

        if (path === 'designer' || path === 'advanced') {
            return true;
        }

        this.dotRouterService.gotoPortlet('templates');

        return false;
    }
}
