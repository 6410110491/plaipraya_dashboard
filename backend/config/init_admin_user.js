const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdminUser() {
    try {
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const firstName = process.env.ADMIN_FIRSTNAME;
        const lastName = process.env.ADMIN_LASTNAME;
        const department = process.env.ADMIN_DEPARTMENT;
        const default_role = 'superadmin';

        const checkUser = await pool.query(
            `SELECT id FROM users WHERE username = $1 OR email = $2`,
            [username, email]
        );

        if (checkUser.rows.length > 0) {
            console.log(`User '${username}' Username taken`);
            return;
        }

        const hashedPass = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const gen_id = generateTimestampId();

        const newUserQuery = await pool.query(
            `INSERT INTO users
                (id, username, password, email, first_name, last_name, department, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, username`,
            [gen_id, username, hashedPass, email, firstName, lastName, department, default_role]
        );

        console.log('Admin account created success:', newUserQuery.rows[0]);
    } catch (error) {
        console.error('Admin account can not create:', error);
    }
}

createAdminUser();

function generateTimestampId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return BigInt(timestamp) * 1000n + BigInt(random);
}
