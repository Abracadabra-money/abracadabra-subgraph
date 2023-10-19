# Abracadabra Cauldrons
[![Tests Cauldrons Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/cauldrons-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/cauldrons-tests.yml)

## Whitelisted deployers

```typescript
export const ABRA_DEPLOYERS = [
    '0xfddfe525054efaad204600d00ca86adb1cc2ea8a'.toLowerCase(),
    '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C'.toLowerCase(),
    '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3'.toLowerCase(),
];
```

## Methods that are tracked

```
BentoBox/Degenbox
└── events
    └── LogDeploy(indexed address,bytes,indexed address)

Cauldron
└── events
    ├── LogAddCollateral(indexed address,indexed address,uint256)
    ├── LogRemoveCollateral(indexed address,indexed address,uint256)
    ├── LogBorrow(indexed address,indexed address,uint256,uint256)
    ├── LogRepay(indexed address,indexed address,uint256,uint256)
    ├── LogExchangeRate(uint256)
    └── LogAccrue(uint128)
```
