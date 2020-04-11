const fetch = require('node-fetch');
const cheerio = require('cheerio');
const delay = require('delay');
const fs = require('fs');

function randstr(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generatoremail = (username = null, domain = null) => new Promise((resolve, reject) => {
    const cookie = (username == null && domain == null) ? `_ga=GA1.2.1243162573.1586462100; _gid=GA1.2.937060635.1586462101;` : `_ga=GA1.2.1243162573.1586462100; _gid=GA1.2.937060635.1586462101; surl=${domain}%2F${username}`;
    fetch('https://generator.email/', {
        method: 'GET',
        headers: {
            "cookie": cookie,
            "user-agent": "Mozilla/5.0 (Linux; Android 7.1.2; SM-G935FD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
            "sec-fetch-dest": "document",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        timeout: 5000
    })
        .then(res => res.text())
        .then(text => {
            const $ = cheerio.load(text);
            const code = (username == null && domain == null) ? $(`span[id="email_ch_text"]`).text() : $(`a[class="call-to-action-button"]`).attr('href')
            resolve(code);
        })
        .catch(err => reject(err));
});

const spotify = (bodyne) => new Promise((resolve, reject) => {
    fetch('https://spclient.wg.spotify.com/signup/public/v1/account/', {
        method: 'POST',
        headers: {
            "accept-language": "en-US",
            "user-agent": "Spotify/8.5.51 Android/25 (SM-G935FD)",
            "spotify-app-version": "8.5.51",
            "x-client-id": randstr(32),
            "app-platform": "Android",
            "content-type": "application/x-www-form-urlencoded",
            "accept-encoding": "gzip",
            "Content-Length": "264"
        },
        body: bodyne,
        timeout: 5000
    }).then(async res => {
        const result = {
            body: await res.json(),
        }
        resolve(result.body)
    })
        .catch(err => reject(err))
});


(async () => {
    let a = 0;
    while (true) {
        try {
            a++;
            const email = await generatoremail();
            console.log(`[${a}] Trying Register Using ${email}`);
            const cacah = email.split("@");
            const createspotify = await spotify(`birth_day=11&name=${cacah[0]}&gender=neutral&birth_year=1995&platform=Android-ARM&email=${email}&creation_point=client_mobile&password=Raditya%40123&password_repeat=Raditya%40123&iagree=true&birth_month=4&key=142b583129b2df829de3656f9eb484e6`);
            if (createspotify.status == 1) {
                console.log(`[${a}] Success Register`);
                for (i = 0; i < 5; i++) {
                    try {
                        await delay(5000);
                        const cekemail = await generatoremail(cacah[0], cacah[1]);
                        if (cekemail == undefined) {
                            console.log(`[${a}] Belum Ada Url Konfirmasi`);
                        } else {
                            const verifemail = await fetch(cekemail);
                            console.log(`[${a}] Success Konfirmasi Email\n`);
                            fs.appendFileSync('Account_Created.txt', `${email}|Raditya@123\n`);
                            break;
                        }
                    } catch (error) {
                        console.log(`[${a}] Gagal Konfirmasi Email\n`);
                        fs.appendFileSync('Account_Unverif.txt', `${email}|Raditya@123\n`);
                    }
                }
            } else {
                console.log(`[${a}] Gagal Regist Akun\n`);
            }
        } catch (error) {
            console.log(`[${a}] ${error.message}\n`)
        }
    }
})();