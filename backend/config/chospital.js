const fs = require('fs');
const pool = require('./db');
const copyFrom = require('pg-copy-streams').from;
const async = require('async');

async function processSQLFile(fileName) {
    const queries = fs.readFileSync(fileName).toString()
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/\s+/g, ' ')
        .split(";")
        .map(s => s.trim())
        .filter(s => s.length > 0);

    const batch = [];

    queries.forEach(query => {
        batch.push(done => {
            if (query.startsWith("COPY")) {
                const regex = /COPY\s+(.*?)\s+FROM\s+'(.*?)'/i;
                const matches = regex.exec(query);
                if (!matches) return done(new Error("COPY format not matched"));

                const table = matches[1];
                const filePath = __dirname + '/' + matches[2];
                const copyQuery = `COPY ${table} FROM STDIN WITH CSV HEADER`;

                const stream = pool.query(copyFrom(copyQuery));
                const fileStream = fs.createReadStream(filePath);

                fileStream.on('error', done);
                stream.on('error', done);
                stream.on('finish', done);

                fileStream.pipe(stream);
            } else {
                pool.query(query, (err, res) => {
                    if (err) return done(err);
                    done();
                });
            }
        });
    });

    async.series(batch, (err) => {
        if (err) {
            console.error("Error executing SQL file:", err);
        } else {
            console.log("SQL file executed successfully");
        }
        pool.end();
    });
}

processSQLFile("./config/chosptal.sql")