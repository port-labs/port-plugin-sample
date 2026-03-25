import { useEffect, useState } from "react";

export type Page = {
    identifier: string;
    pageFilters?: Record<string, unknown>[];
}

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    roles: { name: string; orgId: string }[];
    teams: { name: string; orgId: string }[];
    type: string;
    picture: string;
    status: string;
    providers: [];
    companyId: string;
    companyRole: string;
}

export type Entity = {
    identifier: string;
    title: string;
    icon: string
    team: string
    properties: Record<string, unknown>;
    relations: Record<string, unknown>;
}



export type Params = {
    [key: string]: {
        type: string;
        value: unknown;
    };
}

export const usePostMessageData = () => {
    const [params, setParams] = useState<Params>({});
    const [page, setPage] = useState<Page>();
    const [user, setUser] = useState<User>();
    const [entity, setEntity] = useState<Entity>();
    const [portToken, setPortToken] = useState<string | null>(null);
    const [portApiBaseUrl, setPortApiBaseUrl] = useState<string | null>(null);

    useEffect(() => {
        // Tell host we're ready so it can send PORT_TOKEN (avoids missing it due to React Strict Mode double-mount)
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'REQUEST_PORT_TOKEN' }, '*');
        }

        const handler = (event: MessageEvent) => {
            // get jwt token for api requests
            if (event.data?.type === 'PORT_TOKEN') {
                setPortToken(event.data.token ?? null)
            };

            // get plugin data from host (params, page, user, entity)
            if (event.data?.type === 'PLUGIN_DATA') {
                setParams(event.data.params ?? {});
                setPage(event.data.page ?? {});
                setUser(event.data.user ?? {})
                setEntity(event.data.entity ?? {})
                setPortApiBaseUrl(event.data.baseUrl ?? null)
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    return { params, page, user, entity, portToken, portApiBaseUrl };
};