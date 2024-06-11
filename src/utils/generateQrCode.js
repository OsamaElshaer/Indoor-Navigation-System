const QRCode = require("qrcode");

async function generateQRCode(orgId) {
    const url = `https://indoor-navigation-system.onrender.com/api/floors/find/${orgId}`;
    try {
        const qrCodeDataURL = await QRCode.toDataURL(url);
        return qrCodeDataURL;
    } catch (err) {
        console.error(err);
    }
}

module.exports = generateQRCode;
