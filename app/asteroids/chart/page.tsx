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
import {useEffect, useState} from 'react'
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

export default function SimpleChart() {
	const [neos, setNeos] = useState<Props[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchData() {
			try {
				const start = '2024-01-01'
				const end = '2024-01-07'
				const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://api.nasa.gov'
				const apiKey = process.env.NEXT_PUBLIC_NASA_KEY ?? 'DEMO_KEY'

				const apiUrl = `${baseUrl}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`

				const res = await fetch(apiUrl)
				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

				const data = await res.json()
				const neosData = Object.values(data.near_earth_objects ?? {}).flat() as Props[]
				setNeos(neosData)
			} catch (error) {
				console.error('Failed to load NEO feed', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	if (loading) {
		return <div className='text-white text-xl p-5'>Loading chart...</div>
	}

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

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: {
					color: 'white',
				},
			},
		},
		scales: {
			y: {
				ticks: {
					color: 'white',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
			},
			x: {
				ticks: {
					color: 'white',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
			},
		},
	}

	return (
		<div className='p-5'>
			<h2 className='text-2xl font-bold mb-4 text-white'>Asteroids Statistics</h2>
			<div className='bg-gray-800 p-4 rounded-lg'>
				<div style={{height: '400px'}}>
					<Bar data={data} options={options} />
				</div>
			</div>
		</div>
	)
}
