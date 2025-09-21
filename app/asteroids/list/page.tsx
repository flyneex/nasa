import SelectFilter from '@/app/components/Select/Select'

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

const AsteroidsList = ({neos = []}: {neos?: Props[]}) => {
	return (
		<>
			<div className='p-10 min-h-screen text-white'>
				<h1 className='text-4xl font-bold mb-6 text-black'>🌍 Asteroids of the Week (NeoWs)</h1>
				<div className='mb-8'>
					<SelectFilter />
				</div>
				<table className='w-full border-collapse bg-gray-800 rounded-xl overflow-hidden shadow-lg'>
					<thead>
						<tr className='bg-gray-700 text-left'>
							<th className='p-3'>ID</th>
							<th className='p-3'>Name</th>
							<th className='p-3'>Max size (km)</th>
							<th className='p-3'>Velocity (km/h)</th>
							<th className='p-3'>Distance (km)</th>
							<th className='p-3'>Dangerous?</th>
							<th className='p-3'>Sentry?</th>
							<th className='p-3'>Orbit</th>
						</tr>
					</thead>
					<tbody>
						{neos.length === 0 ? (
							<tr>
								<td className='p-3 text-center' colSpan={8}>
									No data
								</td>
							</tr>
						) : (
							neos.map(neo => (
								<tr key={neo.id} className='border-t border-gray-700'>
									<td className='p-3'>{neo.id}</td>
									<td className='p-3'>{neo.name}</td>
									<td className='p-3'>
										{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}
									</td>
									<td className='p-3'>
										{parseFloat(
											neo.close_approach_data[0].relative_velocity.kilometers_per_hour
										).toFixed(0)}
									</td>
									<td className='p-3'>
										{parseFloat(
											neo.close_approach_data[0].miss_distance.kilometers
										).toLocaleString()}
									</td>
									<td className='p-3'>
										{neo.is_potentially_hazardous_asteroid ? '⚠️ Yes' : '✅ No'}
									</td>
									<td className='p-3'>{neo.is_sentry_object ? '👀 Yes' : '😑 No'}</td>
									<td className='p-3'>{neo.close_approach_data[0].orbiting_body}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default AsteroidsList
