import {ReflectiveInjector} from '@angular/core';
import {ApiRoot} from '../../api/persistence/ApiRoot';
import {UserModel} from '../../api/auth/UserModel';
import {I18nService} from '../system/locale/I18n';
import { BrowserModule } from '@angular/platform-browser';
import {BundleService, IUser, IBundle, IPublishEnvironment} from './bundle-service';
import {RuleModel, IRule, RuleService} from '../../portlets/rule-engine/services/Rule';


const injector = ReflectiveInjector.resolveAndCreate([
  ApiRoot,
  RuleService,
  BundleService,
  I18nService,
  UserModel,
  BrowserModule
]);

describe('Integration.api.services.bundle-service', () => {

  let ruleService: RuleService;
  let bundleService: BundleService;

  beforeEach( () => {
    ruleService = injector.get(RuleService);
    bundleService = injector.get(BundleService);
  });

  it('Should get logged user information', done => {
    bundleService.getLoggedUser().subscribe((user: IUser) => {
      expect(user).toEqual({
        givenName: 'Admin',
        roleId: 'e7d4e34e-5127-45fc-8123-d48b62d510e3',
        surname: 'User',
        userId: 'dotcms.org.1'
      }, 'We get user information correctly');
      done();
    });
  });

  it('Should get bundle store information',  done => {
    bundleService._doLoadBundleStores().subscribe((bundles: IBundle[]) => {
      expect(bundles).toBeDefined();
      done();
    });
  });

  it('Should add rule to bundle',  done => {

    const clientRule: IRule = {
      name: `TestRule-${new Date().getTime()}`
    };
    ruleService.createRule(new RuleModel(clientRule)).subscribe((serverRule: RuleModel) => {
      bundleService.addRuleToBundle(serverRule.key, {id: 'bundleTest', name: 'bundleTest'}).subscribe((result: any) => {
        expect(result.errors).toBe(0, 'error count should be zero');
        expect(result.total).toBe(1, '\'total\' count should be 1');
        done();
      });
    }, (e) => {
      expect(true).toBe(false, 'Should not throw an error.');
      done();
    });
  });

  it('Should get push publish environments',  done => {
    bundleService._doLoadPublishEnvironments().subscribe((publishEnvironments: IPublishEnvironment[]) => {
      console.log(publishEnvironments);
      expect(publishEnvironments).toBeDefined();
      done();
    });
  });

  it('Should push publish rule directly', done => {
    const clientRule: IRule = {
      name: `TestRule-${new Date().getTime()}`
    };
    ruleService.createRule(new RuleModel(clientRule)).subscribe((serverRule: RuleModel) => {
      bundleService.pushPublishRule(serverRule.key, '34e427cf-d7e4-4ff2-8b5f-b432bf0f60e5').subscribe((result: any) => {
        expect(result.errors).toBe(0, 'error count should be zero');
        expect(result.total).toBe(1, '\'total\' count should be 1');
        done();
      });
    }, (e) => {
      expect(true).toBe(false, 'Should not throw an error.');
      done();
    });

  });

});
