import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { AnchorPlay3 } from '../target/types/anchor_play_3';
import assert from 'assert'

describe('anchor_play_3', () => {

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const dataHolder = anchor.web3.Keypair.generate();

  const program = anchor.workspace.AnchorPlay3 as Program<AnchorPlay3>;

  it('Is initialized!', async () => {
    const tx = await program.rpc.initialize(new anchor.BN(1234), {
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
      },
    });
    console.log('sig is ', tx);

    const account = await program.account.dataHolder.fetch(dataHolder.publicKey);
    assert.equal(account.data.toString(), '4444');
  })
});