import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { client } from "../lib/sanityClient";
import {
  contractFactoryABI,
  CampaignFactoryContractAddress,
  contractCampaignABI,
  CampaignContractAddress,
} from "../lib/constants";

export const CustomContext = React.createContext(0);

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

const getCampainFactoryContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const CampaignFactoryContract = new ethers.Contract(
    CampaignFactoryContractAddress,
    contractFactoryABI,
    signer
  );

  return CampaignFactoryContract;
};
const getCampainContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const CampaignContract = new ethers.Contract(
    CampaignContractAddress,
    contractCampaignABI,
    signer
  );

  return CampaignContract;
};

export const CustomProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [responseType, setResponseType] = useState({
    success: false,
    error: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    minContribution: "",
    goal: "",
    cover: "",
    description: "",
  });
  //const router = useRouter();
  /**
   * Checks if MetaMask is installed and an account is connected
   * @param {*} metamask Injected MetaMask code from the browser
   * @returns
   */
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask ");

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };
  /**
   * Prompts user to connect their MetaMask wallet
   * @param {*} metamask Injected MetaMask code from the browser
   */
  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return window.alert("Please install metamask ");

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      window.alert("Please connect your MetaMask");
      //throw new Error("No ethereum object.");
    }
  };

  /**
   * Create campaigns
   */
  const saveCampaign = async (
    txHash,
    name,
    minContribution,
    goal,
    cover,
    description
  ) => {
    const txDoc = {
      _type: "campaigns",
      _id: txHash,
      campaignName: name,
      miniumContribution: Number(minContribution),
      goalTarget: Number(goal),
      cover: cover,
      description: description,
      timestamp: new Date(Date.now()).toISOString(),
      txHash: txHash,
    };
    await client.createIfNotExists(txDoc);
    await client
      .patch(currentAccount)
      .setIfMissing({ campaigns: [] })
      .insert("after", "campaigns[-1]", [
        {
          _key: txHash,
          _ref: txHash,
          _type: "reference",
        },
      ])
      .commit();
  };

  /**
   * Executes a Create Campaign
   * @param {*} metamask Injected MetaMask code from the browser
   * @param {string} currentAccount Current user's address
   */
  const createCampaign = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return window.alert("Please install metamask ");
      const { name, minContribution, goal, cover, description } = formData;
      const campaignFactoryContract = getCampainFactoryContract();

      const parsedAmountMin = ethers.utils.parseEther(minContribution);
      console.log(parsedAmountMin);
      const campaignHash = await campaignFactoryContract.CreateCampaign(
        parsedAmountMin
      );

      await campaignHash.wait();

      await saveCampaign(
        campaignHash.hash,
        name,
        minContribution,
        goal,
        cover,
        description
      );
      setResponseType({
        success: true,
        message: "campaign successfully created",
      });
      console.log("campaign successfully created");
    } catch (error) {
      console.log(error.message);
      setResponseType({ error: true, message: error.message });
    }
  };
  /**
   * Create user profile in Sanity
   */
  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const userDoc = {
        _type: "users",
        _id: currentAccount,
        userName: `unamed`,
        address: currentAccount,
      };

      await client.createIfNotExists(userDoc);
    })();
  }, [currentAccount]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <CustomContext.Provider
      value={{
        connectWallet,
        currentAccount,
        createCampaign,
        responseType,
        formData,
        setFormData,
      }}
    >
      {children}
    </CustomContext.Provider>
  );
};
