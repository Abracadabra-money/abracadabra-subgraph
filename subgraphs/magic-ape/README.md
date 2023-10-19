# Magic APE
[![Tests Magic Ape Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-ape-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-ape-tests.yml)

## Methods that are tracked

```
MagicApe
└── events
    ├── Deposit(indexed address,indexed address,uint256,uint256)
    └── Withdraw(indexed address,indexed address,indexed address,uint256,uint256)

MagicApeStaking
└── events
    ├── ClaimRewards(indexed address,uint256,address)
    └── Deposit(indexed address,uint256,address)
```
