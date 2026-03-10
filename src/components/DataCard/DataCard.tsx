import { DataCardProps } from "../../types";

export const DataCard = ({ title, icon, children }: DataCardProps) => {
    return (
        <section className="data-card">
            <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
            <dl className="data-list">
                {children}
            </dl>
        </section>
    );
}