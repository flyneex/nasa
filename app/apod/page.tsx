'use client'
import api from '@/lib/axios/api'
import Image from 'next/image'
import {useEffect, useState} from 'react'

type Props = {
	date: string
	explanation: string
	hdurl: string
	title: string
	url: string
	media_type: 'image' | 'video'
}

const Apod = () => {
	const [data, setData] = useState<Props | null>()
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await api.get<Props>(
					`/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}`
				)
				setData(res.data)
			} catch (err) {
				console.error(err)
			}
		}
		fetchData()
	}, [])
	if (!data) return <p className='text-center font-bold'>Загрузка...</p>
	return (
		<>
			<div className='flex flex-col justify-center items-center h-screen p-[50px] bg-pink-300'>
				<div className='text-6xl mb-10 font-bold'>{data?.title}</div>
				<div>
					<Image
						src={data?.url}
						width={500}
						height={500}
						alt='Picture'
						className='rounded-xl shadow mb-10'
					/>
				</div>
				<div className='mb-10 text-justify'>
					Description: {data?.explanation}
				</div>
				<div className='font-bold'>Date: {data?.date}</div>
			</div>
		</>
	)
}

export default Apod
