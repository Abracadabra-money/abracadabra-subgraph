# Abracadabra Subgraph

TheGraph exposes a GraphQL endpoint to query the events and entities within Abracadabra ecosystem.

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

This repository contains multiple subgraphs:  

- [blocks](./subgraphs/blocks/README.md) [![Tests Block Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/blocks-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/blocks-tests.yml)
- [cauldrons](./subgraphs/cauldrons/README.md) [![Tests Cauldrons Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/cauldrons-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/cauldrons-tests.yml)
- [magic-ape](./subgraphs/magic-ape/README.md) [![Tests Magic Ape Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-ape-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-ape-tests.yml)
- [magic-glp](./subgraphs/magic-glp/README.md) [![Tests Magic Glp Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-glp-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/magic-glp-tests.yml)
- [level-finance](./subgraphs/level-finance/README.md) [![Tests Level Finance Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/level-finance-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/level-finance-tests.yml)
- [beam](./subgraphs/beam/README.md) [![Tests Beam Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/beam-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/beam-tests.yml)
- [sSpell](./subgraphs/sspell/README.md) [![Tests sSpell Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/sspell-test.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/sspell-test.yml)
- [mSpell](./subgraphs/mspell/README.md) [![Tests mSpell Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/mspell-test.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/mspell-test.yml)
- [Spell](./subgraphs/spell/README.md) [![Tests Spell Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/spell-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/spell-tests.yml)

## Subgraphs

1. **Blocks**: Tracks all blocks on Chain.

2. **Cauldrons**: Tracks all Abracadabra Cauldrons data with price, volume
    - [Ethereum](https://api.studio.thegraph.com/query/56065/cauldrons/version/latest)
    - [Optimism](https://api.studio.thegraph.com/query/56065/cauldrons-optimism/version/latest)
    - [Fantom](https://api.studio.thegraph.com/query/56065/cauldrons-fantom/version/latest)
    - [Arbitrum](https://api.studio.thegraph.com/query/56065/cauldrons-arbitrum/version/latest)
    - [Avalanche](https://api.studio.thegraph.com/query/56065/cauldrons-avalanche/version/latest)
    - [BSC](https://api.thegraph.com/subgraphs/name/0xfantaholic/cauldrons-bsc)
    - [Kava](https://kava.graph.abracadabra.money/subgraphs/name/cauldrons)

3. **Magic APE**: Tracks Magic APE rewards,apy and tvl
    - [Ethereum](https://api.studio.thegraph.com/query/56065/magic-ape/version/latest)

4. **Magic GLP**: Tracks Magic GLP rewards
    - [Arbitrum](https://api.studio.thegraph.com/query/56065/magic-glp-arbitrum/version/latest)
    - [Avalanche](https://api.studio.thegraph.com/query/56065/magic-glp-avalanche/version/latest)

5. **Level Finance**: Tracks Level Finance rewards
    - [BSC](https://api.thegraph.com/subgraphs/name/0xfantaholic/level-finance-bsc)

6. **Beam**: Tracks Beam
    - [Ethereum](https://api.studio.thegraph.com/query/56065/beam/version/latest)
    - [Optimism](https://api.studio.thegraph.com/query/56065/beam-optimism/version/latest)
    - [Matic](https://api.studio.thegraph.com/query/56065/beam-matic/version/latest)
    - [Fantom](https://api.studio.thegraph.com/query/56065/beam-fantom/version/latest)
    - [Arbitrum](https://api.studio.thegraph.com/query/56065/beam-arbitrum/version/latest)
    - [Avalanche](https://api.studio.thegraph.com/query/56065/beam-avalanche/version/latest)
    - [Base](https://api.studio.thegraph.com/query/56065/beam-base/version/latest)
    - [BSC](https://api.thegraph.com/subgraphs/name/0xfantaholic/beam-bsc)
    - [Moonriver](https://api.thegraph.com/subgraphs/name/0xfantaholic/beam-moonriver)
    - [Kava](https://kava.graph.abracadabra.money/subgraphs/name/beam)

7. **sSpell**: Tracks sSpell
    - [Ethereum](https://api.studio.thegraph.com/query/56065/sspell/version/latest)

8. **mSpell**: Tracks mSpell
    - [Ethereum](https://api.studio.thegraph.com/query/56065/mspell/version/latest)
    - [Fantom](https://api.studio.thegraph.com/query/56065/mspell-fantom/version/latest)
    - [Arbitrum](https://api.studio.thegraph.com/query/56065/mspell-arbitrum/version/latest)
    - [Avalanche](https://api.studio.thegraph.com/query/56065/mspell-avalanche/version/latest)

9. **Spell**: Tracks Spell
    - [Ethereum](https://api.studio.thegraph.com/query/56065/spell/version/latest)

## Build

```sh
NETWORK=ethereum pnpm exec turbo run build --scope=<SUBGRAPH_NAME> --force
```

## Testing

[Matchstick documentation](https://thegraph.com/docs/developer/matchstick)

```sh
# Run all tests
pnpm exec turbo run test --scope=<SUBGRAPH_NAME>

# Run single test
pnpm exec turbo run test -- <TEST> --scope=<SUBGRAPH_NAME>
```

## Deployment script

add a deploy.sh in the root dir with:
```sh
# V3 DEPLOYMENT
declare -a networks=("ethereum" "avalance" "arbitrum")
SUBGRAPH=v3
DIRECTORY=v3
USER=wagmi
ACCESS_TOKEN=SET_YOUR_ACCESS_TOKEN_HERE
for network in "${networks[@]}"
do
    echo "BUILD $network $DIRECTORY" 
    NETWORK=$network pnpm exec turbo run build --scope=$DIRECTORY --force
    echo "DEPLOYING TO $USER/$SUBGRAPH-$network" 
    cd subgraphs/$DIRECTORY/ && pnpm exec graph deploy --product hosted-service $USER/$SUBGRAPH-$network --access-token $ACCESS_TOKEN
    cd ../../
done;
```