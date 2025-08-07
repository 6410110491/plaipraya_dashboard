CREATE TABLE IF NOT EXISTS s_ttm35(
id varchar(32) NOT NULL,
hospcode varchar(5) NOT NULL,
areacode varchar(8) NOT NULL,
date_com varchar(14) DEFAULT NULL,
b_year varchar(4) NOT NULL,
op_service_q1 INTEGER DEFAULT 0,
tm_service_q1 INTEGER DEFAULT 0,
op_service_q2 INTEGER DEFAULT 0,
tm_service_q2 INTEGER DEFAULT 0,
op_service_q3 INTEGER DEFAULT 0,
tm_service_q3 INTEGER DEFAULT 0,
op_service_q4 INTEGER DEFAULT 0,
tm_service_q4 INTEGER DEFAULT 0
);