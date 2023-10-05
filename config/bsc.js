module.exports = {
    network: 'bsc',
    beam: {
        address: '0x41D5A04B4e03dC27dC1f5C5A576Ad2187bc601Af',
        startBlock: 28838148,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 30354138,
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
};
