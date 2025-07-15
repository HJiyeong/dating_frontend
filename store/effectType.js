import {create} from 'zustand'

const effectTypeZustand = create((set) => ({
    effectType:'on',
    setEffectType: (type) => set({effectType:type}),
}))

export default effectTypeZustand;