.section-container {
    margin-bottom: 50px;
}

.section-title {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

/* 기존 movie-card 스타일 그대로 재사용 */
.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}

.movie-card {
    background: #111;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.25s ease;
    cursor: pointer;
}

.movie-card:hover {
    transform: scale(1.07);
}

.movie-card img {
    width: 100%;
    display: block;
}

.movie-title {
    padding: 0.5rem 0.4rem;
    font-size: 0.95rem;
    color: #ddd;
}

.section-loading {
    color: #ccc;
    padding: 20px 0;
}
