SELECT * FROM _user;

SELECT * FROM role;

SELECT * FROM token;

SELECT * FROM _user_roles;

UPDATE _user SET enabled = true WHERE id = 1;

SELECT * FROM book book WHERE book.id = 3;

UPDATE book SET shareable = true;

SELECT * FROM book_transaction_history bth;

SELECT * FROM feedback;