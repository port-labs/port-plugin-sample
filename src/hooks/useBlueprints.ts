import { useQuery } from "@tanstack/react-query";

const BLUEPRINTS_URL = `${process.env.BASE_URL}/v1/blueprints`;

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
        refetchInterval: 1000 * 60 * 5,
    });
}