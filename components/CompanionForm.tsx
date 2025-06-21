'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { subjects } from '@/constants'
import { Textarea } from '@/components/ui/textarea'
import { createCompanion } from '@/lib/actions/companion.actions'
import { redirect } from 'next/navigation'
import { useTranslatedSubject } from '@/lib/subject'
import { useRedirectWithLoader } from '@/hooks/useRedirectWithLoader'
import { Loader2Icon } from 'lucide-react'
import es from '@/messages/es.json'

const formSchema = z.object({
	name: z.string().min(1, { message: 'Companion is required.' }),
	subject: z.string().min(1, { message: 'Subject is required.' }),
	topic: z.string().min(1, { message: 'Topic is required.' }),
	voice: z.string().min(1, { message: 'Topic is required.' }),
	style: z.string().min(1, { message: 'Voice is required.' }),
	duration: z.coerce.number().min(1, { message: 'Duration is required.' })
})

const CompanionForm = () => {
	const t = es['form']
	const translateSubject = useTranslatedSubject()
	const { loading, handleRedirect } = useRedirectWithLoader()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			subject: '',
			voice: '',
			style: '',
			topic: '',
			duration: 15
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const companion = await createCompanion(values)

		if (companion) {
			handleRedirect(`/companions/${companion.id}`)
		} else {
			console.log('Failed to create a companion')
			redirect('/')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.name}</FormLabel>
							<FormControl>
								<Input
									placeholder={t.name_placeholder}
									className='input'
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='subject'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.subject}</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className='input capitalize'>
										<SelectValue placeholder={t.subject_placeholder} />
									</SelectTrigger>
									<SelectContent>
										{subjects.map((subject) => (
											<SelectItem
												key={subject}
												value={subject}
												className='capitalize'
											>
												{translateSubject(subject)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='topic'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.topic}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t.topic_placeholder}
									className='input'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='voice'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.voice}</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className='input'>
										<SelectValue placeholder={t.voice_placeholder} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='male' className='capitalize'>
											{t.voice_male}
										</SelectItem>
										<SelectItem value='female' className='capitalize'>
											{t.voice_female}
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='style'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.style}</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className='input'>
										<SelectValue placeholder={t.style_placeholder} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='formal' className='capitalize'>
											Formal
										</SelectItem>
										<SelectItem value='casual' className='capitalize'>
											Casual
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='duration'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t.duration}</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='15'
									className='input'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full cursor-pointer'>
					{loading ? (
						<>
							<Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
							{t.submit}
						</>
					) : (
						t.submit
					)}
				</Button>
			</form>
		</Form>
	)
}
export default CompanionForm
