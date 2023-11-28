const MIM_ADDRESS = '0xfe19f0b51438fd612f6fd59c1dbb3ea319f433ba';

const BENTOBOX_ADDRESS = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966';
const BENTOBOX_START_BLOCK = 5926250;

module.exports = {
    network: 'bsc',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    beam: {
        address: '0x41D5A04B4e03dC27dC1f5C5A576Ad2187bc601Af',
        startBlock: 28838148,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 30354138,
            oracle: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE'
        },
    },
    levelFinance: {
        address: '0xa32D03497FF5C32bcfeebE6A677Dbe4A496fD918',
        startBlock: 27341967,

        levelFinanceLiquidityPool: '0xA5aBFB56a78D2BD4689b25B8A77fd49Bb0675874',
        levelFinanceJuniorLlp: '0xcc5368f152453d497061cb1fb578d2d3c54bd0a0',
        levelFinanceMezzanineLlp: '0x4265af66537f7be1ca60ca6070d97531ec571bdd',
        levelFinanceSeniorLlp: '0xb5c42f84ab3f786bca9761240546aa9cec1f8821',

        magicLlpSenior: '0xD8Cbd5b22D7D37c978609e4e394cE8B9C003993b',
        magicLlpMezzanine: '0x87aC701ba8acb1966526375da68A692CebB8AF75',
        magicLlpJunior: '0xC094c2a5C349eAd7839C1805126Da71Cc1cc1A39',
    },
    cauldrons: {
        protocolId: BENTOBOX_ADDRESS,
        bentoBoxes: [
            {
                name: 'BentoBox',
                address: BENTOBOX_ADDRESS,
                startBlock: BENTOBOX_START_BLOCK,
            },
            {
                name: 'DegenBox',
                address: '0x090185f2135308BaD17527004364eBcC2D37e5F6',
                startBlock: 12750809,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0x9d9bC38bF4A128530EA45A7d27D0Ccb9C2EbFaf6', // safe.main
            '0x5a1DE6c40EF68A3F00ADe998E9e0D687E4419450', // safe.ops
        ],
    },
};
