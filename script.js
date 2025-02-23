document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const loadingDiv = document.getElementById('loading');

    // Function to load content dynamically
    function loadPage(pageName, updateUrl = true) {
        // Show the loading spinner
        loadingDiv.style.display = 'block';

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // Hide the loading spinner
                loadingDiv.style.display = 'none';

                if (xhr.status === 200) {
                    // Successfully loaded the page
                    contentDiv.innerHTML = xhr.responseText;

                    // Fade-in effect for the new content
                    contentDiv.style.opacity = 0;
                    setTimeout(() => {
                        contentDiv.style.opacity = 1;
                    }, 50);

                    // Update the URL in the browser's address bar
                    if (updateUrl) {
                        history.pushState({ page: pageName }, null, `#${pageName}`);
                    }
                } else {
                    // Handle errors (e.g., page not found or network issues)
                    contentDiv.innerHTML = `<h1>Error</h1><p>Failed to load the page. Please try again later.</p>`;
                }
            }
        };

        xhr.open('GET', `${pageName}.html`, true);
        xhr.send();
    }

    // Event listener for sidebar links
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const page = this.getAttribute('data-page');

            // Remove the 'active' class from all links
            document.querySelectorAll('.sidebar ul li a').forEach(a => a.classList.remove('active'));

            // Add the 'active' class to the clicked link
            this.classList.add('active');

            // Load the requested page and update the URL
            loadPage(page);
        });
    });

    // Handle back/forward navigation using the History API
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            // Load the page corresponding to the current URL hash
            loadPage(event.state.page, false); // Don't update the URL again
        }
    });

    // Load the initial page based on the URL hash
    const initialPage = window.location.hash.substring(1) || 'home';
    loadPage(initialPage);
});