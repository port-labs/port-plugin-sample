import { useQuery } from "@tanstack/react-query";

const BLUEPRINTS_URL = 'https://api.stg-01.port.io/v1/blueprints';

async function fetchBlueprints(token: string) {
    const res = await fetch(BLUEPRINTS_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error(`Blueprints failed: ${res.status}`);
    return res.json();
}

export function useBlueprints(token: string | null) {
    return useQuery({
        queryKey: ['blueprints', token],
        queryFn: () => fetchBlueprints(token!),
        enabled: !!token,
    });
}