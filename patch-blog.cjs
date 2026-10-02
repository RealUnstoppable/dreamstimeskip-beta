const fs = require('fs');
let html = fs.readFileSync('blog.html', 'utf8');

const newPost = `
            <article class="blog-post-card">
                <img src="/images/un-logo-1.png" alt="Founder" class="blog-post-image" style="object-fit: contain; background: var(--secondary-card-color);" loading="lazy">
                <div class="blog-post-content">
                    <div class="post-meta">
                        <span>Ongoing</span> &bull; <span>About Me</span>
                    </div>
                    <h3>The Founder: About Me</h3>
                    <p>Learn more about the creator behind the Unstoppable ecosystem, Dreams TimeSkip, and Medixly, including their portfolio, projects, and future vision.</p>
                    <a href="portfolio.html" class="read-more-btn">View Portfolio</a>
                </div>
            </article>`;

html = html.replace('<section class="blog-grid">', '<section class="blog-grid">' + newPost);
fs.writeFileSync('blog.html', html, 'utf8');
