//@ts-nocheck
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Toaster from "../../components/Toaster";
import { CustomContext } from "../../contexts/context";

function campaign() {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  const [campaign, setCampaign] = useState({});
  const [contributionLoading, setContributionLoading] = useState(false);
  const [contribution, setContribution] = useState();
  const [contributionResponse, setContributionResponse] = useState();

  const [minContributionError, setMinContributionError] = useState("");
  const { getCampaignById, responseType, contribute } =
    useContext(CustomContext);

  const [isLoading, setIsLoading] = useState(false);
  const [animateToast, setToasterAnimation] = useState(false);

  const formatDate = (date: any) => {
    const _date = new Date(date);
    const time = _date.getTime();
    if (!Number.isNaN(time)) {
      const dt = new Date(time);
      return dt.toISOString().slice(0, 10);
    }
    return;
  };

  const validate = (type: string) => {
    let isValid = false;
    setMinContributionError("");
    if (type === "contribute") {
      if (isNaN(Number(campaign.minimumContribution))) {
        setMinContributionError("Minimum contribution must be a valid number");
        isValid = false;
      } else {
        isValid = true;
      }
    }
    if (type === "request") {
    }
    return isValid;
  };

  const contributeOnclick = async () => {
    if (!validate("contribute")) {
      return;
    }
    setContributionLoading(true);

    const response = await contribute(contribution, campaignId);

    if (response) {
      setContributionResponse(true);
      window.location.reload();
    } else {
      setContributionResponse(false);
    }
    setToasterAnimation(true);
    setContributionLoading(false);
  };
  useEffect(() => {
    (async () => {
      setIsLoading(true);

      if (campaignId) {
        const _campaign = await getCampaignById(campaignId);
        setCampaign(_campaign);
        if (campaign) {
          setIsLoading(false);
        }
      }
    })();

    if (animateToast) {
      setTimeout(() => {
        setToasterAnimation(false);
      }, 2000);
    }
  }, [campaignId]);

  return (
    <>
      {isLoading ? (
        <>
          <div
            role="status"
            className=" animate-pulse flex flex-row justify-between space-x-8 mt-12 w-sm:flex-wrap mx-8"
          >
            <div className={styles.leftLayout}>
              {/* cover  */}
              <div className="flex justify-center items-center w-full h-48  rounded  bg-gray-700">
                <svg
                  className="w-12 h-12 text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
              </div>

              {/* campaign name */}
              <h2 className={styles.campaignName}></h2>
              {/* description */}
              <div className="my-3 text-gray-300 h-2.5 "></div>
              {/* funding details */}
              <div>
                <div className="h-2.5  rounded-full bg-gray-700 w-48 mb-4"></div>
                <div className="h-2  rounded-full bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2  rounded-full bg-gray-700 mb-2.5"></div>
                <div className="h-2  rounded-full bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2  rounded-full bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-2  rounded-full bg-gray-700 max-w-[360px]"></div>
              </div>
              {/* card details */}
              <div className="grid grid-cols-4 gap-4 my-8 md:grid-cols-2">
                <div className="block h-[100px] w-[250px] p-5 max-w-lg  text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700"></div>
                <div className="block h-[100px] w-[250px] p-5 max-w-lg  text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700"></div>
                <div className="block h-[100px] w-[250px] p-5 max-w-lg  text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700"></div>
                <div className="block h-[100px] w-[250px] p-5 max-w-lg  text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700"></div>
              </div>
            </div>
            {/* contribution  */}
            <div className={styles.rightLayout}>
              {/* create contribution */}
              <div>
                <div className="h-2  rounded-lg bg-gray-700 w-48 mb-4"></div>
                <div className="h-12  rounded-lg border-2 border-gray-600 w-full mb-4"></div>

                <div className="h-12  rounded-lg bg-gray-700 w-full mb-4"></div>
              </div>
              {/* create retquest */}
              <div className="h-12  rounded-lg bg-gray-700 w-48 mb-4"></div>
              <div className="h-12  rounded-lg border-2 border-gray-600 w-full mb-4"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {contributionResponse ? (
            <Toaster
              type={"success"}
              message="successfully contributed"
              animate={animateToast}
            />
          ) : (
            <Toaster
              type={"error"}
              message="Please provide contribution above the minimum"
              animate={animateToast}
            />
          )}
          <div className={styles.container}>
            <div className={styles.leftLayout}>
              {/* cover  */}
              <img
                src={String(campaign.cover)}
                alt="cover"
                className={styles.imgLayer}
              />
              {/* campaign name */}
              <h2 className={styles.campaignName}>{campaign!.campaignName}</h2>
              {/* description */}
              <div className="my-3 text-gray-300">{campaign!.description}</div>
              {/* funding details */}
              <div>
                <div className="text-gray-300">
                  Funding:{" "}
                  <span className="text-sm text-gray-600">
                    0 Ether / 12 Ether (0%)
                  </span>
                </div>
                <div className="text-gray-300">
                  Manager:{" "}
                  <span className="text-sm text-gray-600">
                    {campaign!.manager}
                  </span>
                </div>
                <div className="text-gray-300">
                  Created:{" "}
                  <span className="text-gray-600 text-sm">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
              </div>
              {/* card details */}
              <div className="grid grid-cols-4 gap-6 my-4 ">
                <div className="block p-5 max-w-lg  text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-white">
                    Minimum Contribution
                  </h5>
                  <p className="my-3  text-gray-300 text-lg font-medium">
                    {campaign.minimumContribution}
                  </p>
                  <p className="font-normal align-bottom text-gray-600 text-sm">
                    Minimum Amount required to become a contributor
                  </p>
                </div>
                <div className="block p-5 max-w-lg text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-white">
                    Number of Requests
                  </h5>
                  <p className="my-3  text-gray-300 text-lg font-medium">
                    {" "}
                    {campaign.requestCount}
                  </p>
                  <p className="font-normal align-bottom text-gray-600 text-sm">
                    Number of Transaction Requests
                  </p>
                </div>

                <div className="block p-5 max-w-lg text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-white">
                    Balance
                  </h5>
                  <p className="my-3  text-gray-300 text-lg font-medium">
                    {campaign.balance} ETH
                  </p>
                  <p className="font-normal align-bottom text-gray-600 text-sm">
                    Funds available for Transaction by the Campaign
                  </p>
                </div>
                <div className="block p-5 max-w-lg text-center  rounded-lg border mb-8 shadow-md  bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <h5 className="mb-2 text-lg font-bold tracking-tight text-white">
                    Contributors
                  </h5>
                  <p className="my-3  text-gray-300 text-lg font-medium">
                    {" "}
                    {campaign.contributorsCount}
                  </p>
                  <p className="font-normal align-bottom text-gray-600 text-sm">
                    Number of Contributor
                  </p>
                </div>
              </div>
            </div>
            {/* contribution  */}
            <div className={styles.rightLayout}>
              {/* create contribution */}
              <div>
                <div className={styles.title}>Contribute</div>
                <input
                  type="number"
                  id="contribution"
                  className={styles.input}
                  min={String(Number(campaign.minimumContribution))}
                  onChange={(e: any) => setContribution(e.target.value)}
                  placeholder="contribution amount (ETHER)"
                  required
                />
                {!!minContributionError && (
                  <p className="mt-2 text-sm text-red-500">
                    <span className="font-medium">{minContributionError}</span>
                  </p>
                )}
                <button
                  type="button"
                  className={styles.button}
                  onClick={contributeOnclick}
                  disabled={contributionLoading}
                >
                  {!contributionLoading ? (
                    <> Contribute</>
                  ) : (
                    <>
                      <svg
                        role="status"
                        className="inline mr-3 w-4 h-4 text-white animate-spin hover:text-gray-900"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </>
                  )}
                </button>
                <div className="text-gray-400  flex flex-row ">
                  <p className="text-gray-100 text-sm">NOTE:</p>
                  <div className="px-3 w-full text-xs font-light">
                    If you have already contributed to this campaign, please log
                    in using the correct MetaMask account
                  </div>
                </div>
              </div>
              {/* create retquest */}
              {/* <div className="mt-12">
                <div className={styles.title}>Requests</div>
                <button type="button" className={styles.button}>
                  Create Request
                </button>
              </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  container: `flex flex-row justify-between space-x-8 mt-12 w-sm:flex-wrap mx-8`,
  leftLayout: `basis-4/6`,
  rightLayout: `basis-3/12 w-full`,
  imgLayer: ` rounded-lg w-full max-h-60`,
  campaignName: `my-3 text-2xl font-bold`,
  title: `text-lg text-white mb-3`,

  input: ` border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white
            focus:ring-gray-200 focus:border-gray-200`,
  button: `inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center
     text-white-900 hover:text-gray-900 border  rounded-lg  focus:ring-4 
text-white border-gray-700 hover:bg-gray-100 focus:ring-gray-800 w-full my-3`,
};
export default campaign;
