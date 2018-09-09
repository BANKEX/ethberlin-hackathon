const user_id = location.pathname.split('/')[1];

const URL = "http://23.100.12.138:3000";


// RSA USED ONLY FOR EXAMPLE!!!! Custom ECDSA Curve code on python. There are not enough time to rewrite it to js
async function generatePicture() {
    const keyPair = newClientKeyPair();
    const publicKey = getClientPublicKey(keyPair);
    const password = PE.checkPassword('password', 'error');
    if (!password)
        return;
    const encrypted = PE.encryptAccount(keyPair.exportKey(), password);

    document.getElementById('body').innerHTML = `
        <p>Your public key: <span style="width:80%; word-wrap: break-word">${"0x"+Base64toHEX(publicKey.split('-----BEGIN RSA PUBLIC KEY-----')[1].split('-----END RSA PUBLIC KEY-----')[0])}</span></p>
        <br>
        <p>Save this QR code. It's your access to account</p>
        <br>
        <img id="qr">
        <br>
        `;

    PE.createQRCode('qr', encrypted);

    await request('GET', URL + '/newKeyPair/' + user_id + '/' + publicKey.toString().hexEncode());
}

async function getPrivateKey() {
    const password = document.getElementById('password').value;
    try {
        const file = await PD.getFile();
        const sypherText = await PD.decodeQR(file);
        try {
            const bytes = PD.decryptAccount(sypherText, password);
            const privateKey = bytes.toString(CryptoJS.enc.Utf8);
            console.log(privateKey)
            if (privateKey == '') {
                document.getElementById('error1').innerText = 'Password is wrong';
                return;
            }
            const data = getData();
            const signedData = Uint8ArrayToHex(signData(new NodeRSA.RSA(privateKey), data));
            $('#first').hide();
            $('#second').show();
            document.getElementById('second').innerHTML += `
                <p style="word-wrap: break-word; font-size: 25px; width:100%; float: left" id="signature">${signedData}</p>
                <button class="btn btn-info btn-lg" onclick="pushSignature()">PUSH</button>
            `;
        } catch (e) {
            console.log(e)
            document.getElementById('error1').innerText = 'Password is wrong';
        }
    } catch (e) {
        document.getElementById('error').innerText = 'Add file, please';
    }
}

const request = async (method, url, data) => {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "processData": false,
    };

    if (data) {
        settings.data = data;
        settings.headers = {
            "Content-Type": "application/json",
            // "Cache-Control": "no-cache"
        };
    }

    const result = await $.ajax(settings);
    return result;
};

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

function signData(clientKey, data) {
    return clientKey.sign(data);
}

function newClientKeyPair() {
    return new NodeRSA.RSA({b: 1024});
}

function getClientPublicKey(clientKeyPair) {
    return clientKeyPair.exportKey('pkcs1-public');
}

function Uint8ArrayToHex(bytes) {
    return "0x" + bytes.reduce(function(memo, i) {
        return memo + ('0' + i.toString(16)).slice(-2); //padd with leading 0 if <16
    }, '');
}

function pushSignature() {
    $('#second').hide();
    $('#third').show();

}

function getData() {
    const answer = location.pathname.split('/')[1];
    document.getElementById('answer').innerText = answer;
    return answer;
}

function Base64toHEX(base64) {
    const raw = window.atob(base64);
    var HEX = '';
    for (i = 0; i < raw.length; i++) {
        var _hex = raw.charCodeAt(i).toString(16)
        HEX += (_hex.length == 2 ? _hex : '0' + _hex);
    }
    return HEX.toLowerCase();
}