const BEAM_ADDRESS = '0xeF2dBDfeC54c466F7Ff92C9c5c75aBB6794f0195';
const BEAM_START_BLOCK = 4393608;

module.exports = {
    network: 'moonriver',
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
            startBlock: 4768924,
        },
    },
};
