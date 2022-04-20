/* eslint-disable max-classes-per-file */
class WalletError extends Error {}
class NotSupported extends WalletError {}
class AddressNotFound extends WalletError {}

export const WalletErrors = {
  NotSupported,
  AddressNotFound,
};
