import { plans } from '@/constants'

const Subscription = () => {
    return (
        <main className="min-h-screen bg-orange-50 px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-violet-900">Elegí tu plan</h1>
                <p className="mt-2 text-gray-600">Comenzá gratis y mejorá cuando quieras</p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`flex h-[480px] flex-col justify-between rounded-2xl border p-8 shadow-md transition-all duration-300 ${
                            plan.highlight
                                ? 'scale-[1.02] border-yellow-500 bg-yellow-50'
                                : 'border-gray-300 bg-white'
                        }`}
                    >
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-violet-900">{plan.name}</h2>
                            <p className="mb-4 text-lg font-semibold text-gray-700">{plan.price}</p>
                            <ul className="mb-6 space-y-2 text-gray-600">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="mt-[2px] mr-2 text-green-600">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            className={`w-full cursor-pointer rounded-md py-3 font-semibold text-white transition ${
                                plan.highlight
                                    ? 'bg-yellow-400 hover:bg-yellow-500'
                                    : 'bg-violet-900 hover:bg-violet-950'
                            }`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Subscription
