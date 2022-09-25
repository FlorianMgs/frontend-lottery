import "../styles/globals.css"
import dynamic from "next/dynamic"
import React from "react"
import { NotificationProvider } from "web3uikit"

const MoralisContextProvider = dynamic(() => import("../context/MoralisContext"), { ssr: false })

function MyApp({ Component, pageProps }) {
	return (
		<MoralisContextProvider>
			<NotificationProvider>
				<Component {...pageProps} />
			</NotificationProvider>
		</MoralisContextProvider>
	)
}

export default MyApp
