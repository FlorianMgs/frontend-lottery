import React from "react"
import { ConnectButton } from "web3uikit"

const Header = () => {
	return (
		<div className='border-b-2 flex flex-row'>
			<h1 className='py-4 px-4 font-blog text-3xl'>Decentralized Lottery</h1>
			<div className='ml-auto py-2 px-4'>
				<ConnectButton moralisAuth={false} />
			</div>
		</div>
	)
}

export default Header
