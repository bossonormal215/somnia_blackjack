import { expect } from 'chai';
import hre from 'hardhat';
import { parseEther } from 'viem/utils';

describe('SomRegistry & SomResolver', function () {
  let registry: any;
  let resolver: any;
  let owner: any;
  let other: any;

  beforeEach(async function () {
    [owner, other] = await hre.viem.getWalletClients();
    resolver = await hre.viem.deployContract('SomResolver');
    registry = await hre.viem.deployContract('SomRegistry');
    // Set price to 1 ether for tests
    await registry.write.setPrice([parseEther('1')], {
      account: owner.account,
    });
  });

  it('should register a name with fee and metadata', async function () {
    await registry.write.register(
      ['alice', resolver.address, 'Alice metadata'],
      { account: owner.account, value: parseEther('1') }
    );
    expect((await registry.read.ownerOf(['alice'])).toLowerCase()).to.equal(
      owner.account.address.toLowerCase()
    );
    expect((await registry.read.resolverOf(['alice'])).toLowerCase()).to.equal(
      resolver.address.toLowerCase()
    );
    expect(Number(await registry.read.expiresAt(['alice']))).to.be.gt(0);
    expect(await registry.read.metadataOf(['alice'])).to.equal(
      'Alice metadata'
    );
  });

  it('should not allow registration with insufficient fee', async function () {
    await expect(
      registry.write.register(['bob', resolver.address, 'Bob metadata'], {
        account: owner.account,
        value: parseEther('0.5'),
      })
    ).to.be.rejectedWith('Insufficient fee');
  });

  it('should allow renewal by owner with fee', async function () {
    await registry.write.register(
      ['carol', resolver.address, 'Carol metadata'],
      { account: owner.account, value: parseEther('1') }
    );
    const expires1 = Number(await registry.read.expiresAt(['carol']));
    await registry.write.renew(['carol'], {
      account: owner.account,
      value: parseEther('1'),
    });
    const expires2 = Number(await registry.read.expiresAt(['carol']));
    expect(expires2).to.be.gt(expires1);
  });

  it('should allow transfer of ownership', async function () {
    await registry.write.register(['dave', resolver.address, 'Dave metadata'], {
      account: owner.account,
      value: parseEther('1'),
    });
    await registry.write.transfer(['dave', other.account.address], {
      account: owner.account,
    });
    expect((await registry.read.ownerOf(['dave'])).toLowerCase()).to.equal(
      other.account.address.toLowerCase()
    );
  });

  it('should allow resolver update by owner', async function () {
    await registry.write.register(['eve', resolver.address, 'Eve metadata'], {
      account: owner.account,
      value: parseEther('1'),
    });
    await registry.write.setResolver(['eve', other.account.address], {
      account: owner.account,
    });
    expect((await registry.read.resolverOf(['eve'])).toLowerCase()).to.equal(
      other.account.address.toLowerCase()
    );
  });

  it('should allow metadata update by owner', async function () {
    await registry.write.register(
      ['frank', resolver.address, 'Frank metadata'],
      { account: owner.account, value: parseEther('1') }
    );
    await registry.write.setMetadata(['frank', 'Updated metadata'], {
      account: owner.account,
    });
    expect(await registry.read.metadataOf(['frank'])).to.equal(
      'Updated metadata'
    );
  });

  it('should allow admin to withdraw funds', async function () {
    // Register a name to fund the contract
    await registry.write.register(
      ['grace', resolver.address, 'Grace metadata'],
      { account: owner.account, value: parseEther('1') }
    );
    // Withdraw to owner
    await registry.write.withdraw([owner.account.address], {
      account: owner.account,
    });
    // No revert = success
  });
});
