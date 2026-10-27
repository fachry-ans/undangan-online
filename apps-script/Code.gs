const SPREADSHEET_ID = '1fakjb_1bk5JJkQQEruX2Shwo8Z8BdA4bMDQNImtZy4w';
const SHEETS = {
  weddings: { name: 'Weddings', headers: ['id', 'slug', 'title', 'status', 'weddingDate', 'viewsCount', 'data', 'updatedAt'] },
  guests: { name: 'Guests', headers: ['id', 'weddingId', 'name', 'phone', 'groupName', 'relationship', 'maxAttendance', 'invitationStatus', 'rsvpStatus', 'updatedAt'] },
  rsvps: { name: 'RSVPs', headers: ['id', 'weddingId', 'guestId', 'name', 'attendance', 'guestCount', 'city', 'createdAt'] },
  wishes: { name: 'Wishes', headers: ['id', 'weddingId', 'guestName', 'attendance', 'message', 'createdAt', 'isPinned'] },
  config: { name: 'Config', headers: ['key', 'value'] },
};

function setupDatabase() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (key) {
    const definition = SHEETS[key];
    let sheet = spreadsheet.getSheetByName(definition.name);
    if (!sheet && definition.name === 'Weddings' && spreadsheet.getSheets().length === 1) {
      const first = spreadsheet.getSheets()[0];
      if (first.getName() === 'Sheet1' && first.getLastRow() === 0) {
        first.setName(definition.name);
        sheet = first;
      }
    }
    if (!sheet) sheet = spreadsheet.insertSheet(definition.name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, definition.headers.length).setValues([definition.headers]);
      sheet.setFrozenRows(1);
    } else {
      const current = sheet.getRange(1, 1, 1, definition.headers.length).getDisplayValues()[0];
      if (definition.headers.some(function (header, index) { return current[index] !== header; })) {
        throw new Error('Header tidak cocok di tab ' + definition.name + '. Data tidak diubah.');
      }
    }
  });
  Logger.log('Tab Weddings, Guests, RSVPs, Wishes, dan Config sudah siap.');
}

function setAdminKey() {
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!key) throw new Error('Set ADMIN_KEY di Setelan Project > Properti Skrip terlebih dahulu.');
  Logger.log('ADMIN_KEY sudah tersimpan di Script Properties.');
}

