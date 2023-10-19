const BEAM_ADDRESS = '0xc7a161Cfd0e133d289B13692b636B8e8B5CD8d8c';
const BEAM_START_BLOCK = 5477525;

module.exports = {
    network: 'kava-evm',
    blocks: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
    },
    beam: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 5844338,
        },
    },
};
