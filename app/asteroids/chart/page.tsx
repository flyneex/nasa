'use client'

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import {Bar} from 'react-chartjs-2'

// регистрация компонентов Chart.js (без этого не заработает)
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend)

type Props = {
	id: string
	name: string
	is_potentially_hazardous_asteroid: boolean
	is_sentry_object: boolean
	close_approach_data: {
		orbiting_body: string
	}[]
}

export default function SimpleChart({neos = []}: {neos?: Props[]}) {
	const dangerous = neos.filter(d => d.is_potentially_hazardous_asteroid).length
	const sentry = neos.filter(s => s.is_sentry_object).length
	const orbit = neos.filter(n =>
		n.close_approach_data?.some(ca => ca.orbiting_body === 'Earth')
	).length

	console.log('dangerous', dangerous)
	console.log('sentry', sentry)
	console.log('orbit', orbit)

	const data = {
		labels: ['Orbit', 'Dangerous', 'Sentry'],
		datasets: [
			{
				label: 'Graphics',
				data: [orbit, dangerous, sentry],
				backgroundColor: ['hotpink', 'crimson', 'cyan'],
			},
		],
	}

	// const options = {
	// 	responsive: true,
	// 	maintainAspectRatio: false,
	// }

	return <Bar data={data} />
}
