import axios from 'axios'
import type { Group, Interface } from './types'

export const apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? '/api/v1'
        : 'http://192.168.1.1:8080/api/v1',
    withCredentials: false
})

export const getGroups = async (): Promise<Group[]> => (
    (await apiClient.get('/groups', { params: { with_rules: true } })).data.groups
)

export const saveGroups = async (groups: Group[]): Promise<Group[]> => (
    (await apiClient.put('/groups', groups, { params: { save: true } })).data
)

export const getInterfaces = async (): Promise<Interface[]> => (
    (await apiClient.get('/system/interfaces')).data.interfaces
)