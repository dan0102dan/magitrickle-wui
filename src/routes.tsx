import {
    IconInfoSquareRounded,
    IconFileText,
    // IconCloudDataConnection,
    // IconDeviceDesktopAnalytics
} from '@tabler/icons-react'
import { Navigate } from 'react-router-dom'
import About from './pages/About'
// import Tunnel from './pages/Tunnel'
import GroupList from './pages/GroupList'
// import SystemStatus from './pages/SystemStatus'
import NotFound from './pages/NotFound'

export interface Route {
    path: string
    label?: string
    icon?: React.ElementType
    element: React.ReactNode
    hidden?: boolean
}

export const routes: Route[] = [
    {
        path: '/',
        element: <Navigate to="/groupList" replace />,
        hidden: true
    },
    {
        path: '*',
        element: <NotFound />,
        hidden: true,
    },
    {
        path: 'groupList',
        label: 'GroupList',
        icon: IconFileText,
        element: <GroupList />,
    },
    // {
    //     path: 'tunnel',
    //     label: 'Tunnel',
    //     icon: IconCloudDataConnection,
    //     element: <Tunnel />,
    // },
    // {
    //     path: 'systemStatus',
    //     label: 'SystemStatus',
    //     icon: IconDeviceDesktopAnalytics,
    //     element: <SystemStatus />,
    // },
    {
        path: 'about',
        label: 'About',
        icon: IconInfoSquareRounded,
        element: <About />,
    }
]
