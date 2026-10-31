/* Client-only PDF export. Canvas preserves native Hebrew shaping and bidi layout. */
async function buildBesteventPdf(report){
  if(document.fonts?.ready)await document.fonts.ready;
  const width=1240,height=1754,margin=56,tableWidth=width-margin*2,lineHeight=29;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('הדפדפן אינו תומך ביצירת PDF');
  const pages=[];let y=0,page=0;
  const fractions=report.headers.length===5?[.23,.15,.24,.23,.15]:report.headers.map(()=>1/report.headers.length);
  const widths=fractions.map(v=>v*tableWidth);
  function wrap(value,maxWidth){
    const words=String(value??'').split(/\s+/u),lines=[];let line='';
    for(const word of words){if(ctx.measureText(word).width>maxWidth){if(line){lines.push(line);line='';}let part='';for(const char of Array.from(word)){if(part&&ctx.measureText(part+char).width>maxWidth){lines.push(part);part='';}part+=char;}line=part;continue;}
      if(line&&ctx.measureText(line+' '+word).width>maxWidth){lines.push(line);line=word;}else line+=(line?' ':'')+word;
    }if(line||!lines.length)lines.push(line);return lines;
  }
  function row(values,header=false,index=0){
    ctx.font=(header?'600 ':'400 ')+'21px Arial';
    const lines=values.map((v,i)=>wrap(v,widths[i]-24));
    const h=Math.max(56,Math.max(...lines.map(l=>l.length))*lineHeight+24);
    if(!header&&y+h>height-100){finishPage();startPage();}
    ctx.fillStyle=header?'#dfcbbb':index%2?'#f7f3eb':'#fffdfa';ctx.fillRect(margin,y,tableWidth,h);
    let right=width-margin;
    values.forEach((_,i)=>{ctx.strokeStyle='#d4bdaa';ctx.lineWidth=1;ctx.strokeRect(right-widths[i],y,widths[i],h);ctx.fillStyle=header?'#442719':'#442719';ctx.textAlign='right';ctx.direction='rtl';ctx.font=(header?'600 ':'400 ')+'21px Arial';lines[i].forEach((line,j)=>ctx.fillText(line,right-12,y+28+j*lineHeight));right-=widths[i];});y+=h;
  }
  function startPage(){page++;ctx.fillStyle='#f0e9dd';ctx.fillRect(0,0,width,height);ctx.fillStyle='#fffdfa';ctx.fillRect(margin-16,32,tableWidth+32,height-90);ctx.direction='ltr';ctx.textAlign='left';ctx.fillStyle='#442719';ctx.font='36px Georgia';ctx.fillText('BESTEVENT',margin,90);ctx.fillStyle='#76513b';ctx.fillRect(margin,113,tableWidth,2);ctx.direction='rtl';ctx.textAlign='right';ctx.fillStyle='#442719';ctx.font='600 30px Arial';const titles=wrap(report.title,tableWidth);titles.forEach((line,i)=>ctx.fillText(line,width-margin,164+i*38));y=184+(titles.length-1)*38;ctx.font='20px Arial';ctx.fillStyle='#765744';ctx.fillText(report.rows.length+' רשומות · מסודר לפי א׳–ב׳',width-margin,y+20);y+=45;row(report.headers,true);}
  function finishPage(){ctx.direction='rtl';ctx.textAlign='right';ctx.font='18px Arial';ctx.fillStyle='#442719';ctx.fillText('BESTEVENT · עמוד '+page,width-margin,height-48);pages.push(Uint8Array.from(atob(canvas.toDataURL('image/jpeg',.92).split(',')[1]),c=>c.charCodeAt(0)));}
  startPage();if(!report.rows.length)row(['אין רשומות ברשימה',...report.headers.slice(1).map(()=>'')]);else report.rows.forEach((values,i)=>row(values,false,i));finishPage();return besteventPdfFromImages(pages,width,height);
}
function besteventPdfFromImages(images,width,height){
  const encoder=new TextEncoder(),parts=[],offsets=[0];let size=0;
  const add=value=>{const bytes=typeof value==='string'?encoder.encode(value):value;parts.push(bytes);size+=bytes.length;};
  const object=(id,body)=>{offsets[id]=size;add(id+' 0 obj\n');add(body);add('\nendobj\n');};
  add('%PDF-1.4\n');object(1,'<< /Type /Catalog /Pages 2 0 R >>');object(2,'<< /Type /Pages /Count '+images.length+' /Kids ['+images.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>');
  images.forEach((bytes,i)=>{const id=3+i*3;object(id,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 '+(id+1)+' 0 R >> >> /Contents '+(id+2)+' 0 R >>');offsets[id+1]=size;add((id+1)+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+width+' /Height '+height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+bytes.length+' >>\nstream\n');add(bytes);add('\nendstream\nendobj\n');const stream='q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ';object(id+2,'<< /Length '+encoder.encode(stream).length+' >>\nstream\n'+stream+'\nendstream');});
  const xref=size;add('xref\n0 '+offsets.length+'\n0000000000 65535 f \n');offsets.slice(1).forEach(offset=>add(String(offset).padStart(10,'0')+' 00000 n \n'));add('trailer\n<< /Size '+offsets.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');return new Blob(parts,{type:'application/pdf'});
}
