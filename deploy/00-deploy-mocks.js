const { network } = require("hardhat");
const { DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");

const BASE_FEE = "250000000000000000";
const GAS_PRICE_LINK = 1e9;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...");
    await deploy("BasicNft", {
      from: deployer,
      log: true,
      args: []
    });
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK]
    });
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE]
    });

    log("Mocks Deployed!");
    log("You are deploying to a local network, you'll need a local network running to interact");
    log(
      "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
    );
  }
}

module.exports.tags = ["all", "mocks", "main"]