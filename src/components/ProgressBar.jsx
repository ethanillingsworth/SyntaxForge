export default function ProgressBar({ value = 0, accentColor }) {
    return (
        <div className="progressbar">
            <div
                className="progress"
                style={{
                    backgroundColor: accentColor,
                    width: `${value}%`,
                }}
            ></div>
            <span>{value}%</span>
        </div>
    );
}
