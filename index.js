const fetch = require('node-fetch');
const cheerio = require('cheerio');
const readlineSync = require('readline-sync');

console.log(`\n
██████  ███████ ██████  ██    ██ ██████  ██      ██  ██████      ██████   ██████  
██   ██ ██      ██   ██ ██    ██ ██   ██ ██      ██ ██          ██       ██       
██████  █████   ██████  ██    ██ ██████  ██      ██ ██          ██   ███ ██   ███ 
██   ██ ██      ██      ██    ██ ██   ██ ██      ██ ██          ██    ██ ██    ██ 
██   ██ ███████ ██       ██████  ██████  ███████ ██  ██████      ██████   ██████  
                                                                                                                                                                   
\n`);

const user = readlineSync.question('[+] ID : ');
const pass = readlineSync.question('[+] PW : ');

// Login RGG
const login = () => new Promise((resolve, reject) => {
    const dataString = `$------WebKitFormBoundarydP5gBYaeAtrFGyKg\r\nContent-Disposition: form-data; name="_csrf-frontend"\r\n\r\nl6o_JGNLH5fkGhNAprpp6ju6Zyr5B4GUUW-TLevdXD392AYTLhNLro9vRxPRzy-iae0yX71A-doaCP1qpYwICw==\r\n------WebKitFormBoundarydP5gBYaeAtrFGyKg\r\nContent-Disposition: form-data; name="LoginForm[username]"\r\n\r\n${user}\r\n------WebKitFormBoundarydP5gBYaeAtrFGyKg\r\nContent-Disposition: form-data; name="LoginForm[password]"\r\n\r\n${pass}\r\n------WebKitFormBoundarydP5gBYaeAtrFGyKg--\r\n`;

    fetch('https://republic.gg/site/nav-bar-login', {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'X-CSRF-Token': 'l6o_JGNLH5fkGhNAprpp6ju6Zyr5B4GUUW-TLevdXD392AYTLhNLro9vRxPRzy-iae0yX71A-doaCP1qpYwICw==',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarydP5gBYaeAtrFGyKg',
            'Origin': 'https://republic.gg',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://republic.gg/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': '_ga=GA1.2.1558476888.1599325251; _fbp=fb.1.1599325251961.1517356121; _gid=GA1.2.446934674.1600092387; _csrf-frontend=152d4836feb91672a1f4234a68d353867ab54b66eef4d0685d254f85d346303ba%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22jr97MXT9kuTSwuFHRWUuDGxNKgnGNQT6%22%3B%7D; advanced-frontend=v65tvfnjplsv7iorqp7rb69vg4'
        },
        body: dataString
    })
    .then(async res => {
        newresult = {
            cookie: res.headers.raw()['set-cookie'],
            body: await res.json()
        }
        resolve(newresult)
    })
    .catch(err => {
        reject(err)
    })
});

// Get Info
const getinfo = (newcookie) => new Promise((resolve, reject) => {
    fetch('https://republic.gg/user/index', {
        method: 'GET',
        headers: {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Referer': 'https://republic.gg/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': newcookie
            }
    })
    .then(res => res.text())
    .then(res => {
        const $ = cheerio.load(res);
        const nm = $('div.text-truncate').text();
        const lv = $('small.d-block').text(); // Get Level Info
        const gg = $('span#gg_balance').text(); // Get Balance GG Info
        const gr = $('span#gr_balance').text(); // Get Balance GR Info
        resolve(`\n${nm} |${lv} | ${gg} GG | ${gr} GR`)
    })
    .catch(err => {
        reject(err)
    })
});

(async () => {
    const resultlogin = await login();
    const cookie = resultlogin.cookie;
    const advanced = cookie[0].split(';')[0];
    const ident = cookie[1].split(';')[0];
    const csrf = cookie[2].split(';')[0];
    const newcookie = `${advanced}; ${ident}; ${csrf}`;
    const resultgetinfo = await getinfo(newcookie);
    console.log(resultgetinfo);
})();