function doGet(e) {
  const action = String((e.parameter && e.parameter.action) || '');
  const callback = String((e.parameter && e.parameter.callback) || '');
  let result;
  try {
    if (action === 'authorize') {
      result = { ok: true, authorized: isAdminKeyValid_(e.parameter.key) };
    } else if (action === 'snapshot') {
      result = readSnapshot_(String(e.parameter.weddingId || ''), isAdminKeyValid_(e.parameter.key));
    } else {
      throw new Error('Aksi tidak dikenal.');
    }
  } catch (error) {
    result = { ok: false, error: String(error.message || error) };
  }
  const json = JSON.stringify(result);
  if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const request = JSON.parse((e.postData && e.postData.contents) || '{}');
    result = handleMutation_(request);
  } catch (error) {
    result = { ok: false, error: String(error.message || error) };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleMutation_(request) {
  const action = String(request.action || '');
  const data = request.data || {};
  const publicActions = ['submitRSVP', 'submitWish', 'incrementViews'];
  if (publicActions.indexOf(action) < 0 && !isAdminKeyValid_(request.adminKey)) {
    throw new Error('Kunci admin tidak valid.');
  }
  if (publicActions.indexOf(action) >= 0 && data.weddingId !== 'wed-abdi-lula') {
    throw new Error('ID undangan tidak valid.');
  }
  if (action === 'submitRSVP') {
    if (!String(data.name || '').trim() || String(data.name).length > 120 ||
      ['hadir', 'tidak_hadir', 'masih_ragu'].indexOf(data.attendance) < 0 ||
      !Number.isInteger(Number(data.guestCount)) || Number(data.guestCount) < 0 ||
      Number(data.guestCount) > 4 || String(data.city || '').length > 120) {
      throw new Error('Data RSVP tidak valid.');
    }
  }
  if (action === 'submitWish' && (
    !String(data.guestName || '').trim() || String(data.guestName).length > 120 ||
    !String(data.message || '').trim() || String(data.message).length > 2000 ||
    ['hadir', 'tidak_hadir', 'masih_ragu'].indexOf(data.attendance) < 0
  )) throw new Error('Data ucapan tidak valid.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (action === 'syncAll') {
      if (!data.wedding) throw new Error('Data wedding tidak ditemukan.');
      upsertWedding_(data.wedding);
      (data.guests || []).forEach(function (item) { upsertRecord_('guests', item, guestRow_); });
      (data.rsvps || []).forEach(function (item) { upsertRecord_('rsvps', item, rsvpRow_); });
      (data.wishes || []).forEach(function (item) { upsertRecord_('wishes', item, wishRow_); });
    } else if (action === 'saveWedding') upsertWedding_(data);
    else if (action === 'saveGuest') upsertRecord_('guests', data, guestRow_);
    else if (action === 'deleteGuest') deleteRecord_('guests', data.id);
    else if (action === 'submitRSVP') {
      upsertRecord_('rsvps', data, rsvpRow_);
      updateGuestRSVP_(data);
    } else if (action === 'submitWish') upsertRecord_('wishes', data, wishRow_);
    else if (action === 'deleteWish') deleteRecord_('wishes', data.id);
    else if (action === 'incrementViews') incrementViews_(data.weddingId);
    else throw new Error('Aksi tidak dikenal.');
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function readSnapshot_(weddingId, includePrivateData) {
  const weddings = readRows_('weddings').map(function (row) {
    try { return JSON.parse(row.data); } catch (error) { throw new Error('Data wedding tidak valid di spreadsheet.'); }
  });
  const wedding = weddings.find(function (item) { return item.id === weddingId || item.slug === weddingId; }) || null;
  const resolvedId = wedding ? wedding.id : weddingId;
  return {
    ok: true,
    wedding: wedding,
    guests: includePrivateData
      ? readRows_('guests').filter(function (row) { return row.weddingId === resolvedId; })
      : [],
    rsvps: readRows_('rsvps').filter(function (row) { return row.weddingId === resolvedId; })
      .map(function (row) {
        return includePrivateData ? row : {
          id: row.id,
          weddingId: row.weddingId,
          attendance: row.attendance,
          guestCount: 0,
          createdAt: row.createdAt,
        };
      }),
    wishes: readRows_('wishes').filter(function (row) { return row.weddingId === resolvedId; }),
  };
}

function upsertWedding_(wedding) {
  if (!wedding.id || !wedding.slug) throw new Error('Wedding ID dan slug wajib diisi.');
  const row = [safeText_(wedding.id), safeText_(wedding.slug), safeText_(wedding.title), safeText_(wedding.status), safeText_(wedding.weddingDate),
    Number(wedding.viewsCount) || 0, JSON.stringify(wedding), new Date().toISOString()];
  upsertRow_('weddings', wedding.id, row);
}

function upsertRecord_(key, record, rowFactory) {
  if (!record.id || !record.weddingId) throw new Error('Record ID dan weddingId wajib diisi.');
  upsertRow_(key, record.id, rowFactory(record));
}

function upsertRow_(key, id, row) {
  const sheet = getSheet_(key);
  const values = sheet.getDataRange().getValues();
  const rowIndex = values.findIndex(function (item, index) { return index > 0 && String(item[0]) === String(id); });
  if (rowIndex < 0) sheet.appendRow(row);
  else sheet.getRange(rowIndex + 1, 1, 1, row.length).setValues([row]);
}

function deleteRecord_(key, id) {
  if (!id) throw new Error('Record ID wajib diisi.');
  const sheet = getSheet_(key);
  const values = sheet.getDataRange().getValues();
  const rowIndex = values.findIndex(function (item, index) { return index > 0 && String(item[0]) === String(id); });
  if (rowIndex >= 0) sheet.deleteRow(rowIndex + 1);
}

function incrementViews_(weddingId) {
  const rows = readRows_('weddings');
  const weddingRow = rows.find(function (row) { return row.id === weddingId; });
  if (!weddingRow) return;
  const wedding = JSON.parse(weddingRow.data);
  wedding.viewsCount = (Number(wedding.viewsCount) || 0) + 1;
  upsertWedding_(wedding);
}

function updateGuestRSVP_(rsvp) {
  const name = String(rsvp.name || '').trim().toLowerCase();
  const guest = readRows_('guests').find(function (item) {
    return item.weddingId === rsvp.weddingId && String(item.name).trim().toLowerCase() === name;
  });
  if (guest) {
    guest.rsvpStatus = rsvp.attendance;
    guest.updatedAt = new Date().toISOString();
    upsertRecord_('guests', guest, guestRow_);
  }
}

function readRows_(key) {
  const sheet = getSheet_(key);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter(function (row) { return row.some(function (cell) { return cell !== ''; }); })
    .map(function (row) {
      return headers.reduce(function (record, header, index) {
        record[header] = row[index];
        return record;
      }, {});
    });
}

function getSheet_(key) {
  const definition = SHEETS[key];
  if (!definition) throw new Error('Tab tidak dikenal.');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(definition.name);
  if (!sheet) throw new Error('Tab ' + definition.name + ' belum dibuat. Jalankan setupDatabase terlebih dahulu.');
  return sheet;
}

function isAdminKeyValid_(candidate) {
  const stored = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  return Boolean(stored && candidate && candidate === stored);
}

function guestRow_(item) {
  return [safeText_(item.id), safeText_(item.weddingId), safeText_(item.name), safeText_(item.phone || ''),
    safeText_(item.groupName || ''), safeText_(item.relationship || ''), Number(item.maxAttendance) || 1,
    safeText_(item.invitationStatus || 'sent'), safeText_(item.rsvpStatus || 'pending'), new Date().toISOString()];
}

function rsvpRow_(item) {
  return [safeText_(item.id), safeText_(item.weddingId), safeText_(item.guestId || ''), safeText_(item.name),
    safeText_(item.attendance), Number(item.guestCount) || 0, safeText_(item.city || ''),
    item.createdAt || new Date().toISOString()];
}

function wishRow_(item) {
  return [safeText_(item.id), safeText_(item.weddingId), safeText_(item.guestName), safeText_(item.attendance),
    safeText_(item.message), item.createdAt || new Date().toISOString(),
    Boolean(item.isPinned)];
}

function safeText_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}
