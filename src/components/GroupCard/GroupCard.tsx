import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    Paper, ActionIcon, Button, Checkbox, ColorInput, Popover, Select, Stack, TextInput, Group as MGroup, Box
} from '@mantine/core'
import { IconPlus, IconTrash, IconChevronDown, IconChevronUp, IconPalette } from '@tabler/icons-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FixedSizeList as List } from 'react-window'
import { SortableRuleRow } from '../'
import type { Rule } from '../../api/types'

const VIRTUAL_ROW_HEIGHT = 48

const GroupCard = React.memo(function GroupCard({
    group, ifaceOpts, isOpen, toggle, patchGroup, patchRules, removeGroup, isMobile, onAddRule
}: any) {
    const [rules, setRules] = useState<Rule[]>(group.rules)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [colorPopoverOpened, setColorPopoverOpened] = useState(false)
    const colorInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { setRules(group.rules) }, [group.rules])

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        setDraggingId(null)
        if (active?.id && over?.id && active.id !== over.id) {
            const oldIndex = rules.findIndex(r => r.id === active.id)
            const newIndex = rules.findIndex(r => r.id === over.id)
            const newRules = arrayMove(rules, oldIndex, newIndex)
            setRules(newRules)
            patchRules(newRules)
        }
    }
    const handleDragStart = (event: any) => setDraggingId(event.active.id)

    const update = useCallback((i: number, k: keyof Rule, v: any) =>
        setRules(r => {
            const arr = r.map((rr, j) => j === i ? { ...rr, [k]: v } : rr)
            patchRules(arr)
            return arr
        })
        , [patchRules])

    const remove = useCallback((i: number) =>
        setRules(r => {
            const arr = r.filter((_, j) => j !== i)
            patchRules(arr)
            return arr
        })
        , [patchRules])

    const enableAll = useCallback((flag: boolean) =>
        setRules(rules => {
            const arr = rules.map(r => ({ ...r, enable: flag }))
            patchRules(arr)
            return arr
        })
        , [patchRules])

    const deleteAll = useCallback(() =>
        setRules(() => {
            patchRules([])
            return []
        })
        , [patchRules])

    const activeRule = draggingId ? rules.find(r => r.id === draggingId) : null

    const showVirtual = rules.length > 5
    const RuleRow = ({ index, style }: { index: number, style: React.CSSProperties }) => (
        <div style={style}>
            <SortableRuleRow
                key={rules[index].id}
                rule={rules[index]}
                idx={index}
                update={update}
                remove={remove}
                isMobile={isMobile}
            />
        </div>
    )

    // ColorInput: нельзя удалить # (добавляется автоматически)
    const handleColorChange = (color: string) => {
        let safe = color
        if (!safe.startsWith('#')) safe = '#' + safe.replace(/^#*/, '')
        patchGroup({ color: safe })
    }

    return (
        <Paper withBorder radius="lg" p="sm" shadow="md">
            <MGroup align="center" gap={12} mb="xs" wrap="nowrap" justify="space-between">
                <MGroup align="center" gap={8} wrap="nowrap">
                    <Popover
                        opened={colorPopoverOpened}
                        onChange={setColorPopoverOpened}
                        trapFocus
                        closeOnEscape
                        withArrow
                        withinPortal
                        shadow="sm"
                        width={220}
                        position="bottom"
                        offset={8}
                        closeOnClickOutside={false}
                    >
                        <Popover.Target>
                            <ActionIcon
                                size="lg"
                                radius="xl"
                                variant="default"
                                style={{
                                    '--group-bg': group.color,
                                    background: 'var(--group-bg)',
                                    color: 'lch(from var(--group-bg) calc((49.44 - l) * infinity) 0 0)',
                                    border: 'none'
                                } as React.CSSProperties}
                                onClick={() => setColorPopoverOpened(o => !o)}
                                aria-label="Change group color"
                                tabIndex={0}
                            >
                                <IconPalette size={18} />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown
                            p={8}
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                            style={{ minWidth: 200 }}
                        >
                            <ColorInput
                                ref={colorInputRef}
                                format="hex"
                                value={group.color}
                                onChange={handleColorChange}
                                withEyeDropper
                                onFocus={() => setColorPopoverOpened(true)}
                                onBlur={() => setTimeout(() => setColorPopoverOpened(false), 150)}
                                autoFocus
                            />
                        </Popover.Dropdown>
                    </Popover>
                    <TextInput
                        value={group.name}
                        onChange={e => patchGroup({ name: e.currentTarget.value })}
                        styles={{ input: { fontSize: 20, fontWeight: 700, background: 'transparent', border: 'none', paddingLeft: 0 } }}
                        w={180}
                        variant="unstyled"
                        autoFocus
                        placeholder="Group name"
                        id={`gname-${group.id}`}
                    />
                    <Select
                        data={ifaceOpts}
                        value={group.interface}
                        onChange={v => patchGroup({ interface: v || '' })}
                        size="xs"
                        w={90}
                        placeholder="Iface"
                    />
                    <Checkbox
                        checked={group.enable}
                        onChange={e => patchGroup({ enable: e.currentTarget.checked })}
                        size="sm"
                        radius="xl"
                        color="blue"
                    />
                </MGroup>
                <MGroup gap={4} wrap="nowrap">
                    <ActionIcon variant="light" onClick={onAddRule} size="sm" color="blue">
                        <IconPlus size={16} />
                    </ActionIcon>
                    <ActionIcon variant="default" onClick={toggle} size="sm">
                        {isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={removeGroup} size="sm">
                        <IconTrash size={18} />
                    </ActionIcon>
                </MGroup>
            </MGroup>
            {isOpen && (
                <>
                    <MGroup gap="xs" mb={4}>
                        <Button size="xs" variant="light" onClick={() => enableAll(true)}>
                            Enable all
                        </Button>
                        <Button size="xs" variant="light" color="gray" onClick={() => enableAll(false)}>
                            Disable all
                        </Button>
                        <Button size="xs" variant="light" color="red" onClick={deleteAll}>
                            Delete all
                        </Button>
                    </MGroup>
                    {!isMobile ? (
                        <Box display="flex" style={{ gap: 8, fontWeight: 600, padding: '4px 0 2px 0', width: '100%', minWidth: 600 }}>
                            <Box w={24}></Box>
                            <Box style={{ flex: 1 }}>Name</Box>
                            <Box w={120}>Type</Box>
                            <Box style={{ flex: 2 }}>Pattern</Box>
                            <Box w={60} style={{ textAlign: 'center' }}>Enabled</Box>
                            <Box w={32}></Box>
                        </Box>
                    ) : (
                        <Box pb={8} style={{ color: '#888' }}>Rule list</Box>
                    )}
                    {rules.length === 0 && (
                        <Box p="lg" style={{ color: '#bbb', textAlign: 'center' }}>Нет правил в этой группе — добавьте правило</Box>
                    )}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                    >
                        <SortableContext items={rules.map(r => r.id)} strategy={verticalListSortingStrategy}>
                            {showVirtual ? (
                                <List
                                    height={240}
                                    itemCount={rules.length}
                                    itemSize={VIRTUAL_ROW_HEIGHT}
                                    width={'100%'}
                                    overscanCount={6}
                                    style={{ background: 'transparent' }}
                                >
                                    {RuleRow}
                                </List>
                            ) : (
                                <Stack gap={0} mt="xs">
                                    {rules.map((rule, idx) => (
                                        <SortableRuleRow
                                            key={rule.id}
                                            rule={rule}
                                            idx={idx}
                                            update={update}
                                            remove={remove}
                                            isMobile={isMobile}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </SortableContext>
                        <DragOverlay adjustScale style={{
                            zIndex: 99999,
                            background: 'var(--mantine-color-body)',
                            borderRadius: 8,
                            padding: 0,
                        }}>
                            {activeRule && (
                                <SortableRuleRow
                                    rule={activeRule}
                                    idx={rules.findIndex(r => r.id === activeRule.id)}
                                    update={() => { }}
                                    remove={() => { }}
                                    isMobile={isMobile}
                                    isOverlay
                                />
                            )}
                        </DragOverlay>
                    </DndContext>
                </>
            )}
        </Paper>
    )
})

export default GroupCard
