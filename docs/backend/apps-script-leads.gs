/**
 * barumahID — penerima form website ke "barumahID — CRM Master".
 *
 * Pasang di spreadsheet CRM Master: Extensions > Apps Script, tempel seluruh file ini,
 * lalu ikuti docs/backend/README.md (Script Properties + Deploy sebagai Web App).
 *
 * Cara kerja:
 * - Website (API route /api/leads) mengirim JSON: { secret, role, sheet, fields, meta }.
 * - Skrip mencocokkan nama field dengan judul kolom di baris 1 sheet tujuan, lalu menambah 1 baris.
 * - Field yang tidak punya kolom dimasukkan ke kolom Catatan supaya tidak hilang.
 * - Notifikasi dikirim ke email admin, dan ke WhatsApp kalau token Fonnte diisi.
 *
 * Script Properties yang dipakai:
 *   WEBHOOK_SECRET   wajib, sama dengan LEADS_WEBHOOK_SECRET di Vercel
 *   NOTIFY_EMAIL     opsional, email penerima notifikasi (pisahkan koma untuk lebih dari satu)
 *   FONNTE_TOKEN     opsional, token WhatsApp gateway Fonnte
 *   NOTIFY_WA        opsional, nomor WA admin penerima notifikasi, format 628xxxx
 *   SPREADSHEET_ID   opsional, isi kalau skrip ini tidak menempel di spreadsheet CRM Master
 */

var ROLE_LABEL = {
  'konsultasi': 'Konsultasi konstruksi',
  'customer-rto': 'Calon customer RTO',
  'penyedia-kos': 'Penyedia kos / rumah sewa',
  'developer': 'Developer mitra',
  'kontraktor': 'Kontraktor / mandor',
  'tenaga-kerja': 'Tenaga kerja konstruksi',
  'supplier': 'Supplier material',
  'projectlink': 'Freelancer Projectlink',
  'knowledges': 'Mitra Knowledges',
  'pesan': 'Pesan website'
};

// Sheet yang boleh ditulis. Harus sama dengan `sheet` di src/lib/leads.ts.
var ALLOWED_SHEETS = [
  '📋 Leads Konstruksi',
  '🏠 Customer RTO',
  '🏡 Penyedia Kos',
  '🏗️ Developer Mitra',
  '👷 Mitra Kontraktor',
  '🔧 Mitra Supplier',
  '🎓 Mitra Projectlink',
  '🏫 Mitra Knowledges',
  '💬 Pesan Website'
];

// Sheet baru yang dibuat otomatis kalau belum ada.
var NEW_SHEET_HEADERS = {
  '💬 Pesan Website': ['Timestamp', 'Status', 'Nama', 'WA', 'Email', 'Keperluan', 'Pesan', 'Halaman', 'Next Action']
};

function doGet() {
  return jsonOut({ ok: true, service: 'barumahID leads', time: new Date().toISOString() });
}

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('WEBHOOK_SECRET');

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'bad_json' });
  }

  if (!secret || body.secret !== secret) {
    return jsonOut({ ok: false, error: 'unauthorized' });
  }
  if (ALLOWED_SHEETS.indexOf(body.sheet) === -1) {
    return jsonOut({ ok: false, error: 'unknown_sheet' });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return jsonOut({ ok: false, error: 'busy' });
  }

  try {
    var ss = getSpreadsheet(props);
    var sheet = ss.getSheetByName(body.sheet);
    if (!sheet) {
      var headersNew = NEW_SHEET_HEADERS[body.sheet];
      if (!headersNew) return jsonOut({ ok: false, error: 'sheet_missing' });
      sheet = ss.insertSheet(body.sheet);
      sheet.getRange(1, 1, 1, headersNew.length).setValues([headersNew]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
      return String(h).trim();
    });

    var fields = body.fields || {};
    var meta = body.meta || {};
    var used = {};
    var row = headers.map(function (h) {
      if (h === 'Timestamp') return new Date();
      if (h === 'Status') return 'Baru';
      if (h === 'Halaman') return meta.page || '';
      if (Object.prototype.hasOwnProperty.call(fields, h)) {
        used[h] = true;
        return asCell(h, fields[h]);
      }
      return '';
    });

    // Field tanpa kolom masuk ke kolom catatan supaya tidak hilang.
    var leftovers = Object.keys(fields).filter(function (k) {
      return !used[k];
    });
    if (leftovers.length) {
      var noteIdx = indexOfFirst(headers, ['Catatan', 'Catatan Lead', 'Catatan Follow-up']);
      var extra = leftovers
        .map(function (k) {
          return k + ': ' + fields[k];
        })
        .join('\n');
      if (noteIdx > -1) {
        row[noteIdx] = row[noteIdx] ? row[noteIdx] + '\n' + extra : extra;
      }
    }

    sheet.appendRow(row);
    notify(props, body);
    return jsonOut({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonOut({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

function getSpreadsheet(props) {
  var id = props.getProperty('SPREADSHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

// Nomor WA disimpan sebagai teks supaya tidak berubah jadi angka/format ilmiah.
function asCell(header, value) {
  var v = value === undefined || value === null ? '' : String(value);
  if (/^(WA|WA Customer|No HP)$/i.test(header) && v) return "'" + v;
  // Cegah formula injection dari isian pengunjung.
  if (/^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function indexOfFirst(headers, names) {
  for (var i = 0; i < names.length; i++) {
    var idx = headers.indexOf(names[i]);
    if (idx > -1) return idx;
  }
  return -1;
}

function notify(props, body) {
  var label = ROLE_LABEL[body.role] || body.role;
  var f = body.fields || {};
  var who = f['Nama'] || f['Developer'] || f['Nama Usaha'] || f['Institusi'] || '-';
  var lines = Object.keys(f).map(function (k) {
    return k + ': ' + f[k];
  });
  var text = 'Form baru dari website barumahID\n' + label + ' - ' + who + '\n\n' + lines.join('\n') +
    '\n\nHalaman: ' + ((body.meta && body.meta.page) || '-') + '\nSheet: ' + body.sheet;

  var email = props.getProperty('NOTIFY_EMAIL');
  if (email) {
    try {
      MailApp.sendEmail(email, '[barumahID] ' + label + ': ' + who, text);
    } catch (err) {
      console.error('email gagal: ' + err);
    }
  }

  var token = props.getProperty('FONNTE_TOKEN');
  var target = props.getProperty('NOTIFY_WA');
  if (token && target) {
    try {
      UrlFetchApp.fetch('https://api.fonnte.com/send', {
        method: 'post',
        headers: { Authorization: token },
        payload: { target: target, message: text },
        muteHttpExceptions: true
      });
    } catch (err) {
      console.error('WA gagal: ' + err);
    }
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Jalankan manual sekali dari editor untuk uji tulis ke sheet tanpa lewat website. */
function testTulis() {
  var props = PropertiesService.getScriptProperties();
  var fake = {
    postData: {
      contents: JSON.stringify({
        secret: props.getProperty('WEBHOOK_SECRET'),
        role: 'pesan',
        sheet: '💬 Pesan Website',
        fields: { Nama: 'Uji Coba', WA: '6280000000000', Keperluan: 'Lainnya', Pesan: 'Tes dari editor Apps Script' },
        meta: { page: '/kontak' }
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
