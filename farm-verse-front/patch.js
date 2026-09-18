const fs = require('fs');
const path = require('path');

const srcDir = 'e:\\InfosysProject\\farm-verse-front\\src\\Components';

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        if (!--pending) callback(null);
                    });
                } else {
                    if (file.endsWith('.jsx')) {
                        processFile(file);
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // 1. Strip the large linear-gradient background from the root div wrapper
    const styleBlockPattern = /style=\{\{[\s\S]*?linear-gradient[\s\S]*?100vh[\s\S]*?\}\}/g;
    if (content.match(styleBlockPattern)) {
        if (content.includes('className="login-container"')) {
            content = content.replace(styleBlockPattern, '');
        } else {
            // Add realtime-container className to the main wrapper
            content = content.replace(/<div\s+style=\{\{[\s\S]*?linear-gradient[\s\S]*?100vh[\s\S]*?\}\}\s*>/g, '<div className="realtime-container">');
        }
    }

    // 2. Remove inline glassmorphism styles on the main container
    content = content.replace(/className="farmer-menu-container"\s+style=\{\{[\s\S]*?maxWidth:\s*'1200px'\s*\}\}/g, 'className="farmer-menu-container"');
    
    // 3. Remove inline styles on dashboard cards
    content = content.replace(/className="dashboard-card"\s+style=\{\{[\s\S]*?\}\}/g, 'className="dashboard-card"');
    
    // 4. Remove inline styles on headers/titles
    content = content.replace(/style=\{\{\s*textAlign:\s*'center',\s*marginBottom:\s*'40px'\s*\}\}/g, '');
    content = content.replace(/style=\{\{\s*color:\s*'#[0-9a-fA-F]+'[\s\S]*?\}\}/g, '');
    content = content.replace(/style=\{\{\s*color:\s*'#1e293b',\s*fontWeight:\s*'600'\s*\}\}/g, '');
    content = content.replace(/style=\{\{\s*fontSize:\s*'2.5rem'[\s\S]*?\}\}/g, '');
    
    // 5. Remove random backgrounds inside cards
    content = content.replace(/style=\{\{\s*background:\s*'rgba.*?\}\}/g, '');
    content = content.replace(/style=\{\{background:\s*'rgba\(255,255,255,0.9\)'\}\}/g, '');

    // 6. Clean up inline styles on spans/divs left behind
    content = content.replace(/style=\{\{\s*fontWeight:\s*'600'\s*\}\}/g, '');
    content = content.replace(/style=\{\{\s*fontWeight:\s*'700',\s*color:\s*'#059669'\s*\}\}/g, '');
    content = content.replace(/style=\{\{\s*fontWeight:\s*'600',\s*color:\s*'#0f172a'\s*\}\}/g, '');

    // For any remaining empty style attributes
    content = content.replace(/style=\{\{\s*\}\}/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated: " + file);
    }
}

walk(srcDir, (err) => {
    if(err) console.error(err);
    console.log("Done");
});
