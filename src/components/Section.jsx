

export default function Section({ heading, children }) {
    return (
        <section>
            {heading ? <h2>{heading}</h2> : null}
            {children}
        </section>
    );
}