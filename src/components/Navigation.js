import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };
  return (
    <nav>
      <div className="nav-brand">
        <h1>Dappazon</h1>
      </div>
      <input type="text" className="nav-search" />
      {account ? (
        <button className="nav-connect" type="button">
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button className="nav-connect" type="button" onClick={connectHandler}>
          Connect
        </button>
      )}

      <ul className="nav-links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
