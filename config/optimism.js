const MIM_ADDRESS = '0xB153FB3d196A8eB25522705560ac152eeEc57901';

const BENTOBOX_ADDRESS = '0xa93C81f564579381116ee3E007C9fCFd2EBa1723';
const BENTOBOX_START_BLOCK = 18084162;

module.exports = {
    network: 'optimism',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    beam: {
        address: '0x48686c24697fe9042531B64D792304e514E74339',
        startBlock: 104883234,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 107469310,
        },
    },
    cauldrons: {
        bentoBox: {
            enable: false,
        },
        degenBox: {
            enable: true,
            address: BENTOBOX_ADDRESS,
            startBlock: BENTOBOX_START_BLOCK,
        },
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0x4217AA01360846A849d2A89809d450D10248B513', // safe.main
            '0xCbb86ffF0F8094C370cdDb76C7F270C832a8C7C0' // safe.ops
        ]
    },
};
