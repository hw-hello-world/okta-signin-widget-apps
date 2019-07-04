const publicKeyCredentialCreationOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: {
        name: "localhost:4001",
        id: "localhost:4001",
    },
    user: {
        id: Uint8Array.from(
            "UZSL85T9AFC", c => c.charCodeAt(0)),
        name: "foo@bar.com",
        displayName: "Foo",
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
        requireResidentKey: false,
        userVerification: "preferred",
    },
    timeout: 60000,
    attestation: "direct"
};

async function tryAuthn() {
    try {
        const credential = await navigator.credentials.create({
            publicKey: publicKeyCredentialCreationOptions
        });
        console.log(credential);
    } catch (e) {
        console.error(e);
    }
}

document.getElementById('try-authn').onclick = tryAuthn;
