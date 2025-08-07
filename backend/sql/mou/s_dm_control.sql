CREATE TABLE IF NOT EXISTS s_dm_control(
id varchar(32) NOT NULL,
hospcode varchar(5) NOT NULL,
areacode varchar(8) NOT NULL,
date_com varchar(14) DEFAULT NULL,
b_year varchar(4) NOT NULL,
target INTEGER DEFAULT 0,
result INTEGER DEFAULT 0,
hba1c INTEGER DEFAULT 0,
target1 INTEGER DEFAULT 0,
result1 INTEGER DEFAULT 0,
hba1c1 INTEGER DEFAULT 0,

target_com INTEGER DEFAULT 0,
hba1c_com INTEGER DEFAULT 0,
result_com INTEGER DEFAULT 0,

target_com1 INTEGER DEFAULT 0,
hba1c_com1 INTEGER DEFAULT 0,
result_com1 INTEGER DEFAULT 0,
yymm varchar(6),
date_fz	varchar(14)
);