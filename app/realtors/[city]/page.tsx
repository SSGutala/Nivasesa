import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITIES, getCityBySlug, getCityMetaTitle, getCityMetaDescription } from '@/lib/cities';
import CityRealtorPage from '@/components/CityRealtorPage';

interface PageProps {
    params: { city: string };
}

// Generate static params for all cities
export async function generateStaticParams() {
    return CITIES.map((city) => ({
        city: city.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const city = getCityBySlug(params.city);

    if (!city) {
        return {
            title: 'City Not Found | Nivasesa',
        };
    }

    return {
        title: getCityMetaTitle(city, 'realtors'),
        description: getCityMetaDescription(city, 'realtors'),
        openGraph: {
            title: getCityMetaTitle(city, 'realtors'),
            description: getCityMetaDescription(city, 'realtors'),
            type: 'website',
        },
    };
}

export default function CityRealtorsPage({ params }: PageProps) {
    const city = getCityBySlug(params.city);

    if (!city) {
        notFound();
    }

    return <CityRealtorPage city={city} />;
}
