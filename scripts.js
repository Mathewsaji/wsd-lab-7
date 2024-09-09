let books = [];
let currentPage = 1;
const booksPerPage = 5; // Increase per page since the API returns more data

function fetchBooks(query = 'fiction') {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            books = data.items.map(item => ({
                title: item.volumeInfo.title || 'No Title',
                author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
                date: item.volumeInfo.publishedDate || 'Unknown Date',
                genre: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : 'Unknown Genre',
                cover: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'
            }));
            displayBooks(books);
            setupPagination(books.length);
        })
        .catch(error => {
            document.getElementById('error-message').innerText = 'Failed to load books. Please try again.';
            document.getElementById('error-message').style.display = 'block';
            console.error('Error fetching books:', error);
        });
}

function displayBooks(booksToDisplay) {
    const bookContainer = document.getElementById('book-container');
    bookContainer.innerHTML = '';
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    booksToDisplay.slice(start, end).forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p><strong>Published:</strong> ${book.date}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
        `;
        bookContainer.appendChild(bookDiv);
    });
}

function setupPagination(totalBooks) {
    const paginationControls = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    paginationControls.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks(books);
        });
        paginationControls.appendChild(pageButton);
    }
}

document.getElementById('search').addEventListener('input', event => {
    fetchBooks(event.target.value);
});

document.getElementById('sort').addEventListener('change', event => {
    const sortBy = event.target.value;
    books.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    displayBooks(books);
});

document.getElementById('filter').addEventListener('change', event => {
    const genre = event.target.value;
    const filteredBooks = genre ? books.filter(book => book.genre.includes(genre)) : books;
    displayBooks(filteredBooks);
    setupPagination(filteredBooks.length);
});

// Fetch books on page load with a default query
fetchBooks();
