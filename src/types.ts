export interface DataCardProps {
    title: string;
    icon?: string;
    children: React.ReactNode
}

export interface EmptySectionProps {
    title: string;
    icon?: string;
    emptyMessage?: string
}

export interface ErrorSectionProps {
    title: string;
    icon?: string;
    errorMessage?: string
}

export interface PluginDataCardProps {
    title: string;
    data: Record<string, unknown>; icon?: string
}