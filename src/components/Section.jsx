

export default function Section({ heading, className, children }) {
    return (
        <section className={className}>
            {heading ? <h2>{heading}</h2> : null}
            {children}
        </section>
    );
}