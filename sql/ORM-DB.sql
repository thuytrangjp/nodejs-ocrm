CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(1000) NOT NULL,
    name VARCHAR(100),
    age INT,
    profile_picture VARCHAR(1000),
    created_at DATETIME,
	updated_at DATETIME,
	deleted_at DATETIME
);

CREATE TABLE images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    image_name VARCHAR(100) NOT NULL,
    link VARCHAR(1000) NOT NULL,
    description VARCHAR(225) NOT NULL,
    created_at DATETIME,
	updated_at DATETIME,
	deleted_at DATETIME,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_date DATETIME,
    comment_content VARCHAR(225),
    user_id INT,
	image_id INT,
    created_at DATETIME,
	updated_at DATETIME,
	deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (image_id) REFERENCES images(image_id)
);

CREATE TABLE save_images (
    save_image_day DATETIME,
    user_id INT,
    image_id INT,
    created_at DATETIME,
	updated_at DATETIME,
	deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (image_id) REFERENCES images(image_id)
);

-- Chèn dữ liệu vào bảng users
INSERT INTO users (email, password, name, age, profile_picture)
VALUES 
    ('user1@example.com', 'password1', 'User 1', 25, 'profile1.jpg'),
    ('user2@example.com', 'password2', 'User 2', 30, 'profile2.jpg'),
    ('user3@example.com', 'password3', 'User 3', 28, 'profile3.jpg');

-- Chèn dữ liệu vào bảng images
INSERT INTO images (image_name, link, description, user_id)
VALUES 
    ('image1', 'link1.jpg', 'Description for image 1', 1),
    ('image2', 'link2.jpg', 'Description for image 2', 2),
    ('image3', 'link3.jpg', 'Description for image 3', 3);

-- Chèn dữ liệu vào bảng comments
INSERT INTO comments (comment_date, comment_content, user_id, image_id)
VALUES 
    ('2024-04-30', 'Comment 1 for image 1', 2, 1),
    ('2024-04-30', 'Comment 2 for image 1', 3, 1),
    ('2024-04-30', 'Comment 1 for image 2', 1, 2);

-- Chèn dữ liệu vào bảng save_images
INSERT INTO save_images (save_image_day, user_id, image_id)
VALUES 
    ('2024-04-30', 1, 2),
    ('2024-05-01', 2, 3),
    ('2024-05-02', 3, 1);
