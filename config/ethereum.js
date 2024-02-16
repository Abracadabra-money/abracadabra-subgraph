const MIM_ADDRESS = '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3';

const BENTOBOX_ADDRESS = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966';
const BENTOBOX_START_BLOCK = 12094175;

const SPELL_ADDRESS = '0x090185f2135308BaD17527004364eBcC2D37e5F6';
const SPELL_ORACLE = '0x75e14253dE6a5c2af12d5f1a1EA0A2E11e69EC10';

module.exports = {
    network: 'mainnet',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    magicApe: {
        address: '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6',
        startBlock: 16656455,
        staking: {
            address: '0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9',
            startBlock: 16525000,
        },
        apeOracleAddress: '0x64422a1337082Bf99E6052fF52684374Eb1A7fB7',
    },
    beam: {
        address: '0x439a5f0f5E8d149DDA9a0Ca367D4a8e4D6f83C10',
        startBlock: 17414874,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 17790681,
            oracle: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
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
                address: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
                startBlock: 13418156,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0x5f0DeE98360d8200b20812e174d139A1a633EDd2', // safe.main
            '0xDF2C270f610Dc35d8fFDA5B453E74db5471E126B', // safe.ops
        ],
        disabled: [
            '0x692887E8877C6Dd31593cda44c382DB5b289B684', // ape
            '0x7259e152103756e1616A77Ae982353c3751A6a90', // yv-3crypto
        ],
    },
    spell: {
        address: SPELL_ADDRESS,
        startBlock: 12454535,
        spellOracleAddress: SPELL_ORACLE,
        hashes: ['0x288aaa6ad467997eb9f6786822a1cdb29322b7ae84055d53cf906058b32677bc', '0x8b5b93d00df18f13fe7d16de01bf3472a5dc1a12cdb1bf0f040dca2261ab3b4f'],
    },
    sspell: {
        address: '0x26FA3fFFB6EfE8c1E69103aCb4044C26B9A106a9',
        startBlock: 12505995,
        spellAddress: SPELL_ADDRESS,
        spellOracleAddress: SPELL_ORACLE,
    },
    mspell: {
        address: '0xbD2fBaf2dc95bD78Cf1cD3c5235B33D1165E6797',
        startBlock: 14491999,
        spellAddress: SPELL_ADDRESS,
        spellOracleAddress: '0x8c110B94C5f1d347fAcF5E1E938AB2db60E3c9a8',
    },
};
