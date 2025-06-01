import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Container, Stack, Button, Title, Loader, Group as MGroup, ScrollArea } from '@mantine/core'
import { IconPlus, IconDeviceFloppy } from '@tabler/icons-react'
import { useHotkeys, useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { nanoid } from 'nanoid'
import { getGroups, saveGroups, getInterfaces } from '../api/routerApi'
import { GroupCard } from '../components'
import type { Group, Rule, Interface } from '../api/types'

const MOBILE_BREAKPOINT = 800

const useIfaceOpts = () => {
    const [opts, setOpts] = useState<{ value: string; label: string }[]>([])
    useEffect(() => {
        getInterfaces().then((ifs: Interface[]) =>
            setOpts(ifs.map(i => ({ value: i.id, label: i.id })))
        )
    }, [])
    return opts
}

const deepEq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)

const createRule = (): Rule => ({
    id: nanoid(), name: '', type: 'namespace', rule: '', enable: true,
})

const GroupList: React.FC = () => {
    const ifaceOpts = useIfaceOpts()
    const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const [original, setOriginal] = useState<Group[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getGroups()
            .then(g => {
                setOriginal(g)
                setGroups(JSON.parse(JSON.stringify(g)))
                setOpenMap(Object.fromEntries(g.map(x => [x.id, true])))
            })
            .catch(e => showNotification({ title: 'Load error', message: e.message, color: 'red' }))
            .finally(() => setLoading(false))
    }, [])

    const dirty = useMemo(() => !deepEq(original, groups), [original, groups])
    const handleSave = useCallback(async () => {
        setSaving(true)
        try {
            const res = await saveGroups(groups)
            setOriginal(res)
            setGroups(JSON.parse(JSON.stringify(res)))
            showNotification({ message: 'Saved', color: 'green' })
        } catch (e: any) {
            showNotification({ title: 'Save error', message: e.message, color: 'red' })
        } finally {
            setSaving(false)
        }
    }, [groups])

    useHotkeys([['mod+S', e => {
        if (dirty && !saving) { e.preventDefault(); handleSave() }
    }]])

    // Добавляем группу ВВЕРХ
    const addGroup = () => {
        const id = nanoid()
        const g: Group = {
            id, name: 'New group', color: '#228be6', interface: ifaceOpts[0]?.value ?? '',
            enable: true, rules: [],
        }
        setGroups(prev => [g, ...prev])
        setOpenMap(o => ({ ...o, [id]: true }))
        setTimeout(() => {
            document.querySelector<HTMLInputElement>(`#gname-${id}`)?.focus()
        }, 0)
    }

    // Добавление правила в нужную группу (в начало) + автораскрытие
    const handleAddRuleToGroup = (groupId: string) => {
        setGroups(groups =>
            groups.map(g =>
                g.id === groupId ? { ...g, rules: [createRule(), ...g.rules] } : g
            )
        )
        setOpenMap(open => ({ ...open, [groupId]: true }))
    }

    if (loading) return (
        <Stack h="100vh" align="center" justify="center">
            <Loader size="lg" />
        </Stack>
    )

    return (
        <Container py="lg" size="md">
            <MGroup justify="space-between" mb="md" wrap="nowrap">
                <Title order={2}>Groups</Title>
                <MGroup gap="xs">
                    <Button variant="outline" leftSection={<IconPlus size={16} />} onClick={addGroup}>
                        New&nbsp;group
                    </Button>
                    <Button leftSection={<IconDeviceFloppy size={16} />}
                        disabled={!dirty || saving}
                        loading={saving}
                        onClick={handleSave}>
                        Save
                    </Button>
                </MGroup>
            </MGroup>
            <ScrollArea offsetScrollbars>
                <Stack gap="sm">
                    {groups.map((g: Group) => (
                        <GroupCard
                            key={g.id}
                            group={g}
                            ifaceOpts={ifaceOpts}
                            isOpen={openMap[g.id]}
                            toggle={() => setOpenMap((o: Record<string, boolean>) => ({ ...o, [g.id]: !o[g.id] }))}
                            patchGroup={(patch: Partial<Group>) =>
                                setGroups((arr: Group[]) => arr.map((x: Group) => x.id === g.id ? { ...x, ...patch } : x))
                            }
                            patchRules={(r: Rule[]) =>
                                setGroups((arr: Group[]) => arr.map((x: Group) => x.id === g.id ? { ...x, rules: r } : x))
                            }
                            removeGroup={() =>
                                setGroups((arr: Group[]) => arr.filter((x: Group) => x.id !== g.id))
                            }
                            isMobile={isMobile}
                            onAddRule={() => handleAddRuleToGroup(g.id)}
                        />
                    ))}
                </Stack>
            </ScrollArea>
        </Container>
    )
}

export default GroupList
