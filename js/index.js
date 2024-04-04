document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel');
    const showPanel = document.getElementById('show-panel');

    // Function to fetch and render list of books
    function fetchAndRenderBooks() {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(books => {
                books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book.title;
                    li.addEventListener('click', () => showBookDetails(book));
                    listPanel.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }

    // Function to display book details when clicked
    function showBookDetails(book) {
        const detailsHTML = `
            <h2>${book.title}</h2>
            <img src="${book.thumbnail}" alt="${book.title}">
            <p>${book.description}</p>
            <h3>Liked By:</h3>
            <ul id="liked-users">
                ${book.users.map(user => `<li>${user.username}</li>`).join('')}
            </ul>
            <button id="like-btn">${book.users.some(user => user.id === 1) ? 'Unlike' : 'Like'}</button>
        `;
        showPanel.innerHTML = detailsHTML;

        // Event listener for like button
        const likeBtn = document.getElementById('like-btn');
        likeBtn.addEventListener('click', () => toggleLike(book));
    }

    // Function to toggle like/unlike
    function toggleLike(book) {
        const currentUser = { id: 1, username: "pouros" };
        const likedUsers = book.users;
        const likeBtn = document.getElementById('like-btn');

        // Check if current user has already liked the book
        const likedIndex = likedUsers.findIndex(user => user.id === currentUser.id);

        if (likedIndex !== -1) {
            // Remove user from liked list
            likedUsers.splice(likedIndex, 1);
            likeBtn.textContent = 'Like'; // Change button text to 'Like'
        } else {
            // Add user to liked list
            likedUsers.push(currentUser);
            likeBtn.textContent = 'Unlike'; // Change button text to 'Unlike'
        }

        // Update liked users list in DOM
        const likedUsersList = document.getElementById('liked-users');
        likedUsersList.innerHTML = likedUsers.map(user => `<li>${user.username}</li>`).join('');

        // Send PATCH request to update liked users list
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ users: likedUsers })
        })
        .then(response => response.json())
        .then(updatedBook => console.log('Updated book:', updatedBook))
        .catch(error => {
            console.error('Error updating liked users:', error);
        });
    }

    // Initial rendering of books
    fetchAndRenderBooks();
});
