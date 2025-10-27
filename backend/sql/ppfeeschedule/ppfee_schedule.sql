CREATE TABLE IF NOT EXISTS "ppfee_years" (
    id VARCHAR(32) PRIMARY KEY,
    year INT NOT NULL UNIQUE,          
    status VARCHAR(10) NOT NULL,       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ppfee_data" (
    id VARCHAR(32) PRIMARY KEY,
    year_id VARCHAR(32) NOT NULL REFERENCES ppfee_years(id) ON DELETE CASCADE,
    service_unit_code VARCHAR(50) NOT NULL,  
    service_unit_name VARCHAR(255) NOT NULL, 
    main_activity VARCHAR(255) NOT NULL,    
    sub_activity VARCHAR(255) NOT NULL,      
    person_count INT DEFAULT 0,            
    service_count INT DEFAULT 0,            
    amount NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
