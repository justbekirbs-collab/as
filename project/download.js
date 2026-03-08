const fs = require('fs');
fetch('https://raw.githubusercontent.com/justbekirbs-collab/justbekirsgame/main/App.tsx')
  .then(r => r.text())
  .then(t => fs.writeFileSync('downloaded_app.tsx', t));
