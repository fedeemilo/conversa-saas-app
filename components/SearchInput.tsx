'use client'

import Image from 'next/image'
import useSearchFilter from '@/hooks/useSearchFilter'
import es from '@/messages/es.json'

const SearchInput = () => {
    const { searchQuery, setSearchQuery } = useSearchFilter({
        filter: 'topic',
        resetValue: '',
        clearOnlyOnPath: '/companions'
    })

    const t = es['search']

    return (
        <div className="relative flex h-fit items-center gap-2 rounded-lg border border-black px-2 py-1">
            <Image src="/icons/search.svg" alt="search" width={15} height={15} />
            <input
                placeholder={t.placeholder}
                className="outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
export default SearchInput
