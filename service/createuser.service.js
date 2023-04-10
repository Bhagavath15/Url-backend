import { client } from '../index.js';

export async function hashpass(username, hashpassword, firstname, lastname) {
    return await client
        .db("urlshortner")
        .collection("signup")
        .insertOne({
            username: username,
            firstname: firstname,
            lastname: lastname,
            password: hashpassword
        });
}

export async function getuserbyname(username, hashpassword) {
    return await client
        .db("urlshortner")
        .collection("signup")
        .findOne({
            username: username
        });
}