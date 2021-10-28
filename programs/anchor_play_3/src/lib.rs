use anchor_lang::prelude::*;
use puppet::cpi::accounts::SetData;
use puppet::program::Puppet;
use puppet::{self, Data};

declare_id!("BPvPwaQK28fsMHNJLf4i9jcsaA258tXGzrEaNQWRVJE5");

// ============================================================================= logic

#[program]
pub mod anchor_play_3 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64, authority: Pubkey) -> ProgramResult {
        let data_holder = &mut ctx.accounts.passed_data_holder_acc;
        data_holder.auth = authority;
        data_holder.data = data;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> ProgramResult {
        let data_holder = &mut ctx.accounts.passed_data_holder_acc;
        data_holder.data = data;
        Ok(())
    }

    pub fn pull_strings(ctx: Context<PullStrings>, data: u64) -> ProgramResult {
        let cpi_program = ctx.accounts.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet: ctx.accounts.puppet.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        puppet::cpi::set_data(cpi_ctx, data)
    }

    pub fn me_errors(_ctx: Context<MeErrors>) -> ProgramResult {
        Err(ErrorCode::Ohno.into())
    }
}

// ============================================================================= instructions

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = passed_user_acc, space = 8 + 8 + 32)]
    pub passed_data_holder_acc: Account<'info, DataHolder>,
    #[account(mut)]
    pub passed_user_acc: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = auth)]
    pub passed_data_holder_acc: Account<'info, DataHolder>,
    pub auth: Signer<'info>,
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, Puppet>,
}

#[derive(Accounts)]
pub struct MeErrors {}

// ============================================================================= accounts

#[account]
pub struct DataHolder {
    pub data: u64,
    pub auth: Pubkey,
}

// ============================================================================= errors
#[error]
pub enum ErrorCode {
    #[msg("This is a bad error msg!")]
    Ohno
}