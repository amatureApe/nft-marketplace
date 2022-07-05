const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();

  const basicNft = await ethers.getContract("BasicNft", deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 has tokenURI: ${await basicNft.tokenURI(0)}`);

  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const mintFee = await randomIpfsNft.getMintFee();

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000);
    randomIpfsNft.once("NftMinted", async function () {
      resolve();
    });
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() });
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
    if (developmentChains.includes(network.name)) {
      const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
    }
  });
  console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`);

  const highValue = ethers.utils.parseEther("4000");
  const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
  const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString());
  await dynamicSvgNftMintTx.wait(1);
  console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`);


}