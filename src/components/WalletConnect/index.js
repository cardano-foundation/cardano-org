import React, { useEffect, useState } from 'react';
import { BrowserWallet } from '@meshsdk/wallet';
import styles from './styles.module.css';

export default function WalletConnect({ onConnect }) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletName, setWalletName] = useState('');
  const [address, setAddress] = useState(null);
  const [installedWallets, setInstalledWallets] = useState([]);

  useEffect(() => {
    // Get list of installed wallets
    try {
      const wallets = BrowserWallet.getInstalledWallets();
      console.log('Installed wallets:', wallets);
      setInstalledWallets(wallets || []);
    } catch (error) {
      console.error('Error getting installed wallets:', error);
      setInstalledWallets([]);
    }
  }, []);

  useEffect(() => {
    if (connected && onConnect) {
      onConnect();
    }
  }, [connected, onConnect]);

  const handleConnect = async (walletName) => {
    try {
      const wallet = await BrowserWallet.enable(walletName);
      setWallet(wallet);
      setWalletName(walletName);
      setConnected(true);
      
      const addresses = await wallet.getUsedAddresses();
      if (addresses && addresses.length > 0) {
        setAddress(addresses[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setWalletName('');
    setConnected(false);
    setAddress(null);
  };

  return (
    <div className={styles.walletConnectContainer}>
      {!connected ? (
        <>
          <h3>Select a wallet</h3>
          <div className={styles.walletList}>
            {installedWallets && installedWallets.length > 0 ? (
              installedWallets.map((wallet) => (
                <button
                  key={wallet?.name || wallet}
                  onClick={() => handleConnect(wallet?.name || wallet)}
                  className={styles.walletButton}
                >
                  {wallet?.icon && (
                    <img src={wallet.icon} alt={wallet?.name || wallet} className={styles.walletIcon} />
                  )}
                  {wallet?.name || wallet}
                </button>
              ))
            ) : (
              <p>No Cardano wallets detected. Please install a wallet extension.</p>
            )}
          </div>
        </>
      ) : (
        <div className={styles.connectedInfo}>
          <h3>Wallet connected!</h3>
          <p>You've successfully connected your <strong>{walletName}</strong> wallet.</p>
          {address && (
            <div className={styles.addressInfo}>
              <p className={styles.addressLabel}>Address:</p>
              <code className={styles.address}>
                {address.substring(0, 20)}...{address.substring(address.length - 10)}
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
