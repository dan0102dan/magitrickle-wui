import type { Rule } from './'

export type Group = {
    id: string
    name: string
    color: string
    interface: string
    enable: boolean
    rules: Rule[]
}