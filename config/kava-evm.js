const BEAM_ADDRESS = '0xc7a161Cfd0e133d289B13692b636B8e8B5CD8d8c';
const BEAM_START_BLOCK = 5477525;

const DEGENBOX_ADDRESS = '0x630FC1758De85C566Bdec1D75A894794E1819d7E';

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
            oracle: '0x71000808ee88d5016e83b486e3c9d92df9146d0e',
        },
    },
    cauldrons: {
        protocolId: DEGENBOX_ADDRESS,
        bentoBoxes: [
            {
                name: 'BentoBox',
                address: DEGENBOX_ADDRESS,
                startBlock: 5738563,
            },
        ],
        mimAddress: '0x471EE749bA270eb4c1165B5AD95E614947f6fCeb',
        deployers: [
            '0xfddfE525054efaAD204600d00CA86ADb1Cc2ea8a', // 0xmerlin.eth
            '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3', // 0xcalibur.eth
            '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C', // deployor.eth
            '0x1261894F79E6CF21bF7E586Af7905Ec173C8805b', // safe.main
            '0x3A2761F421b7E3Fd18C1aD50c461b2DE2F77c367', // safe.ops
        ],
        disabled: [],
    },
    curve: {
        pool: {
            address: '0x591199e16e006dec3edcf79ae0fcea1dd0f5b69d',
            startBlock: 5707410
        },
        stake: {
            address: '0xdc398735150d538b2f18ccd13a55f6a54488a677',
            startBlock: 5793762
        }
    }
};
