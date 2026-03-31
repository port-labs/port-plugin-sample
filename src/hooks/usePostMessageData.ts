import { useEffect, useState } from "react";

export type Page = {
    identifier: string;
    pageFilters?: Record<string, any>[];
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
    properties: Record<string, any>;
    relations: Record<string, any>;
}

export type Theme = {
    mode: string;
    css: string;
} | null;



export type Params = {
    [key: string]: {
        type: string;
        value: any;
    };
}

export const usePostMessageData = () => {
    const [params, setParams] = useState<Params>({});
    const [page, setPage] = useState<Page>();
    const [user, setUser] = useState<User>();
    const [entity, setEntity] = useState<Entity>();
    const [theme, setTheme] = useState<Theme>(null);
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

            // get plugin data from host (params, page, user, entity, theme)
            if (event.data?.type === 'PLUGIN_DATA') {
                setParams(event.data.params ?? {});
                setPage(event.data.page ?? {});
                setUser(event.data.user ?? {})
                setEntity(event.data.entity ?? {})
                setTheme(event.data.theme ?? null)
                setPortApiBaseUrl(event.data.baseUrl ?? null)
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const applyThemeCss = () => {
        if (typeof document === "undefined") return;
        if (!theme?.css) return;

        const styleId = "port-plugin-theme";
        let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = theme.css;
    };

    return { params, page, user, entity, theme, portToken, portApiBaseUrl, applyThemeCss };
};