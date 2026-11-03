// KILLONI: automated integrity checks, no network or external dependencies.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const rows = JSON.parse(fs.readFileSync('data/votes.json','utf8'));
assert(Array.isArray(rows),'The data file must be an array');
const ids = new Set();
const allowed = new Set(['yes','no','abstain','absent','not_recorded']);
for (const [i,r] of rows.entries()) {
  const tag = 'row '+(i+1);
  for(const k of ['id','title','institution','topic','source_document','source_url','date'])
    assert(typeof r[k]==='string' && r[k].trim(),tag+': missing '+k);
  assert(['approved','approved_amended','rejected'].includes(r.outcome),tag+': invalid or missing outcome');
  assert(Number.isInteger(r.source_page) && r.source_page>0,tag+': missing act page');
  assert(!ids.has(r.id),tag+': duplicate id');
  ids.add(r.id);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(r.date) && !Number.isNaN(Date.parse(r.date)),tag+': invalid date');
  assert(/Ajuntament de Barcelona|Consell Municipal|Barcelona/.test(r.institution),tag+': not a Barcelona municipal record');
  assert(new URL(r.source_url).protocol==='https:',tag+': source must be HTTPS');
  assert(Array.isArray(r.party_votes),tag+': party_votes must be an array');
  if(r.totals) {
    for(const k of ['yes','no','abstain']) assert(Number.isInteger(r.totals[k]) && r.totals[k]>=0,tag+': invalid '+k);
    assert(r.totals.yes+r.totals.no+r.totals.abstain<=41,tag+': more than 41 votes recorded');
  }
  const names = new Set();
  for(const v of r.individual_votes||[]) {
    assert(typeof v.name==='string' && v.name.trim() && allowed.has(v.position),tag+': invalid named vote');
    assert(!names.has(v.name),tag+': duplicate councillor '+v.name);
    names.add(v.name);
  }
  for(const v of r.party_votes) {
    assert(typeof v.party==='string' && v.party.trim() && allowed.has(v.position),tag+': invalid party vote');
    assert(typeof v.source_url==='string' && new URL(v.source_url).protocol==='https:',tag+': missing party-vote evidence');
  }
  if(r.totals) for(const [position,key] of [['yes','yes'],['no','no'],['abstain','abstain']]) {
    assert((r.individual_votes||[]).filter(v=>v.position===position).length<=r.totals[key],tag+': named votes exceed recorded total');
  }
}
console.log('OK: '+rows.length+' Barcelona municipal records pass structural integrity checks.');
