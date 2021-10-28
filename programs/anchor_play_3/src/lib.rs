use anchor_lang::prelude::*;

declare_id!("BPvPwaQK28fsMHNJLf4i9jcsaA258tXGzrEaNQWRVJE5");

#[program]
pub mod anchor_play_3 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> ProgramResult {
        let data_holder = &mut ctx.accounts.passed_data_holder_acc;
        data_holder.data = data;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> ProgramResult {
        let data_holder = &mut ctx.accounts.passed_data_holder_acc;
        data_holder.data = data;
        Ok(())
    }
}

// ============================================================================= instructions

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = passed_user_acc, space = 8 + 8)]
    pub passed_data_holder_acc: Account<'info, DataHolder>,
    #[account(mut)]
    pub passed_user_acc: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub passed_data_holder_acc: Account<'info, DataHolder>,
}

// ============================================================================= accounts

#[account]
pub struct DataHolder {
    pub data: u64,
}

