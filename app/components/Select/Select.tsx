'use client'
import dynamic from 'next/dynamic'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

const Select = dynamic(() => import('react-select'), {ssr: false})

type Options = {
	value: string
	label: string
}

const SelectFilter = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const options = [
		{value: 'all', label: 'All Asteroids'},
		{value: 'dangerous', label: 'Dangerous'},
		{value: 'sentry', label: 'Sentry'},
		{value: 'orbit', label: 'Orbit Earth'},
	]

	const CustomStyles = {
		option: (provided: any) => ({
			...provided,
			backgroundColor: 'white',
			color: 'black',
			'&:hover': {backgroundColor: '#1e2939', color: 'white'},
		}),
	}

	const current = searchParams.get('filter') || null
	const value = options.find(o => o.value === current) || null

	const onChange = (opt: any) => {
		const selected = (opt || null) as Options | null
		const params = new URLSearchParams(searchParams.toString())
		if (selected?.value) {
			params.set('filter', selected.value)
		} else {
			params.delete('filter')
		}
		router.replace(`${pathname}?${params.toString()}`)
	}

	return (
		<>
			<Select
				styles={CustomStyles}
				options={options}
				placeholder='Choose filter'
				isClearable
				value={value}
				onChange={onChange}
				closeMenuOnScroll={true}
			/>
		</>
	)
}

export default SelectFilter
