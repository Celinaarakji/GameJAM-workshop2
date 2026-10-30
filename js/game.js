"use strict";
// One connected floor; numbered gates connect the three arcade sectors.
const floor = [
  "#####################",
  "#.....#......#......#",
  "#.#...#..##..#..##..#",
  "#.#...#......#......#",
  "#...#.1..#...2..#...#",
  "#...#.#..#...#..#...#",
  "#.....#......#......#",
  "###.#.#.###..#..###.#",
  "#.....#......#......#",
  "#.#...#..#...#..#...#",
  "#.#...#..#...#..#...#",
  "#.....#......#......#",
  "#.....#......#......#",
  "#####################"
];
const objects = { terminal: {x:4,y:2}, key:{x:8,y:9}, scanner:{x:11,y:3}, panel:{x:16,y:10}, exit:{x:19,y:2} };
const accessWords = ["BYTE", "CODE", "FREE"];
let state;
const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const tile = 40, offsetY = 28;
function freshState() {
  return {player:{x:2,y:11}, inventory:{key:false}, keyVisible:true,
    systems:{movement:false,inventory:false,security:false}, started:false, won:false, codes:[]};
}
function say(text) { document.getElementById("message").textContent = text; }
function canEnter(x,y) {
  const cell = floor[y] && floor[y][x];
  if (!cell || cell === "#") return false;
  if (cell === "1" && !state.systems.movement) return false;
  if (cell === "2" && !state.systems.inventory) return false;
  return !Object.values(objects).some(obj => obj !== objects.key && obj.x === x && obj.y === y);
}
function updateUI() {
  const names = ["movement","inventory","security"];
  document.getElementById("count").textContent = names.filter(n=>state.systems[n]).length + "/3";
  document.querySelectorAll("#systems li").forEach((li,i)=>{
    li.classList.toggle("online",state.systems[names[i]]);
    li.querySelector("span").textContent = state.systems[names[i]] ? state.codes[i] : "OFFLINE";
  });
  document.getElementById("inventory").textContent = hasKey(state) ? "SECURITY KEY" : "EMPTY";
  document.getElementById("objective").textContent = !state.systems.movement ? "Activate M to open the first gate." :
    !state.systems.inventory ? "Collect the key, then press E beside I." :
    !state.systems.security ? "Press E beside S to authorize the exit." : "Reach the exit. Enter your access words.";
  draw();
}
function restore(name,index) {
  if (state.systems[name]) { say("System online. Access code " + (index+1) + ": " + state.codes[index] + "."); return; }
  state.systems[name] = true;
  state.codes[index] = accessWords[index];
  say(name[0].toUpperCase()+name.slice(1)+" system restored. Access code "+(index+1)+": "+state.codes[index]+". "+["First gate open: cross the passage in the right wall.","Second gate open: cross into security.","Exit authorized: find the door marked ↗."][index]);
  updateUI();
}
function interact() {
  const nearby = Object.entries(objects).find(([name,p])=>name!=="key" && Math.abs(p.x-state.player.x)+Math.abs(p.y-state.player.y)===1);
  if (!nearby) {say("No connection in range. Stand beside a glowing terminal or the exit."); return;}
  const name = nearby[0];
  if(name==="terminal") restore("movement",0);
  if(name==="scanner") {
    if(!state.systems.movement) say("ACCESS DENIED: Previous system offline.");
    else if(!hasKey(state)) say("ACCESS DENIED: Required inventory item not detected.");
    else restore("inventory",1);
  }
  if(name==="panel") {
    if(canAuthorize(state)) restore("security",2);
    else say("ACCESS DENIED: Security validation failed. Check system status.");
  }
  if(name==="exit") {
    if(!state.systems.security) say("EXIT SEALED: Security authorization required.");
    else document.getElementById("exitDialog").showModal();
  }
}
function draw() {
  ctx.fillStyle="#080e1b"; ctx.fillRect(0,0,840,616);
  ctx.font="10px monospace";ctx.textAlign="center";
  ["01 / INPUT BAY","02 / STORAGE","03 / SECURITY"].forEach((s,i)=>{ctx.fillStyle="#8598b5";ctx.fillText(s,[140,400,680][i],18);});
  floor.forEach((row,y)=>[...row].forEach((cell,x)=>{
    const px=x*tile,py=y*tile+offsetY;
    ctx.fillStyle=cell==="#"?"#1e2b47":"#0e1829";ctx.fillRect(px+1,py+1,38,38);
    if(cell==="#"){ctx.fillStyle="#33456b";ctx.fillRect(px+1,py+1,38,3);ctx.fillStyle="#152039";ctx.fillRect(px+6,py+10,28,21);}
    else {ctx.fillStyle="#233149";ctx.fillRect(px+18,py+18,2,2);}
    if(cell==="1"||cell==="2"){
      const open=cell==="1"?state.systems.movement:state.systems.inventory;
      ctx.fillStyle=open?"#5de5bb":"#c289ff";
      if(open){ctx.fillRect(px+3,py+3,34,3);ctx.fillRect(px+3,py+34,34,3);}
      else for(let j=0;j<3;j++)ctx.fillRect(px+7+j*10,py+5,5,30);
    }
  }));
  Object.entries(objects).forEach(([name,p])=>{
    if(name==="key"&&!state.keyVisible)return;
    const x=p.x*40,y=p.y*40+offsetY;
    const active=name==="terminal"?state.systems.movement:name==="scanner"?state.systems.inventory:name==="panel"||name==="exit"?state.systems.security:false;
    const color=name==="key"?"#ffd479":active?"#a8ff86":"#63f4f0";
    ctx.shadowColor=color;ctx.shadowBlur=12;ctx.fillStyle=color;
    if(name==="key"){ctx.fillRect(x+10,y+12,12,12);ctx.clearRect(x+14,y+16,4,4);ctx.fillRect(x+19,y+19,13,5);ctx.fillRect(x+27,y+21,5,9);}
    else {ctx.fillRect(x+7,y+5,26,30);ctx.shadowBlur=0;ctx.fillStyle="#13233a";ctx.fillRect(x+10,y+8,20,17);ctx.fillStyle=color;ctx.font="bold 14px monospace";ctx.fillText(name==="exit"?"↗":name==="terminal"?"M":name==="scanner"?"I":"S",x+20,y+22);ctx.fillRect(x+13,y+29,14,2);}
    ctx.shadowBlur=0;
  });
  const x=state.player.x*40,y=state.player.y*40+offsetY;
  ctx.fillStyle="#050a14";ctx.fillRect(x+8,y+32,25,4);
  ctx.shadowColor="#c289ff";ctx.shadowBlur=14;ctx.fillStyle="#c289ff";ctx.fillRect(x+11,y+13,18,18);ctx.fillRect(x+8,y+7,24,15);ctx.shadowBlur=0;
  ctx.fillStyle="#e7ddff";ctx.fillRect(x+11,y+5,18,5);ctx.fillStyle="#092236";ctx.fillRect(x+11,y+12,18,6);ctx.fillStyle="#63f4f0";ctx.fillRect(x+14,y+13,4,3);ctx.fillRect(x+23,y+13,4,3);ctx.fillStyle="#7760ab";ctx.fillRect(x+11,y+31,6,4);ctx.fillRect(x+23,y+31,6,4);
}
function resetRun() {
  document.querySelectorAll("dialog[open]").forEach(d=>d.close());
  state=freshState();state.started=true;
  document.getElementById("codes").reset();document.getElementById("codeError").textContent="";
  say("Find the terminal marked M. Stand beside it and press E or Enter to open the first gate.");updateUI();canvas.focus();
}
document.addEventListener("keydown",event=>{
  if(!state.started||state.won||document.querySelector("dialog[open]"))return;
  if(/INPUT|BUTTON|TEXTAREA/.test(event.target.tagName))return;
  const key=event.key.length===1?event.key.toLowerCase():event.key;
  const direction=movementFor(key);
  if(direction){event.preventDefault();if(movePlayer(state,direction,canEnter)){
    if(state.keyVisible&&state.player.x===objects.key.x&&state.player.y===objects.key.y){collectKey(state);say("Key collected. Take it to the scanner marked I.");}
    updateUI();
  } else {
    const cell = floor[state.player.y + direction[1]]?.[state.player.x + direction[0]];
    if(cell === "1" && !state.systems.movement) say("GATE LOCKED: Stand beside M and press E or Enter to activate it.");
    if(cell === "2" && !state.systems.inventory) say("GATE LOCKED: Collect the key, then stand beside I and press E or Enter.");
  }}else if(key==="e"||key==="Enter"){event.preventDefault();if(!event.repeat)interact();}
});
document.getElementById("start").onclick=resetRun;
document.getElementById("reset").onclick=resetRun;
document.getElementById("again").onclick=resetRun;
document.getElementById("closeExit").onclick=()=>{document.getElementById("exitDialog").close();canvas.focus();};
document.getElementById("exitDialog").addEventListener("close",()=>canvas.focus());
document.getElementById("intro").addEventListener("cancel",e=>e.preventDefault());
document.getElementById("victory").addEventListener("cancel",e=>e.preventDefault());
document.getElementById("codes").onsubmit=event=>{
  event.preventDefault();const values=[...document.querySelectorAll("#codes input")].map(el=>el.value);
  if(!state.systems.security||!validateCodes(values,state.codes)){document.getElementById("codeError").textContent="ACCESS DENIED: Access words do not match.";return;}
  state.won=true;document.getElementById("exitDialog").close();document.getElementById("victory").showModal();
};
document.getElementById("mode").textContent=location.protocol==="file:"?"LOCAL COPY / Edit your source, save, then reload this page to test. Reload resets your run.":"HOSTED DEMO / Download the source and open index.html locally to test your own fixes. This page will not reflect your local edits.";
state=freshState();updateUI();document.getElementById("intro").showModal();
