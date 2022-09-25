import { MoralisProvider } from "react-moralis"

export default function MoralisContextProvider({ children }) {
	return <MoralisProvider initializeOnMount={false}>{children}</MoralisProvider>
}
