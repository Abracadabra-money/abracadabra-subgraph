const MIM_ADDRESS = '0x130966628846bfd36ff31a822705796e8cb8c18d';

const BENTOBOX_ADDRESS = '0xf4F46382C2bE1603Dc817551Ff9A7b333Ed1D18f';
const BENTOBOX_START_BLOCK = 3621838;

module.exports = {
    network: 'avalanche',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    magicGlp: {
        address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        startBlock: 27525580,
    },
    beam: {
        address: '0xB3a66127cCB143bFB01D3AECd3cE9D17381B130d',
        startBlock: 30943828,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 33180737,
            oracle: '0x0A77230d17318075983913bC2145DB16C7366156',
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
                address: '0x1fC83f75499b7620d53757f0b01E2ae626aAE530',
                startBlock: 5633933,
            },
            {
                name: 'Limone',
                address: '0xd825d06061fdc0585e4373f0a3f01a8c02b0e6a4',
                startBlock: 10750541,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0xae64A325027C3C14Cf6abC7818aA3B9c07F5C799', // safe.main
            '0xAE4D3a42E46399827bd094B4426e2f79Cca543CA', // safe.ops
        ],
        disabled: []
    },
    mspell: {
        address: '0xBd84472B31d947314fDFa2ea42460A2727F955Af',
        startBlock: 12800713,
        spellAddress: '0xCE1bFFBD5374Dac86a2893119683F4911a2F7814',
        spellOracleAddress: '0x4F3ddF9378a4865cf4f28BE51E10AECb83B7daeE',
    },
};
