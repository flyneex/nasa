import {format} from 'date-fns'
import {Suspense} from 'react'
import SimpleChart from './chart/page'
import AsteroidsList from './list/page'

type Object = {
	near_earth_objects: {
		[date: string]: Props[]
	}
}

type Props = {
	id: string
	name: string
	absolute_magnitude_h: number
	estimated_diameter: {
		kilometers: {
			estimated_diameter_min: number
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

async function DashboardContent({
	searchParams,
}: {
	searchParams: {[key: string]: string | string[] | undefined}
}) {
	const start = format(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
	const end = format(new Date(), 'yyyy-MM-dd')

	const baseUrl = process.env.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://api.nasa.gov'
	const apiKey = process.env.NASA_KEY ?? process.env.NEXT_PUBLIC_NASA_KEY ?? 'DEMO_KEY'

	let neos: Props[] = []

	// Отладочная информация
	console.log('=== NASA API Debug Info ===')
	console.log('baseUrl:', baseUrl)
	console.log('apiKey:', apiKey)
	console.log('start_date:', start)
	console.log('end_date:', end)
	console.log('Environment variables check:')
	console.log('  process.env.BASE_URL:', process.env.BASE_URL)
	console.log('  process.env.NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
	console.log('  process.env.NASA_KEY:', process.env.NASA_KEY)
	console.log('  process.env.NEXT_PUBLIC_NASA_KEY:', process.env.NEXT_PUBLIC_NASA_KEY)

	const apiUrl = `${baseUrl}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`
	console.log('API URL:', apiUrl)

	try {
		const res = await fetch(apiUrl, {cache: 'no-store'})

		console.log('Response status:', res.status)
		console.log('Response ok:', res.ok)

		if (!res.ok) {
			const errorText = await res.text()
			console.error('Error response:', errorText)
			throw new Error(`Fetch failed: ${res.status} - ${errorText}`)
		}

		const data: Object = await res.json()
		console.log('Raw API data:', data)
		neos = Object.values(data.near_earth_objects ?? {}).flat()
		console.log('Processed neos array:', neos)
		console.log('Number of asteroids found:', neos.length)
	} catch (error) {
		console.error('Failed to load NEO feed:', error)
		neos = []
	}

	if (searchParams.filter === 'dangerous') {
		neos = neos.filter(n => n.is_potentially_hazardous_asteroid)
	} else if (searchParams.filter === 'sentry') {
		neos = neos.filter(n => n.is_sentry_object)
	}

	return (
		<div>
			<SimpleChart neos={neos} />
			<AsteroidsList neos={neos} />
		</div>
	)
}

export default function Dashboard({
	searchParams,
}: {
	searchParams: {[key: string]: string | string[] | undefined}
}) {
	return (
		<Suspense fallback={<div className='text-white text-xl p-5'>Loading...</div>}>
			<DashboardContent searchParams={searchParams} />
		</Suspense>
	)
}
