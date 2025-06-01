SET FOREIGN_KEY_CHECKS=0;

-- DROP IF EXISTS (Optional for reset)
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS SwapMatch;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS SupportTicket;
DROP TABLE IF EXISTS Plant;
DROP TABLE IF EXISTS UserFollows;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS SavedPlant;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS PointExchangeHistory;

SET FOREIGN_KEY_CHECKS=1;

-- ============================
-- TABEL: User
-- ============================
CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    location VARCHAR(100),
    poin INT DEFAULT 0,
    bio TEXT,
    profile_image LONGTEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    join_date DATE DEFAULT CURRENT_DATE
);

-- ============================
-- TABEL: UserFollows
-- ============================
CREATE TABLE UserFollows (
    follow_id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT,
    following_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: Plant
-- ============================
CREATE TABLE Plant (
    plant_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(100),
    category VARCHAR(50),
    age INT,
    plant_condition TEXT,
    description TEXT,
    image_url LONGTEXT,
    willing_to_exchange_for TEXT,
    location VARCHAR(100),
    status VARCHAR(50),
    price_estimation DECIMAL(10,2),
    is_point_exchange BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: Review
-- ============================
CREATE TABLE Review (
    UniqueID INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    comment TEXT,
    created_at DATETIME,
    rating INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES Plant(plant_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: SupportTicket
-- ============================
CREATE TABLE SupportTicket (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: SwapMatch
-- ============================
CREATE TABLE SwapMatch (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    plant_id_1 INT,
    plant_id_2 INT,
    status VARCHAR(50),
    matched_at DATETIME,
    completed_at DATETIME,
    user1_confirmed BOOLEAN DEFAULT FALSE,
    user2_confirmed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (plant_id_1) REFERENCES Plant(plant_id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id_2) REFERENCES Plant(plant_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: Message
-- ============================
CREATE TABLE Message (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT,
    recipient_id INT,
    plant_id INT,
    message TEXT,
    created_at DATETIME,
    FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES Plant(plant_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: SavedPlant
-- ============================
CREATE TABLE SavedPlant (
    saved_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES Plant(plant_id) ON DELETE CASCADE,
    UNIQUE KEY unique_save (user_id, plant_id)
);

-- ============================
-- TABEL: Notification
-- ============================
CREATE TABLE Notification (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    message TEXT,
    from_user_id INT,
    to_user_id INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ============================
-- TABEL: PointExchangeHistory
-- ============================
CREATE TABLE PointExchangeHistory (
    exchange_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    points_spent INT,
    exchanged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id) REFERENCES Plant(plant_id) ON DELETE CASCADE
);

-- ============================
-- DUMMY DATA
-- ============================

-- Insert admin user first (before any plant data)
INSERT INTO User (name, email, password_hash, location, poin, bio, role, join_date)
VALUES 
('Admin AgroCycle', 'admin@agrocycle.com', 'hashedpass_admin', 'Banda Aceh', 0, 'Admin AgroCycle - Pengelola sistem tukar poin', 'admin', '2023-01-01');

-- Get admin user_id
SET @admin_id = LAST_INSERT_ID();

-- Insert plants for point exchange (using existing plant data but owned by admin)
INSERT INTO Plant (user_id, name, category, age, plant_condition, description, image_url, location, status, price_estimation, is_point_exchange)
VALUES
(@admin_id, 'Monstera Deliciosa Variegata', 'Tanaman Hias', 3, 'Sehat', 
'Monstera Deliciosa dengan variegasi putih yang langka dan indah', '/swap_product/monstera.jpg', 
'Banda Aceh', 'available', 80000, true),

(@admin_id, 'Alocasia Dragon Scale Premium', 'Tanaman Hias', 2, 'Sehat', 
'Alocasia dengan tekstur daun seperti sisik naga berkualitas premium', '/swap_product/alocasia.jpeg', 
'Banda Aceh', 'available', 120000, true),

(@admin_id, 'Philodendron Pink Princess', 'Tanaman Hias', 2, 'Subur', 
'Philodendron dengan variegasi merah muda yang sangat diminati', '/swap_product/philodendron brasil.jpeg', 
'Banda Aceh', 'available', 75000, true),

(@admin_id, 'Durian Musang King', 'Tanaman Buah', 36, 'Sehat', 
'Bibit durian Musang King asli dengan kualitas terbaik', '/swap_product/durian.jpg', 
'Banda Aceh', 'available', 30000, true);

-- USERS
INSERT INTO User (name, email, password_hash, location, poin, bio, join_date)
VALUES 
('Andika', 'andika@example.com', 'hashedpass1', 'Banda Aceh', 100, 'Urban farmer passionate about sustainable agriculture', '2023-01-15'),
('Sari', 'sari@example.com', 'hashedpass2', 'Langsa', 80, 'Plant enthusiast and community garden organizer', '2023-02-20'),
('Raka', 'raka@example.com', 'hashedpass3', 'Lhokseumawe', 120, 'Experienced in hydroponics and organic farming', '2023-03-10'),
('Maya', 'maya@example.com', 'hashedpass4', 'Banda Aceh', 90, 'Passionate about medicinal herbs and traditional plants', '2023-04-05'),
('Budi', 'budi@example.com', 'hashedpass5', 'Sabang', 150, 'Collector of rare indoor plants', '2023-03-15'),
('Diana', 'diana@example.com', 'hashedpass6', 'Meulaboh', 110, 'Specializing in ornamental flowers and succulents', '2023-02-28'),
('Fajar', 'fajar@example.com', 'hashedpass7', 'Sigli', 95, 'Growing edible plants and herbs for sustainable living', '2023-04-10'),
('Gita', 'gita@example.com', 'hashedpass8', 'Banda Aceh', 130, 'Expert in tropical fruit trees and grafting', '2023-01-30');

-- USER FOLLOWS
INSERT INTO UserFollows (follower_id, following_id)
VALUES
(1, 2), (1, 3), (2, 1), (3, 1), (2, 3),
(4, 1), (4, 2), (5, 4), (6, 4), (7, 5),
(8, 6), (8, 7), (1, 8), (2, 8), (3, 6);

-- PLANTS (Organized by categories)
INSERT INTO Plant (user_id, name, category, age, plant_condition, description, image_url, willing_to_exchange_for, location, status, price_estimation)
VALUES
-- Tanaman Hias (Ornamental Plants)
(1, 'Anggrek Bulan', 'Tanaman Hias', 2, 'Sehat', 'Tanaman hias populer dengan bunga putih yang elegan', '/swap_product/anggrek-bulan.jpg', 'Tanaman herbal', 'Banda Aceh', 'available', 50000.00),
(5, 'Monstera Deliciosa', 'Tanaman Hias', 3, 'Sehat', 'Daun besar dan berlubang, cocok untuk ruangan dalam', '/swap_product/monstera.jpg', 'Tanaman hias lainnya', 'Sabang', 'available', 75000.00),
(5, 'Monstera Adansonii', 'Tanaman Hias', 1, 'Sehat', 'Varietas monstera dengan daun lebih kecil dan berlubang', '/swap_product/monstera-adansonii.jpeg', 'Tanaman hias', 'Lhokseumawe', 'available', 45000.00),
(6, 'Philodendron Brasil', 'Tanaman Hias', 2, 'Subur', 'Daun variegata hijau dan kuning yang menarik', '/swap_product/philodendron brasil.jpeg', 'Tanaman hias', 'Meulaboh', 'available', 55000.00),
(6, 'Sirih Gading', 'Tanaman Hias', 1, 'Sehat', 'Tanaman merambat dengan daun hijau mengkilap', '/swap_product/sirih-gading.jpeg', 'Tanaman herbal', 'Banda Aceh', 'available', 35000.00),
(6, 'Adenium', 'Tanaman Hias', 4, 'Sehat', 'Kamboja Jepang dengan bunga merah muda', '/swap_product/adenium.jpg', 'Tanaman hias', 'Sigli', 'available', 60000.00),
(1, 'Calathea Orbifolia', 'Tanaman Hias', 3, 'Sehat', 'Daun bundar dengan corak garis-garis silver', '/swap_product/calathea.jpg', 'Tanaman hias', 'Banda Aceh', 'available', 85000.00),
(2, 'Alocasia Dragon Scale', 'Tanaman Hias', 2, 'Sehat', 'Daun tekstur seperti sisik naga', '/swap_product/alocasia.jpeg', 'Tanaman hias', 'Langsa', 'available', 120000.00),
(3, 'Begonia Maculata', 'Tanaman Hias', 1, 'Sehat', 'Daun berbintik putih yang cantik', '/swap_product/begonia.jpeg', 'Tanaman hias', 'Lhokseumawe', 'available', 65000.00),

-- Tanaman Buah (Fruit Plants)
(8, 'Jambu Kristal', 'Tanaman Buah', 6, 'Subur', 'Varietas jambu premium dengan daging buah renyah', '/swap_product/18__jambu_biji_kristal3.jpg', 'Tanaman buah lain', 'Banda Aceh', 'available', 85000.00),
(8, 'Jeruk Santang Madu', 'Tanaman Buah', 8, 'Sehat', 'Jeruk manis dengan rasa madu', '/swap_product/Jeruk-santang-madu.jpg', 'Tanaman buah', 'Sabang', 'available', 95000.00),
(8, 'Tin Merah', 'Tanaman Buah', 4, 'Sehat', 'Buah tin dengan daging merah manis', '/swap_product/tabulampot-buah-tin-merah.jpg', 'Tanaman buah', 'Meulaboh', 'available', 120000.00),
(2, 'Mangga Harum Manis', 'Tanaman Buah', 12, 'Subur', 'Mangga manis aromatis', '/swap_product/mangga.jpg', 'Tanaman buah', 'Banda Aceh', 'available', 150000.00),
(3, 'Rambutan Binjai', 'Tanaman Buah', 24, 'Sehat', 'Rambutan manis daging tebal', '/swap_product/rambutan.jpeg', 'Tanaman buah', 'Sigli', 'available', 200000.00),
(4, 'Durian Montong', 'Tanaman Buah', 36, 'Sehat', 'Bibit durian unggul', '/swap_product/durian.jpg', 'Tanaman buah', 'Langsa', 'available', 250000.00),

-- Tanaman Herbal (Medicinal Plants)
(4, 'Rosella', 'Tanaman Herbal', 3, 'Subur', 'Bunga dapat diolah menjadi teh kesehatan', '/swap_product/Bunga-Rosella1.jpg', 'Tanaman herbal lain', 'Banda Aceh', 'available', 40000.00),
(4, 'Kunyit', 'Tanaman Herbal', 5, 'Sehat', 'Rimpang kuning untuk obat tradisional', '/swap_product/kunyit.jpg', 'Tanaman herbal', 'Lhokseumawe', 'available', 25000.00),
(7, 'Lidah Buaya', 'Tanaman Herbal', 2, 'Segar', 'Tanaman multifungsi untuk kesehatan dan kecantikan', '/swap_product/lidahbuaya.jpg', 'Tanaman herbal', 'Banda Aceh', 'available', 30000.00),
(1, 'Jahe Merah', 'Tanaman Herbal', 4, 'Sehat', 'Jahe merah berkhasiat tinggi', '/swap_product/jahe.jpeg', 'Tanaman herbal', 'Meulaboh', 'available', 35000.00),
(2, 'Temulawak', 'Tanaman Herbal', 6, 'Subur', 'Rimpang kuning untuk kesehatan', '/swap_product/temulawak.jpeg', 'Tanaman herbal', 'Sigli', 'available', 30000.00),
(3, 'Serai Wangi', 'Tanaman Herbal', 3, 'Sehat', 'Tanaman pengusir nyamuk alami', '/swap_product/serai-wangi.jpg', 'Tanaman herbal', 'Sabang', 'available', 25000.00),

-- Tanaman Bumbu (Culinary Herbs)
(7, 'Kemangi', 'Tanaman Bumbu', 1, 'Subur', 'Daun aromatik untuk masakan', '/swap_product/kemangi.jpeg', 'Tanaman bumbu lain', 'Banda Aceh', 'available', 15000.00),
(7, 'Serai', 'Tanaman Bumbu', 4, 'Segar', 'Bumbu dapur dan bahan herbal', '/swap_product/serai.jpg', 'Tanaman bumbu', 'Lhokseumawe', 'available', 20000.00),
(4, 'Rosemary', 'Tanaman Bumbu', 2, 'Sehat', 'Herba aromatik untuk masakan', '/swap_product/Rosemary_in_bloom.jpeg', 'Tanaman bumbu', 'Banda Aceh', 'available', 45000.00),
(7, 'Mint', 'Tanaman Bumbu', 1, 'Segar', 'Daun mint segar untuk minuman dan masakan', '/swap_product/mint.jpeg', 'Tanaman bumbu', 'Meulaboh', 'available', 25000.00),
(1, 'Daun Kari', 'Tanaman Bumbu', 3, 'Sehat', 'Daun aromatik untuk kari', '/swap_product/daun-kari.jpeg', 'Tanaman bumbu', 'Sigli', 'available', 30000.00),
(2, 'Oregano', 'Tanaman Bumbu', 2, 'Subur', 'Bumbu masakan Italia', '/swap_product/oregano.jpg', 'Tanaman bumbu', 'Langsa', 'available', 35000.00),

-- Sukulen (Succulents)
(6, 'Succulent Mix', 'Sukulen', 1, 'Sehat', 'Koleksi sukulen mini yang mudah dirawat', '/swap_product/succulent.jpeg', 'Tanaman hias', 'Banda Aceh', 'available', 35000.00),
(5, 'Echeveria Elegans', 'Sukulen', 2, 'Sehat', 'Sukulen berbentuk mawar', '/swap_product/echeveria.jpeg', 'Sukulen', 'Lhokseumawe', 'available', 40000.00),
(4, 'Haworthia Zebra', 'Sukulen', 1, 'Sehat', 'Sukulen dengan corak zebra', '/swap_product/haworthia.jpeg', 'Sukulen', 'Sabang', 'available', 45000.00),
(3, 'Crassula Ovata', 'Sukulen', 3, 'Subur', 'Pohon jade mini', '/swap_product/crassula-ovata.jpg', 'Sukulen', 'Banda Aceh', 'available', 50000.00);

-- REVIEWS
INSERT INTO Review (user_id, plant_id, comment, created_at, rating)
VALUES
(1, 2, 'Tanaman sehat dan tumbuh dengan baik', NOW(), 5),
(2, 1, 'Anggrek yang cantik dan terawat', NOW(), 4),
(4, 6, 'Philodendron tumbuh dengan subur', NOW(), 5),
(5, 8, 'Jeruk berbuah lebat dan manis', NOW(), 5),
(7, 11, 'Kualitas tanaman herbal sangat baik', NOW(), 4);

-- SUPPORT TICKET
INSERT INTO SupportTicket (user_id, category, subject, message, status)
VALUES
(3, 'Akun', 'Tidak bisa login', 'Saya lupa password dan tidak bisa login', 'open');

-- SWAP MATCH
INSERT INTO SwapMatch (plant_id_1, plant_id_2, status, matched_at, completed_at)
SELECT p1.plant_id, p2.plant_id, 'pending', NOW(), NULL
FROM Plant p1
JOIN Plant p2 ON p1.plant_id != p2.plant_id
WHERE p1.plant_id = 1 AND p2.plant_id = 2
AND p1.is_point_exchange = FALSE AND p2.is_point_exchange = FALSE
AND p1.status = 'available' AND p2.status = 'available'
LIMIT 1;

INSERT INTO SwapMatch (plant_id_1, plant_id_2, status, matched_at, completed_at)
SELECT p1.plant_id, p2.plant_id, 'completed', NOW(), NOW()
FROM Plant p1
JOIN Plant p2 ON p1.plant_id != p2.plant_id
WHERE p1.plant_id = 4 AND p2.plant_id = 7
AND p1.is_point_exchange = FALSE AND p2.is_point_exchange = FALSE
AND p1.status = 'available' AND p2.status = 'available'
LIMIT 1;

INSERT INTO SwapMatch (plant_id_1, plant_id_2, status, matched_at, completed_at)
SELECT p1.plant_id, p2.plant_id, 'pending', NOW(), NULL
FROM Plant p1
JOIN Plant p2 ON p1.plant_id != p2.plant_id
WHERE p1.plant_id = 10 AND p2.plant_id = 15
AND p1.is_point_exchange = FALSE AND p2.is_point_exchange = FALSE
AND p1.status = 'available' AND p2.status = 'available'
LIMIT 1;

-- MESSAGES
INSERT INTO Message (sender_id, recipient_id, plant_id, message, created_at)
VALUES
(1, 2, 1, 'Halo, saya tertarik dengan tanaman Anda', NOW()),
(2, 1, 1, 'Baik, boleh kita diskusikan lebih lanjut?', NOW()),
(4, 6, 4, 'Apakah philodendron masih tersedia?', NOW()),
(6, 4, 4, 'Ya, masih tersedia. Mau tukar dengan apa?', NOW());

-- SAVED PLANTS
INSERT INTO SavedPlant (user_id, plant_id)
VALUES
(1, 2), (1, 3), (2, 1), (3, 1), (2, 3),
(4, 1), (4, 2), (5, 4), (6, 4), (7, 5),
(8, 6), (8, 7), (1, 8), (2, 8), (3, 6);
