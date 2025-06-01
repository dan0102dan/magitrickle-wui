import {
    Container,
    Title,
    Text,
    Flex,
    Button,
    Center,
    Badge,
    Group,
    SimpleGrid,
    Card,
} from '@mantine/core'
import {
    IconArrowRight,
    IconBrandTelegram,
    IconBrandGithub,
    IconServer,
    IconRoute,
    IconFilter,
    IconFileCode,
    IconHierarchy,
    IconToggleRight
} from '@tabler/icons-react'
import { NetworkBackground } from '../components'
import { useLang } from '../contexts'

const About: React.FC = () => {
    const { t } = useLang()

    return (
        <>
            <Flex
                direction="column"
                // вычитаем размер Header'а
                style={{ minHeight: 'calc(100vh - 60px)' }}
            >
                <Container py="xl" flex={1}>
                    <Center mb="md">
                        <Title ta='center'>
                            {t('pages.About.project') + ' '}
                            «<Text component="span" c="blue" inherit>
                                MagiTrickle
                            </Text>
                            »
                        </Title>
                    </Center>

                    <Center mb="xl">
                        <Container size={600} p={0}>
                            <Text size="lg" c="dimmed">
                                {t('pages.About.description')}
                            </Text>
                        </Container>
                    </Center>

                    <Flex justify="center" align="center" wrap="wrap" gap="md">
                        <Button
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'blue', deg: 247 }}
                            leftSection={<IconBrandTelegram size={20} />}
                            rightSection={<IconArrowRight size={14} />}
                            component="a"
                            href="https://t.me/MagiTrickleChat"
                            target="_blank"
                            size='md'
                        >
                            {t('pages.About.tgChat')}
                        </Button>

                        <Button
                            variant="gradient"
                            gradient={{ from: 'violet', to: 'grape', deg: 247 }}
                            leftSection={<IconBrandGithub size={20} />}
                            rightSection={<IconArrowRight size={14} />}
                            component="a"
                            href="https://github.com/MagiTrickle/MagiTrickle"
                            target="_blank"
                            size='md'
                        >
                            {t('pages.About.githubRepo')}
                        </Button>
                    </Flex>
                </Container>

                <Group justify="center" py="md">
                    <Badge variant="filled" size="lg">
                        {t('pages.About.slogan')}
                    </Badge>
                </Group>
            </Flex>

            <Container size="lg" pb="xl">
                <Title order={2} ta="center" mt="sm">
                    {t('pages.About.whyUs')}
                </Title>

                <Text c="dimmed" ta="center" mt="md">
                    {t('pages.About.whyUsDescription')}
                </Text>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
                    {[
                        {
                            title: t('pages.About.noDnsOverride.title'),
                            description: t('pages.About.noDnsOverride.description'),
                            icon: IconServer,
                        },
                        {
                            title: t('pages.About.universalTunnelSupport.title'),
                            description: t('pages.About.universalTunnelSupport.description'),
                            icon: IconRoute,
                        },
                        {
                            title: t('pages.About.adaptiveFiltering.title'),
                            description: t('pages.About.adaptiveFiltering.description'),
                            icon: IconFilter,
                        },
                        {
                            title: t('pages.About.unifiedConfiguration.title'),
                            description: t('pages.About.unifiedConfiguration.description'),
                            icon: IconFileCode,
                        },
                        {
                            title: t('pages.About.networkSegmentation.title'),
                            description: t('pages.About.networkSegmentation.description'),
                            icon: IconHierarchy,
                        },
                        {
                            title: t('pages.About.instantActivation.title'),
                            description: t('pages.About.instantActivation.description'),
                            icon: IconToggleRight
                        },
                    ].map((feature) => (
                        <Card key={feature.title} shadow="md" radius="md" padding="xl">
                            <feature.icon color="var(--mantine-color-blue-filled)" size={50} stroke={2} />
                            <Text fz="lg" fw={500} mt="md">
                                {feature.title}
                            </Text>
                            <Text fz="sm" c="dimmed" mt="sm">
                                {feature.description}
                            </Text>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
            {/* Фоновый компонент */}
            <NetworkBackground
                numberOfNodes={30}
                lineDistance={140}
                baseDotSize={3}
                sizeGrowthFactor={0.25}
                animationSpeed={0.8}
                fpsLimit={60}
                enableClickToAdd
                maxParticles={60}
            />
        </>
    )
}

export default About