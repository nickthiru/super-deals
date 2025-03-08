# Story Map - Release 1: Basic Features

## Customer

- Purchase deals
  - Search deals
    - By featured deals ^
    - By category
    - By latest deals
    - By merchant
  - View a deal ^
  - Buy the deal ^
  - Save a deal for later
- Manage purchased deals
  - View saved deals
  - View purchase history
- Manage account
  - Sign up
    - With username and password
    - With SSO
  - Sign in
    - With username and password
    - With SSO
  - Sign out
  - Update account
    - Change password
  - Delete account

## Merchant

- Account sign-up
  - Submit account application ^
  - Sign up with username and password
- Manage account
  - Sign in with username and MFA
  - Sign out
  - Update account
    - Change password
  - Delete account
- Manage deals
  - Add a deal ^
  - List all deals ^

## Platform Admin

- Manage account
  - Rule: user cannot register for this type of account. It can only be created by a super user
  - Sign in
  - Sign out
  - Update account
    - Change password
  - Delete account
- Manage merchants
  - Approve/reject merchant application ^
- Manage deal listings
  - Approve deals
  - View deals
  - Suspend deals
