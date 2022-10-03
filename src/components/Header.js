import { truncateAddress } from "../utils/conversions";
import { Button } from "react-bootstrap";
import Identicon from "./Identicon";
const Header = (props) => {
  return (
    <header className="header-section">
      <div className="header-bottom">
        <div className="container">
          <nav className="navbar navbar-expand-lg p-0">
            <span className="site-logo site-title">
              <h2>AlgoDealer</h2>
            </span>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span style={{ color: "black" }} className="menu-toggle" />
            </button>
            <div
              className="headnav collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="centre navbar-nav main-menu mr-auto">
                <li>
                  <a
                    href={`https://testnet.algoexplorer.io/address/${props.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Identicon address={props.address} size={28} />
                    {truncateAddress(props.address)}
                  </a>
                </li>
                <li>
                  <a href="/#">ALGO Balance: {props.balance / 10 ** 6} ALGO</a>
                </li>
                <li>
                  <Button
                    variant="dark"
                    onClick={() => props.disconnect()}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-box-arrow-right me-2 fs-4" />
                    Disconnect
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      {/* header-bottom end */}
    </header>
  );
};

export default Header;
