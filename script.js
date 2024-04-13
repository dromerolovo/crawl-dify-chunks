//Copy and paste this script to the console, while in the following url path 
//Documents -> File name
//https://cloud.dify.ai/datasets/<uid>/documents/<uid>

//SCRIPT TO EXPORT THE CHUNKS TO A TXT FILE

async function hash(message) {
    const algorithm = 'SHA-256'
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
  
    const crypto = window.crypto || window.webkitCrypto;
    const subtle = crypto.subtle;
    const hashBuffer = await subtle.digest(algorithm, data);
  
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
}

let hashes = []
let content = []

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let listWrapper = document.querySelectorAll(".List")
let list = listWrapper[0]
for(let i = 1; i < 10; i++) {
    await getContentPerScroll(i)
}

let bufferString = ''
content.forEach(function(value) {bufferString += value + '\n\n\n\n'})

function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

downloadText('chunks.txt', bufferString)

async function getContentPerScroll(index) {
    list.scroll(0, 700 * index)
    await sleep(1000)
    let rows = list.children[0].children
    for(let row of rows) {
        await checkHash(row)
    }
    await sleep(1000)
}

async function checkHash(element) {
    var hashValue = await hash(element.textContent)
    if(!hashes.includes(hashValue)) {
        hashes.push(hashValue)
        await processItems(element.children)
        
    }
}

async function processItems(element) {
    for(var item of element) {
        await processItem(item)
    }
}

async function processItem(element) {
    content.push(element.children[1].textContent)
}



