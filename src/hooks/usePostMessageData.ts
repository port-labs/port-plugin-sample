import { useEffect, useState } from "react";

export const usePostMessageData = () => {
    const [params, setParams] = useState<Record<string, unknown>>({});
    const [page, setPage] = useState<Record<string, unknown>>({});
    const [user, setUser] = useState<Record<string, unknown>>({});
    const [entity, setEntity] = useState<Record<string, unknown>>({});
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