'use client'

import { cn, getSubjectColor } from '@/lib/utils'
import Image from 'next/image'
import Lottie from 'lottie-react'
import soundwaves from '@/constants/soundwaves.json'
import { CallStatus, useCompanion } from '@/hooks/useCompanion'
import { Copy, Check } from 'lucide-react'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { SUMMARY_LIMITS } from '@/constants'

const CompanionComponent = ({
	companionId,
	subject,
	name,
	userName,
	userImage,
	style,
	voice,
	topic,
	translations: { connecting, turnOnMic, turnOffMic, startSession, endSession }
}: CompanionComponentProps) => {
	const {
		callStatus,
		isMuted,
		messages,
		toggleMicrophone,
		handleCall,
		handleDisconnect,
		lottieRef,
		summary,
		loadingSummary,
		userPlan,
		handleGenerate,
		copied,
		setCopied,
		summaryCount,
		userDataLoaded
	} = useCompanion({
		companionId,
		subject,
		topic,
		style,
		voice,
		userName,
		name
	})

	return (
		<section className='flex h-[70vh] flex-col'>
			<section className='flex gap-8 max-sm:flex-col'>
				<div className='companion-section'>
					<div
						className='companion-avatar'
						style={{ backgroundColor: getSubjectColor(subject) }}
					>
						<div
							className={cn(
								'absolute transition-opacity duration-1000',
								callStatus === CallStatus.FINISHED ||
									callStatus === CallStatus.INACTIVE
									? 'opacity-100'
									: 'opacity-0',
								callStatus === CallStatus.CONNECTING && 'animate-pulse opacity-100'
							)}
						>
							<Image
								src={`/icons/${subject}.svg`}
								alt={subject}
								width={150}
								height={150}
								className='max-sm:w-fit'
							/>
						</div>

						<div
							className={cn(
								'absolute transition-opacity duration-1000',
								callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
							)}
						>
							<Lottie
								lottieRef={lottieRef}
								animationData={soundwaves}
								autoplay={false}
								className='companion-lottie'
							/>
						</div>
					</div>
					<p className='text-2xl font-bold'>{name}</p>
				</div>
				<div className='user-section'>
					<div className='user-avatar'>
						<Image
							src={userImage}
							alt={userName}
							width={130}
							height={130}
							className='rounded-lg'
						/>
						<p className='text-2xl font-bold'>{userName}</p>
					</div>
					<button
						className='btn-mic'
						onClick={toggleMicrophone}
						disabled={callStatus !== CallStatus.ACTIVE}
					>
						<Image
							src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
							alt='mic'
							width={36}
							height={36}
							style={
								callStatus === CallStatus.ACTIVE
									? { opacity: 1 }
									: { opacity: 0.5, cursor: 'default' }
							}
						/>
						<p className='max-sm:hidden'>{isMuted ? turnOnMic : turnOffMic}</p>
					</button>
					<button
						className={cn(
							'w-full cursor-pointer rounded-lg py-2 text-white transition-colors',
							callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-primary',
							callStatus === CallStatus.CONNECTING && 'animate-pulse'
						)}
						onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
					>
						{callStatus === CallStatus.ACTIVE
							? endSession
							: callStatus === CallStatus.CONNECTING
								? connecting
								: startSession}
					</button>
				</div>
			</section>

			<section className='transcript'>
				<div className='transcript-message no-scrollbar'>
					{messages.map((message, index) => {
						if (message.role === 'assistant') {
							return (
								<p key={index} className='max-sm:text-sm'>
									{name.split(' ')[0].replace('/[.,]/g, ', '')}: {message.content}
								</p>
							)
						} else {
							return (
								<p key={index} className='text-primary max-sm:text-sm'>
									{userName}: {message.content}
								</p>
							)
						}
					})}
				</div>

				{callStatus === CallStatus.FINISHED && userDataLoaded && (
					<div className='mt-4 text-center'>
						{userPlan === 'free' && summaryCount >= SUMMARY_LIMITS.free ? (
							<div className='flex flex-col items-center gap-2'>
								<p className='text-sm text-muted-foreground'>
									Ya alcanzaste el límite de 10 resúmenes gratuitos.
								</p>
								<ButtonWithLoading redirectTo='/subscriptions'>
									Mejorar mi Plan
								</ButtonWithLoading>
							</div>
						) : (
							<ButtonWithLoading
								redirectTo=''
								onClickExtra={handleGenerate}
								disabled={loadingSummary}
							>
								{loadingSummary ? 'Generando...' : 'Generar resumen'}
							</ButtonWithLoading>
						)}
					</div>
				)}

				{summary && (
					<div className='mt-6 p-4 border rounded-lg bg-muted text-sm relative'>
						<h3 className='font-bold mb-2'>Resumen</h3>
						<p className='whitespace-pre-line'>{summary}</p>
						<button
							onClick={async () => {
								await navigator.clipboard.writeText(summary)
								setCopied(true)
								setTimeout(() => setCopied(false), 2000)
							}}
							title='Copiar resumen'
							className='absolute top-4 right-4 p-2 rounded hover:bg-primary/10 transition'
						>
							{copied ? (
								<Check size={18} className='text-primary' />
							) : (
								<Copy size={18} />
							)}
						</button>
					</div>
				)}
			</section>
		</section>
	)
}
export default CompanionComponent
