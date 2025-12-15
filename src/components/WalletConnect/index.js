import React, { useEffect } from 'react';
import { ConnectWalletButton, useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import styles from './styles.module.css';

export default function WalletConnect({ onConnect }) {
  const { isConnected, usedAddresses, disconnect, enabledWallet } = useCardano();

  useEffect(() => {
    if (isConnected && onConnect) {
      onConnect();
    }
  }, [isConnected, onConnect]);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className={styles.walletConnectContainer}>
      {!isConnected ? (
        <>
          <ConnectWalletButton label="Sign in with Cardano" />
        </>
      ) : (
        <div className={styles.connectedInfo}>
          <h3>Wallet connected!</h3>
          <p>You've successfully connected your <strong>{enabledWallet}</strong> wallet.</p>
          {usedAddresses && usedAddresses.length > 0 && (
            <div className={styles.addressInfo}>
              <p className={styles.addressLabel}>Address:</p>
              <code className={styles.address}>
                {usedAddresses[0].substring(0, 20)}...{usedAddresses[0].substring(usedAddresses[0].length - 10)}
              </code>
            </div>
          )}
          <button onClick={handleDisconnect} className={styles.disconnectButton}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
