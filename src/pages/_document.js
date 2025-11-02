import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="tr">
				<Head />
				<body className={`antialiased  bg-gradient-to-b from-[#FFFAF4]`}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
