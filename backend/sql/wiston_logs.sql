CREATE TABLE IF NOT EXISTS winston_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(50) NOT NULL,                    
    timestamp TIMESTAMP NOT NULL DEFAULT now(),  
    context VARCHAR(255),                         
    message TEXT NOT NULL,                        
    stack JSONB                                   
);
