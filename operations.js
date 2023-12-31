const mysql = require('mysql2');

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'social_media'
}).promise();

async function readPosts() {
    const res = await connection.query("select * from posts");
    return res[0];
}

async function readUser(profile) {
    const res = await connection.query("select * from users where profile = '" + profile + "'")
    return res[0]
}

async function insertUser(name, profile, password, headline) {
    const res = await connection.query(
        "INSERT INTO users (name, profile, password, headline) VALUES (?, ?, ?, ?)",
        [name, profile, password, headline]
    );
}

async function insertPost(profile, content) {
    const res = await connection.query(`
  INSERT INTO posts (profile, content, likes, shares)
  VALUES ('${profile}', '${content}', 0, 0)
`);

}

async function likeFun(content) {
    const output = await connection.query("select likes from posts where content ='" + content + "' ")
    const likes = output[0][0].likes
    const incLikes = likes + 1;
    await connection.query("update posts set likes = " + incLikes + " where content='" + content + "' ")
}

async function shareFun(content) {
    const output = await connection.query("select shares from posts where content ='" + content + "' ")
    const shares = output[0][0].shares
    const incShares = shares + 1;
    await connection.query("update posts set shares = " + incShares + " where content='" + content + "' ")
}


async function deleteFun(content) {
    const output = await connection.query("delete from posts where content ='" + content + "' ")
}

// async function main() {
//     const result = await readPosts();
//     console.log(result);
// }

// Call the main function
// main();


module.exports = { readPosts, readUser, insertUser, insertPost, likeFun, shareFun, deleteFun }