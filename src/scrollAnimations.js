const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-content')
        }
    })
});

document.addEventListener("DOMContentLoaded", e => {
    const h2s = document.querySelectorAll('.fading-content');
    h2s.forEach(el => observer.observe(el));
});