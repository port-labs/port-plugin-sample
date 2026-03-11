import { ErrorSectionProps } from "../../types";

export const ErrorSection = ({ title, icon, errorMessage }: ErrorSectionProps) => {
    const message = errorMessage || 'An error occurred';

    return (
        <section className="data-card">
            <h2 className="data-card__title">{icon && <span className="data-card__icon">{icon}</span>}{title}</h2>
            <p className="data-card__error">{message}</p>
        </section>
    );
};