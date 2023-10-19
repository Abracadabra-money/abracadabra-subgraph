const MIM_ADDRESS = '0x82f0b8b456c1a451378467398982d4834b6829c1';

module.exports = {
    network: 'fantom',
    beam: {
        address: '0xc5c01568a3B5d8c203964049615401Aaf0783191',
        startBlock: 63621216,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 66381443,
        },
    },
    cauldrons: {
        bentoBox: {
            enable: true,
            address: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
            startBlock: 2918231,
        },
        degenBox: {
            enable: true,
            address: '0x74A0BcA2eeEdf8883cb91E37e9ff49430f20a616',
            startBlock: 17010677,
        },
        mimAddress: MIM_ADDRESS,
    },
};
