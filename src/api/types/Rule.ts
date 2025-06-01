export type Rule = {
    id: string
    name: string
    type: 'namespace' | 'ipnet' | 'wildcard' | 'regex'
    rule: string
    enable: boolean
}