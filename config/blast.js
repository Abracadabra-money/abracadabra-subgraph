const MIM_ADDRESS = '0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1';

const BENTOBOX_ADDRESS = '0xC8f5Eb8A632f9600D1c7BC91e97dAD5f8B1e3748';
const BENTOBOX_START_BLOCK = 203509;

module.exports = {
    network: 'blast',
    blocks: {
        address: BENTOBOX_ADDRESS,
        startBlock: BENTOBOX_START_BLOCK,
    },
    cauldrons: {
        protocolId: BENTOBOX_ADDRESS,
        bentoBoxes: [
            {
                name: 'BentoBox',
                address: BENTOBOX_ADDRESS,
                startBlock: BENTOBOX_START_BLOCK,
            },
        ],
        mimAddress: MIM_ADDRESS,
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0x5f0DeE98360d8200b20812e174d139A1a633EDd2', // safe.main
            '0xDF2C270f610Dc35d8fFDA5B453E74db5471E126B', // safe.ops
        ],
        disabled: [],
    },
};
