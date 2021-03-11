import Utils from '../../support/utils/Utils';

describe('Setup', () => {
    it.skip('Sets initial DB data', async () => {
        await Utils.DBSeed();
    });
});
