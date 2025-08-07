const fs = require('fs');
const path = require('path');
const pool = require('./db'); // connection pool
require('dotenv').config();

async function runSqlFilesInDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await runSqlFilesInDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.sql')) {
            const sql = fs.readFileSync(fullPath, 'utf8');
            console.log(`📄 Running: ${fullPath}`);
            try {
                await pool.query(sql);
                console.log(`✅ Completed: ${entry.name}`);
            } catch (err) {
                console.error(`Error running ${entry.name}:`, err);
            }
        }
    }
}

async function createTable() {
    const sqlRoot = path.join(__dirname, '../sql');
    try {
        await runSqlFilesInDir(sqlRoot);
        console.log('✅ All SQL files executed.');
    } catch (error) {
        console.error('❌ Error executing SQL files:', error);
    } finally {
        await pool.end(); // ปิด connection
    }
}

createTable();
