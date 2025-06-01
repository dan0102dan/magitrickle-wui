import {
    IconInfoSquareRounded,
    IconFileText,
    // IconCloudDataConnection,
    IconError404,
    // IconDeviceDesktopAnalytics
} from '@tabler/icons-react'
import About from './pages/About'
// import Tunnel from './pages/Tunnel'
import GroupList from './pages/GroupList'
// import SystemStatus from './pages/SystemStatus'
import NotFound from './pages/NotFound'

export interface Route {
    path: string
    label: string
    icon: React.ElementType
    element: React.ReactNode
    hidden?: boolean
}

export const routes: Route[] = [
    {
        path: '*',
        label: 'NotFound',
        icon: IconError404,
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
        path: '/about',
        label: 'About',
        icon: IconInfoSquareRounded,
        element: <About />,
    }
]
