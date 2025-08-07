CREATE TABLE IF NOT EXISTS s_breast_screen(
id varchar(32) NOT NULL,
hospcode varchar(5) NOT NULL,
areacode varchar(8) NOT NULL,
date_com varchar(14) DEFAULT NULL,
b_year varchar(4) NOT NULL,
target INTEGER DEFAULT 0,
result INTEGER DEFAULT 0,
result1 INTEGER DEFAULT 0,
result2 INTEGER DEFAULT 0
);