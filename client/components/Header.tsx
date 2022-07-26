//@ts-nocheck
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CustomProvider, CustomContext } from "../contexts/context";
import Toaster from "./Toaster";
function Header() {
  const [userName, setUserName] = useState("");
  const [walletNotConnected, setWalletNotConnected] = useState(false);
  const [animateToast, setToasterAnimation] = useState(false);
  const { connectWallet, currentAccount } = useContext(CustomContext);

  useEffect(() => {
    if (!currentAccount) return;
    setUserName(`${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}`);
  }, [currentAccount]);

  useEffect(() => {
    if (animateToast) {
      setTimeout(() => {
        setToasterAnimation(false);
      }, 1000);
    }
  }, [animateToast]);
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className="flex items-center">
            <span className={styles.navTitle}>Trusted Crowdfunding</span>
          </Link>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className={styles.navToggleButton}
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className={styles.navItems} id="navbar-default">
            <ul className={styles.ul}>
              <li>
                <button
                  onClick={() => {
                    if (!currentAccount) {
                      setWalletNotConnected(true);
                      setToasterAnimation(true);
                    }
                  }}
                >
                  {currentAccount ? (
                    <a
                      href="/Campaigns"
                      className={styles.aLink}
                      aria-current="page"
                    >
                      Canpaigns
                    </a>
                  ) : (
                    <div className={styles.aLink}> Canpaigns</div>
                  )}
                </button>
              </li>

              <li>
                {currentAccount ? (
                  <div className="flex flex-row  items-center">
                    <div className="aLink">{userName}</div>
                    <img
                      className="p-1 w-8 h-8 mx-2 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      src="https://m.media-amazon.com/images/I/91N1lG+LBIS._AC_SL1500_.jpg"
                      alt="Bordered avatar"
                    />
                  </div>
                ) : (
                  <button
                    className={styles.aLink}
                    onClick={() => connectWallet()}
                  >
                    Connect
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {walletNotConnected && (
        <Toaster
          type={"error"}
          message={"Please connect your wallet"}
          animate={animateToast}
        />
      )}
    </>
  );
}
const styles = {
  nav: `border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900`,
  navContainer: `container flex flex-wrap justify-between items-center mx-auto`,
  navTitle: `self-center text-l font-semibold whitespace-nowrap dark:text-white cursor-pointer`,
  navToggleButton: `inline-flex items-center p-2 ml-3 text-sm text-gray-500 
  rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2
   focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`,
  navItems: `hidden w-full md:block md:w-auto`,
  ul: `flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium`,
  aLink: `block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent 
  md:hover:text-white md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700
  dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 text-base`,
};
export default Header;
