import {Inject, Injectable} from '@angular/core';
import {TreeNode} from 'primeng/components/common/api';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/map';
import {Treeable} from '../../core/treeable/shared/treeable.model';
import {SiteBrowserService} from '../../core/util/site-browser.service';

@Injectable()
export class SiteTreetableService {

    constructor
    (
        private siteBrowserService: SiteBrowserService
    ) {
        this.siteBrowserService = siteBrowserService;
    }

    getAssetsUnderSite(siteName: String): Observable<TreeNode[]> {
        let lazyFiles: TreeNode[];
        return this.siteBrowserService.getTreeableAssetsUnderSite(siteName)
            .map((treeables: Treeable[]) => this.extractDataFilter(treeables));
    }

    getAssetsUnderFolder(siteName: String, uri: string): Observable<TreeNode[]> {
        let lazyFiles: TreeNode[];
        return this.siteBrowserService.getTreeableAssetsUnderFolder(siteName, uri)
            .map((treeables: Treeable[]) => this.extractDataFilter(treeables));
    }

    private extractDataFilter(treeables: Treeable[]): TreeNode[] {
        let assets: TreeNode[] = [];
        for (let i = 0; i < treeables.length; i++) {
            let treeable: any = treeables[i];
            let leaf = true;
            if (treeable.type === 'folder') {
                leaf = false;
            }else if (treeable.type === 'file_asset') {
                treeable.type = 'file';
            }
            let treeNode: TreeNode = {
                data: treeable,
                leaf: leaf
            };
            // console.log(treeable);
            assets[i] = treeNode;
        }
        return assets;
    }

    // private formatResult(hosts : Site[], event :any = 0) {
    //     this.filteredHosts = [];
    //     this.sites = hosts;
    //     for (let i = 0; i < this.sites.length; i++) {
    //         let site = this.sites[i].hostname;
    //         if(event && site.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.filteredHosts.push(site);
    //         }else{
    //             this.filteredHosts[i] = this.sites[i].hostname;
    //         }
    //     }
    // }

    // private extractDataDropdown(res: Response): Site[] {
    //     let obj = JSON.parse(res.text());
    //     return obj.entity.sites;
    // }

}