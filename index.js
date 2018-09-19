const fs = require('fs');
const {JSDOM} = require('jsdom');
const request = require('request');
const url = 'http://saint-mary.net/bulletin'
const moment = require('moment');

request(url, (err, res, body) => {
  if (!err) {
    let VerseOfTheWeek = {};
    let ProverbOfTheWeek = {};
    const {document} = (new JSDOM(body)).window;
    const tables = document.body.getElementsByTagName('table');
    let verseRaw = tables[2].querySelectorAll('td .sectionText');
    let verseV = verseRaw[1].getElementsByTagName('i')[0].textContent.trim();;
    let author = verseRaw[1].textContent.replace(verseV, '').trim();
    let meaning = verseRaw[2].textContent.replace('Meaning:', '').trim();
    VerseOfTheWeek = {
      verse: verseV,
      author,
      meaning,
    };

    let verseW = verseRaw[3].getElementsByTagName('i')[0].textContent.trim();
    let proverbs = verseRaw[3].textContent.replace(verseW, '').trim();
    ProverbOfTheWeek = {
      verse: verseW,
      proverbs,
    };
    
    let schedule = tables[3].querySelectorAll('td .sectionText')[0].textContent.trim();
    const regex = /(.{0,}\s.\s.{0,}\n{0,})/gm;
    const rows = schedule.match(regex);
    const rowsCleared = {};
    let date = null;
    rows.forEach(e => {
      e = e.trim();
      e = e.replace(/(\(Tout\s\d{0,}\))|(\\t)|(\\n)/gm, '');
      e = e.replace(/\s{1,}/gm, ' ');
      if (Number.parseInt(e)) {
        let action = e.replace(/(\d{0,}:\d{0,}(am|pm)\s-\s\d{0,}:\d{0,}(am|pm)\s-\s)/, '');
        let time = e.replace(' - ' + action, '');
        rowsCleared[date].push({
          time,
          action,
        });
      } else {
        let number = Number.parseInt(e.replace(/\D/gm, ''));
        if (number) {
          date = moment().format('YYYY-MM') + '-' + number;
          rowsCleared[date] = [];
        }
      }
    })
    console.log(rowsCleared);

} else {
    console.log(err);
}
});
