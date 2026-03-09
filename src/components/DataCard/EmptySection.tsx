export const EmptySection = ({ title, icon, emptyMessage }: { title: string; icon?: string, emptyMessage?: string }) => {
    const message = emptyMessage || 'No data received yet';
    return (
        <section className="data-card">
            <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
            <p className="data-card__empty">{message}</p>
        </section>
    );
};