CREATE TABLE IF NOT EXISTS s_anc_quality (
    id varchar(32) NOT NULL,
    hospcode varchar(5) NOT NULL,
    areacode varchar(8) NOT NULL,
    flag_sent varchar(1) DEFAULT NULL,
    date_com varchar(14) DEFAULT NULL,
    b_year varchar(4) NOT NULL,
    target INTEGER DEFAULT 0,
    result INTEGER DEFAULT 0,
    target1 INTEGER DEFAULT 0,
    result1 INTEGER DEFAULT 0,
    target2 INTEGER DEFAULT 0,
    result2 INTEGER DEFAULT 0,
    target3 INTEGER DEFAULT 0,
    result3 INTEGER DEFAULT 0,
    target4 INTEGER DEFAULT 0,
    result4 INTEGER DEFAULT 0  
);