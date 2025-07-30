import hre from 'hardhat';
import { parseEther } from 'viem/utils';

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  console.log('Deploying contracts with account:', deployer.account.address);

  const blackjack = await hre.viem.deployContract('SomniaBlackjack');
  const blackjackAddress = await blackjack.address
  console.log('Blackjack deployed to:', blackjackAddress);

  // Wait for block confirmations to ensure contracts are indexed
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Verify SomResolver (no constructor args)
  try {
    await hre.run('verify:verify', {
      address: blackjackAddress,
      constructorArguments: [],
    });
    console.log('Blackjack verified!');
  } catch (e) {
    console.error('Blackjack verification failed:', e);
  }

  // Verify SomRegistry (no constructor args)
  try {
    await hre.run('verify:verify', {
      address: blackjackAddress,
      constructorArguments: [],
    });
    console.log('SomRegistry verified!');
  } catch (e) {
    console.error('SomRegistry verification failed:', e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
