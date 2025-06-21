import { Skeleton } from '@/components/ui/skeleton'

const CompanionSessionSkeleton = () => {
	return (
		<main className='flex flex-col gap-6'>
			<section className='rounded-border flex justify-between p-6 max-md:flex-col'>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-[72px] w-[72px] rounded-lg' />
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-[24px] w-[200px]' />
						<Skeleton className='h-[16px] w-[300px]' />
					</div>
				</div>
				<Skeleton className='h-[24px] w-[80px] max-md:hidden' />
			</section>

			<section className='h-[70vh] rounded-lg border p-6'>
				<Skeleton className='h-full w-full' />
			</section>
		</main>
	)
}

export default CompanionSessionSkeleton
