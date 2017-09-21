'use strict';

const crypto = require('crypto');

const MongoConnect = require('./MongoConnect');
const UserSchema = require('./User');
const User = UserSchema.User;

const passwordSalt = process.env.PASSWORD_SALT || "NR8ymM4UZumvN4jm4fTv8nxR2yMm5enjjPhZ47qjSBUqFftK";
const hmacKey = process.env.HMAC_KEY || "CHTDTh6QGsgsEER6QveHFuQtmfnssa2SRt6Ev4Wfykp2DFQk";
const nonceSize = Number(process.env.NONCE_SIZE || 128);

function generateNonce(length) {
  length = length || nonceSize;
  const buf = crypto.randomBytes(length);

  return buf.toString('base64');
}

function createPassword(password, userNonce) {
  return new Promise((resolve, reject) => {
    const passwordHash = crypto.createHmac('sha256', hmacKey)
      .update(password + passwordSalt)
      .digest();

    crypto.pbkdf2(passwordHash, userNonce, 10000, 128, 'sha256', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString('base64'));
      }
    });
  });
}

MongoConnect.mongooseConnect()
  .then(() => User.find({}))
  .then((users) => {
    console.log(`Found ${users.length} users.`);
    const promises = users.map((user) => {
      console.log(`Updating ${user.email}`);
      const nonce = generateNonce();
      user.nonce = nonce;
      return createPassword('test', nonce)
        .then((newPassword) => {
          user.password = newPassword;
          return user.save();
        });
    });
    return Promise.all(promises);
  })
  .then((result) => {
    console.log(`Updated ${result.length} users.`);
    process.exit();
  })
  .catch((error) => {
    console.log(`Update failed => ${error}`)
    process.exit();
  });
