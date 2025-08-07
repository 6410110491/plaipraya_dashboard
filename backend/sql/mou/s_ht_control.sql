CREATE TABLE IF NOT EXISTS s_ht_control(
id varchar(32) NOT NULL,
hospcode varchar(5) NOT NULL,
areacode varchar(8) NOT NULL,
date_com varchar(14) DEFAULT NULL,
b_year varchar(4) NOT NULL,
target INTEGER DEFAULT 0,
result INTEGER DEFAULT 0,

bp INTEGER DEFAULT 0,
target1 INTEGER DEFAULT 0,
result1 INTEGER DEFAULT 0,

bp1 INTEGER DEFAULT 0,
target2 INTEGER DEFAULT 0,
no_bp_d INTEGER DEFAULT 0,
no_bp_f INTEGER DEFAULT 0,

bp1_d INTEGER DEFAULT 0,
bp1_f INTEGER DEFAULT 0,
result_bp1_d INTEGER DEFAULT 0,
result_bp1_f INTEGER DEFAULT 0,

yymm varchar(6),
date_fz	varchar(14)
);