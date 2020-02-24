DROP DATABASE IF EXISTS nc_news_test;
DROP DATABASE IF EXISTS nc_news;

CREATE DATABASE nc_news_test;
CREATE DATABASE nc_news;

-- CREATE TABLE topics (
--   slug VARCHAR PRIMARY KEY,
--   description VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE users (
--   username VARCHAR PRIMARY KEY,
--   avatar_url VARCHAR(255) NOT NULL, --Should other constraints?
--   name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE articles (
--   article_id INT PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   body VARCHAR(255) NOT NULL,
--   votes INT DEFAULT 0,
--   topic VARCHAR(255) REFERENCES topics(slug) NOT NULL,
--   author VARCHAR(255) REFERENCES users(username) NOT NULL,
--   created_at INT DEFAULT Date.now() --And then will be manipulated.);

-- CREATE TABLE comments (
--   comment_id INT PRIMARY KEY,
--   author VARCHAR(255) REFERENCES users(username) NOT NULL,
--   article_id INT REFERENCES articles(article_id) NOT NULL,
--   votes INT DEFAULT 0,
--   created_at INT DEFAULT Date.now(), --And then will be manipulated..
--   body VARCHAR(255) NOT NULL
-- );