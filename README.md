# Abracadabra Subgraph

[![Tests](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/tests.yml)

## Installation

```bash
$ yarn
$ yarn prepare:selected network
$ yarn codegen
```

## Running the app

```bash
$ make up
$ make create-local
$ make deploy-local

Testing:  http://localhost:8000/subgraphs/name/abracadabra-subgraph/graphql

```

## Whitelisted deployers

```typescript
export const ABRA_DEPLOYERS = [
    '0xfddfe525054efaad204600d00ca86adb1cc2ea8a'.toLowerCase(),
    '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C'.toLowerCase(),
    '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3'.toLowerCase(),
];
```

## Supported networks

Abracadabra works on networks such as `Ethereum`, `Avalanche`, `Arbitrum`, `Binance Smart Chain` , `Fantom` , `Optimism`.
You can see the configurations for each network here `./deployments/*.json`;

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
    └── LogLiquidation(indexed address,indexed address,indexed address,uint256,uint256,uint256)
└── calls
    ├── liquidate(address[],uint256[],address,address,bytes)
    └── liquidate(address[],uint256[],address,address)

MagicApe
└── events
    ├── ClaimRewards(indexed address,uint256,address)
    ├── Deposit(indexed address,uint256,address)
    ├── Deposit(indexed address,indexed address,uint256,uint256)
    └── Withdraw(indexed address,indexed address,indexed address,uint256,uint256)

MagicGlp
└── events
    └── Transfer(indexed address,indexed address,uint256)
```

## Deployment

### TheGraph Studio

Set the authorization code that links your account on thegraph.com:

```bash
yarn auth <access-token>
```

Deploy the subgraph to the [TheGraph Studio](https://thegraph.com/studio/):

```bash
yarn deploy <subgraph-name>
```
