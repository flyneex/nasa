import {ReactNode} from 'react'
import Sidebar from '../components/Sidebar/Sidebar'

const layout = ({children}: {children: ReactNode}) => {
	return (
		<div className='flex h-full'>
			<div className='w-[400px] bg-slate-500 p-10'>
				<Sidebar />
			</div>
			<div className='grow-1'>{children}</div>
		</div>
	)
}

export default layout
