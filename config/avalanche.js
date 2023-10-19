const MIM_ADDRESS = '0x130966628846bfd36ff31a822705796e8cb8c18d';

const BENTOBOX_ADDRESS = '0xf4F46382C2bE1603Dc817551Ff9A7b333Ed1D18f';
const BENTOBOX_START_BLOCK = 3621838;

module.exports = {
    network: 'avalanche',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    magicGlp: {
        address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        startBlock: 27525580,
    },
    beam: {
        address: '0xB3a66127cCB143bFB01D3AECd3cE9D17381B130d',
        startBlock: 30943828,
        wrapper: {
            enable: true,
            address: '0x287176dfBEC7E8cee0f876FC7B52960ee1784AdC',
            startBlock: 33180737,
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
            address: '0x1fC83f75499b7620d53757f0b01E2ae626aAE530',
            startBlock: 5633933,
        },
        mimAddress: MIM_ADDRESS,
    },
};
