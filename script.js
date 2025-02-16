document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
        fetch(`YOUR_API_ENDPOINT?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';
                if (data.results && data.results.length > 0) {
                    data.results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.innerHTML = `<h3><a href="${result.url}">${result.title}</a></h3><p>${result.description}</p>`;
                        resultsDiv.appendChild(resultItem);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    }
});

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '';

                if (data.query && data.query.search.length > 0) {
                    data.query.search.forEach(result => {
                        const title = result.title;
                        const pageId = result.pageid;

                        const resultItem = document.createElement('div');
                        resultItem.classList.add('search-result');
                        resultItem.innerHTML = `
                            <h3 class="wiki-title" data-title="${title}">${title}</h3>
                            <hr>
                        `;
                        resultsDiv.appendChild(resultItem);
                    });

                    // Add event listeners to load Wikipedia content
                    document.querySelectorAll('.wiki-title').forEach(item => {
                        item.addEventListener('click', function () {
                            const title = this.getAttribute('data-title');
                            loadWikipediaPage(title);
                        });
                    });

                } else {
                    resultsDiv.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => console.error('Error fetching search results:', error));
    }
});

// Function to Load Full Wikipedia Page Content with Images
function loadWikipediaPage(title) {
    const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&explaintext&exsectionformat=wiki&piprop=original&titles=${encodeURIComponent(title)}&format=json&origin=*`;

    fetch(pageUrl)
        .then(response => response.json())
        .then(data => {
            const page = Object.values(data.query.pages)[0];
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = `
                <h2>${page.title}</h2>
                ${page.original ? `<img src="${page.original.source}" alt="${page.title}" class="wiki-image">` : ''}
                <div class="wiki-content">${page.extract.replace(/\n/g, '<br><br>')}</div>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}" target="_blank">Read More on Wikipedia</a>
            `;
        })
        .catch(error => console.error('Error fetching Wikipedia page:', error));
}
