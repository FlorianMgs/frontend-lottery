import React from "react"
import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
	const chainId = parseInt(chainIdHex)
	const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
	const [entranceFee, setEntranceFee] = useState("0")
	const [nbPlayers, setNbPlayers] = useState("0")
	const [latestWiner, setLatestWiner] = useState("0")

	const dispatch = useNotification()
	const { runContractFunction: getNbPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getNbPlayers",
		params: {},
	})
	const { runContractFunction: getLatestWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getLatestWinner",
		params: {},
	})
	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	})
	const {
		runContractFunction: enterRaffle,
		isLoading,
		isFetching,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	})

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString()
		const nbPlayersFromCall = (await getNbPlayers()).toString()
		const latestWinnerFromCall = (await getLatestWinner()).toString()
		setEntranceFee(entranceFeeFromCall)
		setNbPlayers(nbPlayersFromCall)
		setLatestWiner(latestWinnerFromCall)
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI()
		}
	}, [isWeb3Enabled])

	const handleSuccess = async (tx) => {
		await tx.wait(1)
		handleNewNotification(tx)
		updateUI()
	}

	const handleNewNotification = (tx) => {
		dispatch({
			type: "info",
			message: "Transaction Complete !",
			title: "Enter Raffle",
			position: "topR",
		})
	}

	return (
		<div className='p-5'>
			{raffleAddress ? (
				<>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto'
						onClick={async function () {
							await enterRaffle({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							})
						}}
						disabled={isLoading || isFetching}
					>
						{isLoading || isFetching ? (
							<div className='animate-spin spinner-border h-8 w-8 border-b-2 rounded-full'></div>
						) : (
							<div>Enter Raffle</div>
						)}
					</button>
					<div>Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
					<div>Number of players: {nbPlayers}</div>
					<div>Latest Winner: {latestWiner}</div>
				</>
			) : (
				<div>No raffle address detected</div>
			)}
		</div>
	)
}

export default LotteryEntrance
