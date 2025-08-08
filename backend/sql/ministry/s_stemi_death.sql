CREATE TABLE IF NOT EXISTS s_stemi_death(
id varchar(32) NOT NULL,
hospcode varchar(5) NOT NULL,
areacode varchar(8) NOT NULL,
date_com varchar(14) DEFAULT NULL,
b_year varchar(4) NOT NULL,
targetq1 INTEGER DEFAULT 0,
targetq2 INTEGER DEFAULT 0,
targetq3 INTEGER DEFAULT 0,
targetq4 INTEGER DEFAULT 0,
resultq1 INTEGER DEFAULT 0,
resultq2 INTEGER DEFAULT 0,
resultq3 INTEGER DEFAULT 0,
resultq4 INTEGER DEFAULT 0
);