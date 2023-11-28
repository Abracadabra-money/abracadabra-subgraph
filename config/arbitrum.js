const MIM_ADDRESS = '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A';

const BENTOBOX_ADDRESS = '0x74c764D41B77DBbb4fe771daB1939B00b146894A';
const BENTOBOX_START_BLOCK = 229409;

module.exports = {
    network: 'arbitrum-one',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    magicGlp: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        startBlock: 55708844,
    },
    beam: {
        address: '0x957A8Af7894E76e16DB17c2A913496a4E60B7090',
        startBlock: 98066187,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 115739967,
            oracle: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612'
        },
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
                address: '0x7C8FeF8eA9b1fE46A7689bfb8149341C90431D38',
                startBlock: 15370694,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0xf46BB6dDA9709C49EfB918201D97F6474EAc5Aea', // safe.main
            '0xA71A021EF66B03E45E0d85590432DFCfa1b7174C', // safe.ops
        ],
    },
    mspell: {
        address: '0x1DF188958A8674B5177f77667b8D173c3CdD9e51',
        startBlock: 8954570,
        spellAddress: '0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF',
        spellOracleAddress: '0x383b3624478124697BEF675F07cA37570b73992f',
    },
};
