'use client'

import SelectFilter from '@/app/components/Select/Select'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

type Object = {
	near_earth_objects: {
		[date: string]: Props[]
	}
}

type Props = {
	id: string
	name: string
	estimated_diameter: {
		kilometers: {
			estimated_diameter_max: number
		}
	}
	is_potentially_hazardous_asteroid: boolean
	close_approach_data: {
		relative_velocity: {
			kilometers_per_hour: string
		}
		miss_distance: {
			kilometers: string
		}
		orbiting_body: string
	}[]
	is_sentry_object: boolean
}

export default function AsteroidsList() {
	const [neos, setNeos] = useState<Props[]>([])
	const [filteredNeos, setFilteredNeos] = useState<Props[]>([])
	const [loading, setLoading] = useState(true)
	const searchParams = useSearchParams()
	const filter = searchParams.get('filter') || 'all'

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

				const data: Object = await res.json()
				const neosData = Object.values(data.near_earth_objects ?? {}).flat()
				setNeos(neosData)
				setFilteredNeos(neosData)
			} catch (error) {
				console.error('Failed to load NEO feed', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		let filtered = neos

		switch (filter) {
			case 'dangerous':
				filtered = neos.filter(neo => neo.is_potentially_hazardous_asteroid)
				break
			case 'sentry':
				filtered = neos.filter(neo => neo.is_sentry_object)
				break
			case 'orbit':
				filtered = neos.filter(neo =>
					neo.close_approach_data?.some(ca => ca.orbiting_body === 'Earth')
				)
				break
			default:
				filtered = neos
		}

		setFilteredNeos(filtered)
	}, [filter, neos])

	if (loading) {
		return <div className='text-white text-xl p-5'>Loading asteroids...</div>
	}

	return (
		<div className='p-5'>
			<h2 className='text-2xl font-bold mb-4'>Asteroids List</h2>

			<div className='mb-4'>
				<SelectFilter />
			</div>

			<div className='bg-gray-800 rounded-lg overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-white'>
						<thead className='bg-gray-700'>
							<tr>
								<th className='px-4 py-2 text-left'>ID</th>
								<th className='px-4 py-2 text-left'>Name</th>
								<th className='px-4 py-2 text-left'>Size (km)</th>
								<th className='px-4 py-2 text-left'>Speed (km/h)</th>
								<th className='px-4 py-2 text-left'>Distance (km)</th>
								<th className='px-4 py-2 text-left'>Dangerous</th>
								<th className='px-4 py-2 text-left'>Sentry</th>
							</tr>
						</thead>
						<tbody>
							{filteredNeos.map(neo => (
								<tr key={neo.id} className='border-b border-gray-600 hover:bg-gray-700'>
									<td className='px-4 py-2'>{neo.id}</td>
									<td className='px-4 py-2 font-medium'>{neo.name}</td>
									<td className='px-4 py-2'>
										{neo.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2) ||
											'N/A'}
									</td>
									<td className='px-4 py-2'>
										{neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 'N/A'}
									</td>
									<td className='px-4 py-2'>
										{neo.close_approach_data?.[0]?.miss_distance?.kilometers || 'N/A'}
									</td>
									<td className='px-4 py-2'>
										<span
											className={`px-2 py-1 rounded text-xs ${
												neo.is_potentially_hazardous_asteroid
													? 'bg-red-500 text-white'
													: 'bg-gray-500 text-white'
											}`}
										>
											{neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
										</span>
									</td>
									<td className='px-4 py-2'>
										<span
											className={`px-2 py-1 rounded text-xs ${
												neo.is_sentry_object ? 'bg-pink-500 text-white' : 'bg-gray-500 text-white'
											}`}
										>
											{neo.is_sentry_object ? 'Yes' : 'No'}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className='mt-4 text-white'>
				Showing {filteredNeos.length} of {neos.length} asteroids
			</div>
		</div>
	)
}
