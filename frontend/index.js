const user_id = location.pathname.split('/')[1];
console.log(user_id)
const URL = "http://23.100.12.138:3000";

async function generatePicture() {
   const account = PE.newAccount();
   const privateKey = account.privateKey;
   const address = account.address;

    const password = PE.checkPassword('password', 'error');
    if (!password)
        return;

    const encrypted = PE.encryptAccount(privateKey, password);

    document.getElementById('body').innerHTML = `
        <p>Your address: <span>${address}</span></p>
        <br>
        <p>Save this QR code. It's your access to account</p>
        <br>
        <img id="qr">
        <br>
        `;

    PE.createQRCode('qr', encrypted);

    await request('GET', URL + '/newKeyPair/' + user_id + '/' + address);
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