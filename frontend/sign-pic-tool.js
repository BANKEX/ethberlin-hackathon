class PictureEncryption {
    newAccount() {
        const privateKey = LS.Ethereum.account.create();
        const address = LS.Ethereum.account.getAddress(privateKey);
        return {
            privateKey: privateKey,
            address: address
        }
    }

    encryptAccount(privateKey, password) {
        if (password == '')
            throw new Error('Enter password');
        const encrypted = CryptoJS.AES.encrypt(privateKey, password);
        return encrypted.toString();
    }

    createQRCode(tagForQR, data) {
        (function () {
            const qr = new QRious({
                element: document.getElementById(tagForQR),
                value: data
            });
            qr.size = 300;
        })();
    }

    checkPassword(passwordElemID, errorElemID) {
        const password = document.getElementById(passwordElemID).value;

        const checkObject = {
            0: {
                check: password != '',
                errorMessage: 'Enter password'
            },
            1: {
                check: password.length > 8,
                errorMessage: 'Password should be more than 8 characters'
            },
            2: {
                check: RegExp(/(?=.*[!@#$%^&*])/).test(password),
                errorMessage: 'The password must contain special characters'
            },
            3: {
                check: RegExp(/(?=.*[a-z])(?=.*[A-Z])/).test(password),
                errorMessage: 'The password must contain Latin letters of different registers'
            }
        }

        let err = false;
        for (let i in checkObject) {
            if (!checkObject[i].check) {
                err = true;
                $(`#${errorElemID}`).text(`${checkObject[i].errorMessage}`);
                break;
            } else {
                $(`#${errorElemID}`).text(``);
            }
        }

        return err == false ? password : false;
    }

}

class PictureDecryption {
    /**
     * Allows to get file
     */
    getFile() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const file = document.querySelector('input[type=file]').files[0];
            if (!file)
                throw Error('Add file');
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    }

    /**
     * Allows to get QR code data
     * @param qrCode IMG selector data
     * @return Cipher
     */
    decodeQR(qrCode) {
        const img = {
            src: qrCode
        };

        return new Promise((resolve, reject) => {
            QCodeDecoder()
                .decodeFromImage(img, function (err, cipher) {
                    if (err)
                        reject(err);
                    else
                        resolve(cipher);
                });
        });
    }

    decryptAccount(cypherText, password) {
        return CryptoJS.AES.decrypt(cypherText, password);
    }
}

const LS = new LightySig();

const PE = new PictureEncryption();

const PD = new PictureDecryption();