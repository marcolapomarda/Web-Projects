/*

A shift cipher takes a plain text message and shifts each letter forward in the alphabet by a given number.
For example, a shift cipher with a shift of 1 would turn the string 'hello' to 'ifmmp'.

Create a class ShiftCipher that takes the numerical value of the shift as a constructor parameter. The class should have two methods:

encrypt: takes a plain text string and returns a capitalized string with each letter shifted forward in the alphabet based on the set shift value.
decrypt: takes an encrypted message and returns a lower case string with each letter shifted back in the alphabet based on the set shift value.
In both methods, any character outside the alphabet should remain the same.
But if a character is shifted outside the alphabet in either direction it should be wrapped around to the other side.
For example, encrypting a y with a shift of 4 results in C and decrypting an A with a shift of 1 result in z.

EXAMPLE
const cipher = new ShiftCipher(2);
cipher.encrypt('I love to code!'); // returns 'K NQXG VQ EQFG!'
cipher.decrypt('K <3 OA RWRRA'); // returns 'i <3 my puppy'

*/

// Write class below
class ShiftCipher {
  constructor(shift) {
    this._shift = shift;
  }

  encrypt(phrase) {
    const toEncrypt = phrase.toUpperCase();
    const toEncryptArr = toEncrypt.split('');

    for(let i = 0; i < phrase.length; i++) {
      let unicode = toEncrypt.charCodeAt(i);

      if(unicode >= 65 && unicode <= 90) {
        let shiftedUnicodeChar = String.fromCharCode(unicode + this._shift);

        if(shiftedUnicodeChar.charCodeAt(0) > 90) {
            let resetPos = shiftedUnicodeChar.charCodeAt(0) - 90;
            shiftedUnicodeChar = String.fromCharCode(64 + resetPos);
        }

        toEncryptArr[i] = shiftedUnicodeChar;
      }
    }
    
    const encryptedStr = toEncryptArr.join('');
    return encryptedStr;
  }

  decrypt(phrase) {
    const toDecrypt = phrase.toLowerCase();
    const toDecryptArr = toDecrypt.split('');

    for(let i = 0; i < phrase.length; i++) {
      let unicode = toDecrypt.charCodeAt(i);

      if(unicode >= 97 && unicode <= 122) {
        let shiftedUnicodeChar = String.fromCharCode(unicode - this._shift);

        if(shiftedUnicodeChar.charCodeAt(0) < 97) {
            let resetPos = 97 - shiftedUnicodeChar.charCodeAt(0);
            shiftedUnicodeChar = String.fromCharCode(123 - resetPos);
        }

        toDecryptArr[i] = shiftedUnicodeChar;
      }
    }
    
    const decryptedStr = toDecryptArr.join('');
    return decryptedStr;
  }
}

const cipher = new ShiftCipher(2);
console.log(cipher.encrypt('I love <3 to code!'));
console.log(cipher.encrypt('Zorro you are great!'));
console.log(cipher.decrypt('K <3 OA RWRRA'));
console.log(cipher.decrypt('BQTTQ AQW CTG ITGCV!'));
console.log(cipher.decrypt('K NQXG <3 VQ EQFG!'));