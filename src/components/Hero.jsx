

export default function Hero({ heading, children, ctaButtons, image }) {
    return (
        <div className="hero">
            <h1>{heading}</h1>
            <h2 className="text-forge-subtext text-xl font-normal">{children}</h2>
            <img src={image} className="absolute top-0 object-cover w-full h-full brightness-50 -z-30" />
            <div className="row text-xl">
                {ctaButtons}
            </div>
        </div>
    );
}