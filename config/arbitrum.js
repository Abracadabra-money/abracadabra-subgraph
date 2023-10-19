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
        },
    },
    cauldrons: {
        bentoBox: {
            enable: true,
            address: BENTOBOX_ADDRESS,
            startBlock: BENTOBOX_START_BLOCK,
        },
        degenBox: {
            enable: true,
            address: '0x7C8FeF8eA9b1fE46A7689bfb8149341C90431D38',
            startBlock: 15370694,
        },
        mimAddress: MIM_ADDRESS,
    },
};
