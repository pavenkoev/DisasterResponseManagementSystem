function recommendationService(app, dbConnection) {
    /**
     * @api {get} /recommendations Get book recommendations
     * @apiName GetRecommendations
     * @apiDescription This will return a basic list of recommendations with a rating of 4 or higher.
     * @apiGroup Recommendation
     *
     * @apiSuccess {Object[]} books List of recommended books.
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
    app.get('/recommendations', (request, response) => {
        const sqlQuery = "SELECT books.*, authors.name AS author_name " +
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE books.rating >= 4 LIMIT 10;";
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
     * @api {get} /recommendations/recent Get recent book recommendations
     * @apiName GetRecentRecommendations
     * @apiDescription This will return a list of recommendations with a rating of 4 or higher sorted by publication date.
     * @apiGroup Recommendation
     *
     * @apiSuccess {Object[]} books List of recent recommended books.
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
    app.get('/recommendations/recent', (request, response) => {
        const sqlQuery = "SELECT books.*, authors.name AS author_name " +
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE books.rating >= 4 ORDER BY publication_date DESC LIMIT 10;";
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
     * @api {get} /recommendations/rating/:rating Get book recommendations by rating
     * @apiName GetRecommendationsByRating
     * @apiGroup Recommendation
     *
     * @apiParam {Number} rating Minimum rating of the books.
     *
     * @apiSuccess {Object[]} books List of recommended books.
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
    app.get('/recommendations/rating/:rating', (request, response) => {
        const rating = request.params.rating;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE books.rating >= " + rating + ";";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('Rating', rating); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /recommendations/year/:year Get book recommendations by publication year
     * @apiName GetRecommendationsByYear
     * @apiGroup Recommendation
     *
     * @apiParam {Number} year Publication year of the books.
     *
     * @apiSuccess {Object[]} books List of recommended books.
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
    app.get('/recommendations/year/:year', (request, response) => {
        const year = request.params.year;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE YEAR(books.publication_date) = ?;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, [year], (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('Year', year); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /recommendations/author/:author_id Get book recommendations by author
     * @apiName GetRecommendationsByAuthor
     * @apiGroup Recommendation
     *
     * @apiParam {Number} author_id Author's unique ID.
     *
     * @apiSuccess {Object[]} books List of recommended books by the author.
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
    app.get('/recommendations/author/:author_id', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id " + 
            "WHERE authors.id = " + author_id + " AND books.rating >= 4;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('AuthorId', author_id); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

    /**
     * @api {get} /recommendations/similar/author/:author_id Get book recommendations similar to an author's works
     * @apiName GetSimilarBooksByAuthor
     * @apiGroup Recommendation
     *
     * @apiParam {Number} author_id Author's unique ID.
     *
     * @apiSuccess {Object[]} books List of similar books.
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
    app.get('/recommendations/similar/author/:author_id', (request, response) => {
        const author_id = request.params.author_id;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id WHERE authors.id != ? " + 
            "ORDER BY ABS(books.content_index - (SELECT content_index FROM authors WHERE id = ?)) LIMIT 10;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, [author_id, author_id], (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('AuthorId', author_id); // send a custom header attribute
            return response.status(200).json(result);
        });
    });

     /**
     * @api {get} /recommendations/similar/book/:book_id Get book recommendations similar to a book
     * @apiName GetSimilarBooksByBook
     * @apiGroup Recommendation
     *
     * @apiParam {Number} book_id Book's unique ID.
     *
     * @apiSuccess {Object[]} books List of similar books.
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
     * @apiError NoSimilarBooksFound No similar books found.
     */
    app.get('/recommendations/similar/book/:book_id', (request, response) => {
        const book_id = request.params.book_id;
        const sqlQuery = "SELECT books.*, authors.name as author_name " + 
            "FROM books JOIN authors ON books.author_id = authors.id WHERE books.id != ?" + 
            "AND EXISTS (SELECT 1 FROM books WHERE books.id = ?) " +
            "ORDER BY ABS(books.content_index - (SELECT content_index FROM books WHERE id = ?)) " +
            "LIMIT 10;";
        response.setHeader('Content-Type', 'application/json');
        dbConnection.query(sqlQuery, [book_id, book_id, book_id], (err, result) => {
            if (err) {
                return response.status(400).json({Error: "Error in the SQL statement. Please check."});
            }
            response.setHeader('BookId', book_id); // send a custom header attribute

            if (result.length === 0) {
                return response.status(404).json({Error: "No similar books found."});
            }

            return response.status(200).json(result);
        });
    });
}

module.exports = recommendationService;