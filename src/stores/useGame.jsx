import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
export default create(subscribeWithSelector((set) =>
{
    return {
        blocksCount: 10,
        blocksSeed: 0,
        phase: 'ready',
        startTime: 0,
        endTime: 0,
        start: () =>
        {
            set((state) =>
            {
                console.log('playing')
                if(state.phase === 'ready')
                return { phase: 'playing',startTime: Date.now() }
                return {}
            })
        },

        restart: () =>
        {
            set((state) =>
            {
                console.log('ready')
                if(state.phase === 'playing' || state.phase === 'ended')
                return { phase: 'ready', blocksSeed: Math.random() }
                return {}
            })
        },

        end: () =>
        {
            set((state) =>
            {
                console.log('end')
                if(state.phase === 'playing')
                return { phase: 'ended', endTime: Date.now() }
                return {}
            })
        }
    }
}))