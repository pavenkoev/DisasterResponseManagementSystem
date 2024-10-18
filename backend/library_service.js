function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function libraryService(app, dbConnection) {

    /**
     * @api {get} /library/authors Get all authors
     * @apiName GetAuthors
     * @apiGroup Library
     *
     * @apiSuccess {Object[]} authors List of authors.
     * @apiSuccess {Number} authors.id  Id of the author.
     * @apiSuccess {String} authors.name  Name of the author.
     * @apiSuccess {String} authors.biography Biography of the author.
     * @apiSuccess {Number} authors.content_index Content index of the author.
     * @apiSuccess {String} authors.birth_date Birth date of the author.
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    [
     *      {
     *          "id": 1,
     *          "name": "Isaac Asimov",
     *          "biography": "...",
     *          "content_index": 102325,
     *          "birth_date": "1920-02-02T08:00:00.000Z"
     *      }
     *    ]
     * 
     */
    app.get('/library/authors', (request, response) => {
        const sqlQuery = "SELECT * FROM authors;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /library/authors/:author_id Get author by ID
     * @apiName GetAuthorByID
     * @apiGroup Library
     *
     * @apiParam {Number} author_id Author's unique ID.
     *
     * @apiSuccess {Object[]} authors List containing requested author.
     * @apiSuccess {Number} authors.id  Id of the author.
     * @apiSuccess {String} authors.name  Name of the author.
     * @apiSuccess {String} authors.biography Biography of the author.
     * @apiSuccess {Number} authors.content_index Content index of the author.
     * @apiSuccess {String} authors.birth_date Birth date of the author.
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    [
     *      {
     *          "id": 1,
     *          "name": "Isaac Asimov",
     *          "biography": "...",
     *          "content_index": 102325,
     *          "birth_date": "1920-02-02T08:00:00.000Z"
     *      }
     *    ]
     * 
     * @apiError AuhorNotFound The specified author was not found.
     */
    app.get('/library/authors/:author_id', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = "SELECT * FROM authors WHERE id = '" + author_id + "';";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('AuthorID', author_id); // send a custom header attribute

            if (result.length === 0) {
                return response.status(404).json({Error: "Author not found."});
            }

            return response.status(200).json(result);
        });
    });

    /**
     * @api {post} /library/authors Create a new author
     * @apiName CreateAuthor
     * @apiGroup Library
     *
     * @apiBody {String} name Name of the author.
     * @apiBody {String} biography Biography of the author.
     * @apiBody {String} birth_date Birth date of the author.
     * 
     * @apiSuccess {String} Success Successful: Record was added!
     * 
     * @apiError Failed Failed: Record was not added.
     */
    app.post('/library/authors', (request, response) => {
        const sqlQuery = 'INSERT INTO authors (name, biography, content_index, birth_date) VALUES (?, ?, ?, ?);';
        const content_index = getRandomInt(0, 10000000);
        const values = [request.body.name, request.body.biography, content_index, request.body.birth_date];
        console.log(values);
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, values, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not added."});
            }
            return response.status(200).json({Success: "Successful: Record was added!"});
        });
    });

    /**
     * @api {put} /library/authors/:author_id Update an author
     * @apiName UpdateAuthor
     * @apiGroup Library
     *
     * @apiParam {Number} author_id Author's unique ID.
     * @apiBody {String} name Name of the author.
     * @apiBody {String} biography Biography of the author.
     * @apiBody {String} birth_date Birth date of the author.
     * 
     * @apiSuccess {String} Success Successful: Record was updated!
     * 
     * @apiError Failed Failed: Record was not added.
     */
    app.put('/library/authors/:author_id', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = `UPDATE authors SET name = ?, biography = ?, birth_date = ? WHERE id = ?;`;
        const values = [request.body.name, request.body.biography, request.body.birth_date];
        response.setHeader('Content-Type', 'application/json');
        console.log(sqlQuery); // for debugging purposes
        dbConnection.query(sqlQuery, [...values, author_id], (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not added."});
            }
            return response.status(200).json({Success: "Successful: Record was updated!"});
        });
    });

    /**
     * @api {delete} /library/authors/:author_id Delete an author
     * @apiName DeleteAuthor
     * @apiGroup Library
     *
     * @apiParam {Number} author_id Author's unique ID.
     * 
     * @apiSuccess {String} Success Successful: Record was deleted!
     * 
     * @apiError Failed Failed: Record was not deleted.
     */
    app.delete('/library/authors/:author_id', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = "DELETE FROM authors WHERE id = ?;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, author_id, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not deleted"});
            }
            return response.status(200).json({Success: "Successful: Record was deleted!"});
        });
    });

    /**
     * @api {get} /library/authors/:author_id/books Get all books by an author
     * @apiName GetBooksByAuthor
     * @apiGroup Library
     *
     * @apiParam {Number} author_id Author's unique ID.
     *
     * @apiSuccess {Object[]} books List of books by the author.
     * @apiSuccess {Number} books.id Id of the book.
     * @apiSuccess {String} books.title Title of the book.
     * @apiSuccess {String} books.summary Summary of the book.
     * @apiSuccess {Number} books.rating Rating of the book.
     * @apiSuccess {Number} books.content_index Content index of the book.
     * @apiSuccess {String} books.publication_date Publication date of the book.
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    [
     *      {
     *          "id": 1,
     *          "title": "Foundation",
     *          "summary": "...",
     *          "rating": 4.5,
     *          "content_index": 456789,
     *          "publication_date": "1951-06-01T08:00:00.000Z"
     *      }
     *    ]
     * 
     * @apiError BooksNotFound No books found.
     */
    app.get('/library/authors/:author_id/books', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = "SELECT books.*, authors.name AS author_name " +
            "FROM books JOIN authors ON books.author_id = authors.id WHERE books.author_id = ?;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, author_id, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('AuthorID', author_id); // send a custom header attribute

            if (result.length === 0) {
                return response.status(404).json({Error: "No books found."});
            }

            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /library/books Get all books in the library
     * @apiName GetBooks
     * @apiGroup Library
     *
     * @apiSuccess {Object[]} books List of books in the library.
     * @apiSuccess {Number} books.id Id of the book.
     * @apiSuccess {String} books.title Title of the book.
     * @apiSuccess {String} books.summary Summary of the book.
     * @apiSuccess {Number} books.rating Rating of the book.
     * @apiSuccess {Number} books.content_index Content index of the book.
     * @apiSuccess {String} books.publication_date Publication date of the book.
     * @apiSuccess {String} books.author_name Name of the author.
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    [
     *      {
     *          "id": 1,
     *          "title": "Foundation",
     *          "summary": "...",
     *          "rating": 4.5,
     *          "content_index": 456789,
     *          "publication_date": "1951-06-01T08:00:00.000Z",
     *          "author_name": "Isaac Asimov"
     *      }
     *    ]
     * 
     */
    app.get('/library/books', (request, response) => {
        // const sqlQuery = "SELECT * FROM books;";
        const sqlQuery = "SELECT books.*, authors.name AS author_name " +
            "FROM books JOIN authors ON books.author_id = authors.id;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('SQLQuery', sqlQuery); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /library/books/:book_id Get book by ID
     * @apiName GetBookByID
     * @apiGroup Library
     *
     * @apiParam {Number} book_id Book's unique ID.
     *
     * @apiSuccess {Object} book The book object.
     * @apiSuccess {Number} book.id Id of the book.
     * @apiSuccess {String} book.title Title of the book.
     * @apiSuccess {String} book.summary Summary of the book.
     * @apiSuccess {Number} book.rating Rating of the book.
     * @apiSuccess {Number} book.content_index Content index of the book.
     * @apiSuccess {String} book.publication_date Publication date of the book.
     * @apiSuccess {String} book.author_name Name of the author.
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    {
     *      "id": 1,
     *      "title": "Foundation",
     *      "summary": "...",
     *      "rating": 4.5,
     *      "content_index": 456789,
     *      "publication_date": "1951-06-01T08:00:00.000Z",
     *      "author_name": "Isaac Asimov"
     *    }
     * 
     * @apiError BookNotFound The specified book was not found.
     */
    app.get('/library/books/:book_id', (request, response) => {
        const book_id = request.params.book_id;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE books.id = '" + book_id + "';";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('BookID', book_id); // send a custom header attribute

            if (result.length === 0) {
                return response.status(404).json({Error: "Book not found."});
            }

            return response.status(200).json(result);
        });
    });

    /**
     * @api {post} /library/books Add a new book
     * @apiName AddBook
     * @apiGroup Library
     *
     * @apiBody {Number} author_id Id of the author.
     * @apiBody {String} title Title of the book.
     * @apiBody {String} summary Summary of the book.
     * @apiBody {Number} rating Rating of the book.
     * @apiBody {String} publication_date Publication date of the book.
     * 
     * @apiSuccess {String} Success Successful: Record was added!
     * 
     * @apiError Failed Failed: Record was not added.
     */
    app.post('/library/books', (request, response) => {
        const sqlQuery = 'INSERT INTO books (author_id, title, summary, rating, content_index, publication_date) VALUES (?, ?, ?, ?, ?, ?);';
        const content_index = getRandomInt(0, 10000000);
        const values = [request.body.author_id, request.body.title, 
            request.body.summary, request.body.rating, 
            content_index, request.body.publication_date];
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, values, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not added."});
            }
            return response.status(200).json({Success: "Successful: Record was added!"});
        });
    });

    /**
     * @api {put} /library/books/:book_id Update a book
     * @apiName UpdateBook
     * @apiGroup Library
     *
     * @apiParam {Number} book_id Book's unique ID.
     * @apiBody {Number} author_id Id of the author.
     * @apiBody {String} title Title of the book.
     * @apiBody {String} summary Summary of the book.
     * @apiBody {Number} rating Rating of the book.
     * @apiBody {String} publication_date Publication date of the book.
     * 
     * @apiSuccess {String} Success Successful: Record was updated!
     * 
     * @apiError Failed Failed: Record was not added.
     */
    app.put('/library/books/:book_id', (request, response) => {
        const book_id = request.params.book_id;
        const sqlQuery = `UPDATE books SET author_id = ?, title = ?, summary = ?, rating = ?, publication_date = ? WHERE id = ?;`;
        const values = [request.body.author_id, request.body.title, request.body.summary, request.body.rating, request.body.publication_date];
        response.setHeader('Content-Type', 'application/json');
        console.log(sqlQuery); // for debugging purposes
        dbConnection.query(sqlQuery, [...values, book_id], (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not added."});
            }
            return response.status(200).json({Success: "Successful: Record was updated!"});
        });
    });

    /**
     * @api {delete} /library/books/:book_id Delete a book
     * @apiName DeleteBook
     * @apiGroup Library
     *
     * @apiParam {Number} book_id Book's unique ID.
     * 
     * @apiSuccess {String} Success Successful: Record was deleted!
     * 
     * @apiError Failed Failed: Record was not deleted.
     */
    app.delete('/library/books/:book_id', (request, response) => {
        const book_id = request.params.book_id;
        const sqlQuery = "DELETE FROM books WHERE id = ?;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, book_id, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Failed: Record was not deleted"});
            }
            return response.status(200).json({Success: "Successful: Record was deleted!"});
        });
    });
}

module.exports = libraryService;