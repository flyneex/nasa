import {Suspense} from 'react'
import SimpleChart from './chart/page'
import AsteroidsList from './list/page'

export default function Dashboard() {
	return (
		<Suspense fallback={<div className='text-white text-xl p-5'>Loading...</div>}>
			<div>
				<SimpleChart />
				<AsteroidsList />
			</div>
		</Suspense>
	)
}
