const MIM_ADDRESS = '0xB153FB3d196A8eB25522705560ac152eeEc57901';

module.exports = {
    network: 'optimism',
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
            address: '0xa93C81f564579381116ee3E007C9fCFd2EBa1723',
            startBlock: 18084162,
        },
        mimAddress: MIM_ADDRESS,
    },
};
