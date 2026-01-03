import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Event } from './types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'My - Events',
        href: '#',
    },
];

interface Props {
    events: Event;
}

const Index = ({ events }: Props) => {
    
    return (
        <>
            <Head title="My events" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div>Index</div>
            </AppLayout>
        </>
    );
};

export default Index;
