import hre from 'hardhat';
import { parseEther } from 'viem/utils';

async function main() {
  const [deployer] = await hre.viem.getWalletClients();
  console.log('Deploying contracts with account:', deployer.account.address);

  const resolver = await hre.viem.deployContract('SomResolver');
  console.log('SomResolver deployed to:', resolver.address);

  const registry = await hre.viem.deployContract('SomRegistry');
  console.log('SomRegistry deployed to:', registry.address);

  // Set initial price to 1 ether
  await registry.write.setPrice([parseEther('1')], {
    account: deployer.account,
  });
  console.log('Initial price set to 1 ether');

  // Wait for block confirmations to ensure contracts are indexed
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Verify SomResolver (no constructor args)
  try {
    await hre.run('verify:verify', {
      address: resolver.address,
      constructorArguments: [],
    });
    console.log('SomResolver verified!');
  } catch (e) {
    console.error('SomResolver verification failed:', e);
  }

  // Verify SomRegistry (no constructor args)
  try {
    await hre.run('verify:verify', {
      address: registry.address,
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
