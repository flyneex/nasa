// 'use client'
import Image from 'next/image'

type Props = {
	date: string
	explanation: string
	hdurl: string
	title: string
	url: string
	media_type: 'image' | 'video'
}

const Apod = async () => {
	// const [data, setData] = useState<Props | null>()
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const res = await api.get<Props>(
	// 				`/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}`
	// 			)
	// 			setData(res.data)
	// 		} catch (err) {
	// 			console.error(err)
	// 		}
	// 	}
	// 	fetchData()
	// }, [])
	const res = await fetch(
		`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`,
		{
			cache: 'no-store',
		}
	)
	const data: Props = await res.json()
	if (!data) return <p className='text-center font-bold'>Загрузка...</p>
	return (
		<>
			<div className='flex flex-col justify-center items-center h-screen p-[50px] bg-pink-300'>
				<div className='text-6xl mb-10 font-bold'>{data?.title}</div>
				<div>
					{data.media_type === 'image' ? (
						<Image
							src={data.url}
							width={500}
							height={500}
							alt={data.title}
							className='rounded-xl shadow mb-10'
						/>
					) : (
						<iframe
							src={data.url}
							className='w-[500px] h-[300px] mb-10 rounded-xl shadow'
							allowFullScreen
						/>
					)}
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
