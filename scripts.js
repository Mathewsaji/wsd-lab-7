let books = [];
let currentPage = 1;
const booksPerPage = 2;

function fetchBooks() {
    fetch('books.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            books = data.books;
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
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(event.target.value.toLowerCase()));
    displayBooks(filteredBooks);
});

document.getElementById('sort').addEventListener('change', event => {
    const sortBy = event.target.value;
    books.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    displayBooks(books);
});

document.getElementById('filter').addEventListener('change', event => {
    const genre = event.target.value;
    const filteredBooks = genre ? books.filter(book => book.genre === genre) : books;
    displayBooks(filteredBooks);
    setupPagination(filteredBooks.length);
});

// Fetch books on page load
fetchBooks();
