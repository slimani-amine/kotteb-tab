import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import 'react-toastify/dist/ReactToastify.min.css';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement as Element)

root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<App />
		</I18nextProvider>
	</React.StrictMode>
)
