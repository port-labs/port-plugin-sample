export const DataCard = ({ title, icon, children }: { title: string; icon?: string, children: React.ReactNode }) => {
    return (
        <section className="data-card">
            <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
            <dl className="data-list">
                {children}
            </dl>
        </section>
    );
}