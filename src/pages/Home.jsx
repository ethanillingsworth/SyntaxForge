import Editor from "../components/Editor";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Sections from "../components/Sections";
import heroImage from "../imgs/hero-bg.png"

export default function Home() {
    return (
        <>
            <Hero heading={<>Welcome to <span className="gradient-text">SyntaxForge</span></>} ctaButtons={[<a href="/courses"><button className="bg-forge-accent">Start Learning</button></a>, <a href="/playground"><button className="bg-forge-muted">Launch Playground</button></a>]} image={heroImage}>
                Learn to code with interactive lessons, instant feedback, and a built-in editor.
            </Hero>
            <Sections>
                <Section heading="Our Mission">
                    <h3 className="text-center text-forge-subtext text-2xl font-normal">To make learning to code accessible, interactive, and fun for everyone, regardless of their background, by providing hands-on lessons and instant feedback. </h3>
                </Section>
                <Section heading="Editor Preview">
                    <Editor windowed={true}></Editor>
                </Section>
            </Sections>
        </>
    );
}