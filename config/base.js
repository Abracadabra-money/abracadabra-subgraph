const BEAM_ADDRESS = '0x4035957323FC05AD9704230E3dc1E7663091d262';
const BEAM_START_BLOCK = 2071285;

module.exports = {
    network: 'base',
    blocks: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
    },
    beam: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
        wrapper: {
            enable: false,
        },
    },
};
