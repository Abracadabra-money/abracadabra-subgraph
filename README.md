# Abracadabra Subgraph

[![Tests](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/tests.yml)

TheGraph exposes a GraphQL endpoint to query the events and entities within Abracadabra ecosystem.

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

This repository contains multiple subgraphs:  

- [blocks](./subgraphs/blocks/README.md)
- [cauldrons](./subgraphs/cauldrons/README.md)
- [magic-ape](./subgraphs/magic-ape/README.md)
- [magic-glp](./subgraphs/magic-glp/README.md)
- [level-finance](./subgraphs/level-finance/README.md)
- [beam](./subgraphs/beam/README.md)

## Subgraphs

1. **Blocks**: Tracks all blocks on Chain.

2. **Cauldrons**: Tracks all Abracadabra Cauldrons data with price, volume

3. **Magic APE**: Tracks Magic APE rewards,apy and tvl

4. **Magic GLP**: Tracks Magic GLP rewards

5. **Level Finance**: Tracks Level Finance rewards

6. **Beam**: Tracks Beam
    

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