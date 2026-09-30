// Captura um HTML em 1080x1920: node tools/shot.js <arquivo.html?query> <saida.png> [overlay]
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [src,out,ov]=process.argv.slice(2);const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1920}});
const [f,q]=src.split('?');await p.goto('file://'+path.resolve(f)+(q?'?'+q:''));await p.evaluate(()=>document.fonts.ready);
if(ov) await p.addStyleTag({content:'body::after{content:"";position:fixed;left:0;right:0;top:0;height:150px;background:rgba(244,123,98,.25);z-index:99}body::before{content:"";position:fixed;left:0;right:0;bottom:0;height:250px;background:rgba(244,123,98,.25);z-index:99}'});
await p.screenshot({path:out});await b.close()})();
