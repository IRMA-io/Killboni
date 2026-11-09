const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const payload=JSON.parse(fs.readFileSync('data/lgtbi.json','utf8'));
const ids=new Set();
for(const r of payload.records){
  assert(!ids.has(r.id),'Duplicate initiative');ids.add(r.id);
  for(const key of ['title','date','scope','type','topic','source','pages','summary','note','execution'])assert(typeof r[key]==='string'&&r[key].trim(),'Missing '+key);
  assert(new URL(r.source).hostname==='ajuntament.barcelona.cat','Expected municipal primary source');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(r.date));
  for(const p of Object.values(r.positions))assert(['support','against','unknown'].includes(p));
  if(r.type==='Prec')assert.equal(Object.keys(r.positions).length,0,'A request is not a group vote');
}
const script=fs.readFileSync('lgtbi.js','utf8');new vm.Script(script);
// Run the actual filtering functions independently of the browser and network.
const context={};vm.createContext(context);vm.runInContext(script.slice(0,script.indexOf('for(const id of [\'q\'')),context);
function filter(f){context.rows=payload.records;context.filters={q:'',scope:'',topic:'',type:'',party:'',position:'',...f};return vm.runInContext('filtered(rows,filters)',context);}
assert.equal(filter({}).length,4);
assert.equal(filter({party:'VOX',position:'against'}).length,2);
assert.equal(filter({party:'PP',position:'unknown',scope:'Ple municipal'}).length,1);
assert.equal(filter({party:'Junts',position:'proposer'}).length,1);
assert.equal(filter({q:'ocupacio'}).length,1);
assert.equal(filter({scope:'Ple municipal',party:'VOX',position:'against'}).length,0);
assert.equal(filter({q:'zzzinexistent'}).length,0);
console.log('OK: 4 sourced initiatives; filters preserve unknown positions and separate requests from votes.');
