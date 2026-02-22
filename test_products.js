const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('products.html', 'utf8');
const dom = new JSDOM(html, { 
    runScripts: 'dangerously', 
    resources: 'usable',
    url: "file://" + __dirname + "/products.html" 
});

dom.window.onerror = function(msg, file, line, col, error) {
    console.error("ERROR:", msg, "at", line + ":" + col);
};

setTimeout(() => {
    console.log("Ready state:", dom.window.document.readyState);
    const btn = dom.window.document.getElementById('navAuthBtn');
    if (btn) {
        console.log("Button found!");
        btn.click();
        const modal = dom.window.document.getElementById('authModal');
        console.log("Modal classes:", modal.className);
    } else {
        console.log("Button not found!");
    }
}, 2000);
