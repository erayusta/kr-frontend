import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="tr">
				<Head>
					{/* Google Publisher Tags (GPT) */}
					<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" />
				</Head>
				<body className={`antialiased bg-[#fffaf4]`}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
