import {create} from 'zustand'

const voiceTypeZustand = create((set) => ({
    voiceType:'on',
    setVoiceType: (type) => set({voiceType:type}),
}))

export default voiceTypeZustand;