/**
 * NetScaler Cookie Decryption Script
 *
 * @author Randy Gingeleski - Kapotel LLC
 *
 * Credit to catalyst256 for functional development
 * https://github.com/catalyst256/Netscaler-Cookie-Decryptor
 */


// This regex will be used to identify if a valid cookie was entered, before actually parsing
var re = new RegExp( "NSC_([a-zA-Z0-9\-\_\.]*)=[0-9a-f]{8}([0-9a-f]{8}).*([0-9a-f]{4})$" );

var serverName, serverIP, serverPort;

// Grabs the user-provided encrypted cookie value from the page's field
function getEncryptedCookie() {
    return document.getElementById( "load-cookie" ).value;
}

// Attempts to parse the encrypted cookie, returning boolean
function parseCookie() {
    var regexMatches, encryptedCookie = getEncryptedCookie();

    var regexTest = re.test( encryptedCookie );
    // True or false, a valid cookie has been given

    if ( regexTest ) {
        regexMatches = re.exec( encryptedCookie );
        serverName = regexMatches[1];
        serverIP = regexMatches[2];
        serverPort = regexMatches[3];
        return true;
    }

    return false;
}

// Decrypts the Caesar cipher encryption used on the NetScaler cookie name
function decryptServerName() {
    var realName = '';

    for ( var i = 0; i < serverName.length; i++ ) {
        var c = serverName.charCodeAt( i );
        var shift = -1;

        // Uppercase
        if (c >= 65 && c <=  90) { realName += String.fromCharCode((c - 65 + shift) % 26 + 65); }
        // Lowercase
		else if (c >= 97 && c <= 122) { realName += String.fromCharCode((c - 97 + shift) % 26 + 97); }
        // Copy
		else { realName += serverName.charAt(i); }
    }

    return realName;
}

// Decrypts the XOR encryption used for the NetScaler server IP
function decryptServerIP() {
    var IPKey = 0x03081e11;
    var decodedIP = ( serverIP ^ IPKey ).toString(16);
    var realIP;

    return 'realIP';
}

// Decrypts the XOR encryption used on the NetScaler server port
function decryptServerPort() {
    var portKey = 0x3630;
    var realPort = serverPort ^ portKey;

    return 'realPort';
}

// Everything together - on change of encrypted cookie form, this gets called
function decryptCookie() {
    if ( parseCookie() ) {
        document.getElementById("server-name").value = decryptServerName();
        document.getElementById("server-ip").value = decryptServerIP();
        document.getElementById("server-port").value = decryptServerPort();
    } else {
        document.getElementById("server-name").value = "Invalid cookie";
        document.getElementById("server-ip").value = "Invalid cookie";
        document.getElementById("server-port").value = "Invalid cookie";
    }
}
