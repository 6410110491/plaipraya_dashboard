CREATE TABLE IF NOT EXISTS summary_inspector (
    a_code VARCHAR(10),           
    a_name TEXT,                  
    target INTEGER DEFAULT 0,     
    result INTEGER DEFAULT 0,     
    percent NUMERIC(5,2),
    kpi VARCHAR(256)
);
