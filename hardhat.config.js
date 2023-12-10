require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: 'https://sepolia.infura.io/v3/5beaef585db54ea0bc25c62cbeda82f5',
      accounts: [ '424c9548b42d88b0439429c1cea5b30b9fbc3ee7bd4b3dba27c58898cbb67fde' ]
    }
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
