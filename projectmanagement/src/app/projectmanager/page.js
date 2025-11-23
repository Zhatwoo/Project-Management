"use client"

import Header from '../components/header'
import Footer from '../components/footer'
import SidebarPM from './components/sidebarPM'

export default function Page() {
	return (
		<>
			<Header />

			<main className="pt-16 pb-12">
				<SidebarPM />
			</main>

			<Footer />
		</>
	)
}
