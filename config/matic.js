const BEAM_ADDRESS = '0xca0d86afc25c57a6d2aCdf331CaBd4C9CEE05533';
const BEAM_START_BLOCK = 43560449;

module.exports = {
    network: 'matic',
    blocks: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
    },
    beam: {
        address: BEAM_ADDRESS,
        startBlock: BEAM_START_BLOCK,
        wrapper: {
            enable: true,
            address: '0xE1261E47b08a22Df93af46889EE504C2Aa6DfD4c',
            startBlock: 46044204,
            oracle: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
        },
    },
};
