import Utils from '../../support/shared/Utils';

describe('Setup', () => {
    it('Sets initial DB data', async () => {
        await Utils.DBSeed();
    });
});
