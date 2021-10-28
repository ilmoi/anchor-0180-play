import * as anchor from '@project-serum/anchor';
import {Program} from '@project-serum/anchor';
import {AnchorPlay3} from '../target/types/anchor_play_3';
import {Puppet} from '../target/types/puppet';
import assert from 'assert';

describe('anchor_play_3', () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const dataHolder = anchor.web3.Keypair.generate();
  const authority = anchor.web3.Keypair.generate();
  const program = anchor.workspace.AnchorPlay3 as Program<AnchorPlay3>;

  const puppetDataHolder = anchor.web3.Keypair.generate();
  const puppet_program = anchor.workspace.Puppet as Program<Puppet>;

  it('Is initialized!', async () => {
    const tx = await program.rpc.initialize(new anchor.BN(1234), authority.publicKey, {
      accounts: {
        passedDataHolderAcc: dataHolder.publicKey,
        passedUserAcc: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [dataHolder],
    });
    console.log("Your transaction signature", tx);

    const account = await program.account.dataHolder.fetch(dataHolder.publicKey);
    assert.equal(account.data.toString(), '1234');

  });

  it('updates ok', async () => {
    const tx = await program.rpc.update(new anchor.BN(4444), {
      accounts: {
        passedDataHolderAcc: dataHolder.publicKey,
        auth: authority.publicKey,
      },
      signers: [authority]
    });
    console.log('sig is ', tx);

    const account = await program.account.dataHolder.fetch(dataHolder.publicKey);
    assert.equal(account.data.toString(), '4444');
  })

  it('does cpi ok', async () => {
    const tx1 = await puppet_program.rpc.initialize({
      accounts: {
        puppet: puppetDataHolder.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [puppetDataHolder],
    });
    console.log("Your transaction 1 signature", tx1);

    const tx2 = await program.rpc.pullStrings(new anchor.BN(123), {
      accounts: {
        puppet: puppetDataHolder.publicKey,
        puppetProgram: puppet_program.programId,
      },
    });
    console.log("Your transaction 2 signature", tx2);

    const account = await puppet_program.account.data.fetch(puppetDataHolder.publicKey);
    assert.equal(account.data.toString(), '123');
  })

  it('errors', async () => {
    try {
      const tx = await program.rpc.meErrors();
    } catch (err) {
      const errMsg = "This is a bad error msg!";
      assert.equal(err.toString(), errMsg);
    }
  })

});