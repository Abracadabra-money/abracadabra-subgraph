const MIM_ADDRESS = '0x82f0b8b456c1a451378467398982d4834b6829c1';

const BENTOBOX_ADDRESS = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966';
const BENTOBOX_START_BLOCK = 2918231;

module.exports = {
    network: 'fantom',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    beam: {
        address: '0xc5c01568a3B5d8c203964049615401Aaf0783191',
        startBlock: 63621216,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 66381443,
            oracle: '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
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
                address: '0x74A0BcA2eeEdf8883cb91E37e9ff49430f20a616',
                startBlock: 17010677,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0xb4ad8B57Bd6963912c80FCbb6Baea99988543c1c', // safe.main
            '0xf68b78CB64C49967719214aa029a29712ddd567f', // safe.ops
        ],
        disabled: []
    },
    mspell: {
        address: '0xa668762fb20bcd7148Db1bdb402ec06Eb6DAD569',
        startBlock: 34854547,
        spellAddress: '0x468003B688943977e6130F4F68F23aad939a1040',
        spellOracleAddress: '0x02E48946849e0BFDD7bEa5daa80AF77195C7E24c',
    },
};
