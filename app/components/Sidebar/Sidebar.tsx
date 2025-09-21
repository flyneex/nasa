import Link from 'next/link'

const Sidebar = () => {
	return (
		<div className='text-center text-white text-2xl flex flex-col gap-5'>
			{/* <Link href='/asteroids?view=chart'>Graphics</Link>
			<Link href='/asteroids?view=list'>List Asteroids</Link> */}
			<Link href='/asteroids'>Dashboard</Link>
			<Link href='/asteroids/chart'>Graphics</Link>
			<Link href='/asteroids/list'>List Asteroids</Link>
		</div>
	)
}

export default Sidebar
