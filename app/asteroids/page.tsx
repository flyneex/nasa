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

	const baseUrl = process.env.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL
	const apiKey = process.env.NASA_KEY ?? process.env.NEXT_PUBLIC_NASA_KEY

	let neos: Props[] = []
	try {
		const res = await fetch(
			`${baseUrl}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`,
			{cache: 'no-store'}
		)

		if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
		const data: Object = await res.json()
		console.log(data)
		neos = Object.values(data.near_earth_objects ?? {}).flat()
	} catch (error) {
		console.error('Failed to load NEO feed', error)
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
