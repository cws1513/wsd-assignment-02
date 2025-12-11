import "./HeroBanner.css";

export default function HeroBanner({
                                       movie,
                                       trailerKey
                                   }: {
    movie: any;
    trailerKey: string | null;
}) {
    const youtubeUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`
        : null;

    return (
        <section className="hero-banner">
            {youtubeUrl && (
                <iframe
                    className="hero-video"
                    src={youtubeUrl}
                    title={movie?.title}
                    allow="autoplay; encrypted-media"
                />
            )}

            <div className="hero-overlay"></div>

            {/* 배너 텍스트 */}
            <div className="hero-content">
                <span className="hero-label">새로운 미리보기</span>
                <h1 className="hero-title">{movie?.title}</h1>
                <p className="hero-tagline">{movie?.overview}</p>

                <div className="hero-buttons">
                    <button className="hero-btn hero-btn-play">▶ 재생</button>
                    <button className="hero-btn hero-btn-info">자세히 보기</button>
                </div>
            </div>
        </section>
    );
}
