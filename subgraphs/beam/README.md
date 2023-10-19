# Beam
[![Tests Beam Subgraph](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/beam-tests.yml/badge.svg)](https://github.com/Abracadabra-money/abracadabra-subgraph/actions/workflows/beam-tests.yml)

## Methods that are tracked

```
LzIndirectOFTV2
└── events
    ├── SendToChain(indexed uint16,indexed address,indexed bytes32,uint256)
    └── ReceiveFromChain(indexed uint16,indexed address,uint256)

OFTWrapper
└── events
    └──LogWrapperFeeWithdrawn(address,uint256)
```
