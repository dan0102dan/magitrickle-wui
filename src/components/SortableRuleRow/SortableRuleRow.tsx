import React from 'react'
import { Box, Checkbox, TextInput, ActionIcon, Select } from '@mantine/core'
import { useSortable } from '@dnd-kit/sortable'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { CSS } from '@dnd-kit/utilities'
import type { Rule } from '../../api/types'

const RULE_TYPES = [
    { value: 'namespace', label: 'Namespace' },
    { value: 'ipnet', label: 'IPnet' },
    { value: 'wildcard', label: 'Wildcard' },
    { value: 'regex', label: 'Regex' },
    { value: 'domain', label: 'Domain' },
]

const SortableRuleRow = React.memo(function SortableRuleRow({
    rule, idx, update, remove, isMobile, isOverlay = false
}: {
    rule: Rule, idx: number,
    update: (idx: number, key: keyof Rule, value: any) => void,
    remove: (idx: number) => void,
    isMobile: boolean,
    isOverlay?: boolean
}) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: rule.id })

    return (
        <Box
            ref={setNodeRef}
            style={{
                display: 'flex',
                alignItems: isMobile ? undefined : 'center',
                gap: 8,
                width: '100%',
                minHeight: 40,
                background: isOverlay ? 'var(--mantine-color-body)' : undefined,
                transition,
                transform: CSS.Transform.toString(transform),
                zIndex: isDragging || isOverlay ? 2 : undefined,
                boxShadow: isOverlay ? '0 2px 12px rgba(40,40,60,0.07)' : undefined,
                padding: isMobile ? '8px 4px' : '0',
                flexDirection: isMobile ? 'column' : 'row',
                opacity: isOverlay ? 0.97 : 1,
                borderRadius: isOverlay ? 8 : 0
            }}
            {...attributes}
            {...listeners}
        >
            <Box w={isMobile ? undefined : 24} style={{ textAlign: 'center', cursor: 'grab', marginBottom: isMobile ? 4 : 0 }}>
                <IconGripVertical size={16} />
            </Box>
            <Box style={{ flex: 1, width: isMobile ? '100%' : undefined }}>
                <TextInput
                    defaultValue={rule.name}
                    placeholder={`#${idx + 1}`}
                    size="xs"
                    onBlur={e => update(idx, 'name', e.currentTarget.value)}
                    w="100%"
                />
            </Box>
            <Box w={isMobile ? '100%' : 120} style={{ marginTop: isMobile ? 4 : 0 }}>
                <Select
                    data={RULE_TYPES}
                    value={rule.type}
                    size="xs"
                    onChange={v => update(idx, 'type', v)}
                    w="100%"
                />
            </Box>
            <Box style={{ flex: 2, width: isMobile ? '100%' : undefined, marginTop: isMobile ? 4 : 0 }}>
                <TextInput
                    defaultValue={rule.rule}
                    placeholder="pattern…"
                    size="xs"
                    onBlur={e => update(idx, 'rule', e.currentTarget.value)}
                    w="100%"
                />
            </Box>
            {!isMobile ? (
                <>
                    <Box w={60} style={{ textAlign: 'center' }}>
                        <Checkbox
                            checked={rule.enable}
                            size="xs"
                            onChange={e => update(idx, 'enable', e.currentTarget.checked)}
                        />
                    </Box>
                    <Box w={32} style={{ textAlign: 'center' }}>
                        <ActionIcon variant="subtle" color="red" onClick={() => remove(idx)} size="sm">
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Box>
                </>
            ) : (
                <Box style={{ width: '100%', marginTop: 8, display: 'flex', gap: 12 }}>
                    <Checkbox
                        checked={rule.enable}
                        size="xs"
                        onChange={e => update(idx, 'enable', e.currentTarget.checked)}
                        label="Enable"
                    />
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => remove(idx)}
                        size="sm"
                        style={{ marginLeft: 'auto' }}
                        aria-label="Delete rule"
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Box>
            )}
        </Box>
    )
})

export default SortableRuleRow
