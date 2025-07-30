const { expect } = require('chai');
const { viem } = require('hardhat');
const hre = require('hardhat');

describe('NFTLendHub5_v2 Simulation', function () {
  let contract, publicClient, walletClient;

  before(async function () {
    // Get the wallet client (with the account from .env)
    [walletClient] = await hre.viem.getWalletClients();
    publicClient = await hre.viem.getPublicClient();

    // Deploy or attach to the existing contract
    const contractAddress = '0x2A0d4970cd6958dfB0a8f6536240277CC7c3a95'; // Replace with actual address
    const abi =
      require('../artifacts/contracts/NFTLendHub5_v2.sol/NFTLendHub5_v2.json').abi;

    contract = viem.getContract({
      address: contractAddress,
      abi,
      publicClient,
      walletClient,
    });
  });

  it('Simulates fundLoan(67) and checks for revert', async function () {
    const loanId = 67n; // BigInt for uint256

    try {
      // Simulate the transaction
      const simulation = await contract.simulate.fundLoan([loanId], {
        account: walletClient.account.address,
      });

      console.log('Simulation successful:', simulation);
    } catch (error) {
      console.log('Simulation failed with error:', error);
      // Check if the revert is due to transferFrom or lock
      if (error.cause && error.cause.reason) {
        console.log('Revert reason:', error.cause.reason);
        if (
          error.cause.reason.includes('transfer') ||
          error.cause.reason.includes('lock')
        ) {
          console.log(
            'Revert likely due to transferFrom or lock failure. NFT may be soulbound or restricted.'
          );
        }
      } else {
        console.log(
          'Silent revert detected. NFT may be soulbound or restricted without a custom error.'
        );
      }
    }
  });
});
