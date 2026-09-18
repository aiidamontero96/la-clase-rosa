"""Build original classroom PDFs, ink-saving variants and matching previews."""
from pathlib import Path
import json, math, subprocess, html, random, shutil
from concurrent.futures import ThreadPoolExecutor
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
import fitz

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads(subprocess.check_output(['node','scripts/export-data.cjs'],cwd=ROOT))
OUT=ROOT/'public'
for folder in ['pdf','previews','pages','assets/dinos','assets/symbols']:
    (OUT/folder).mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Rosa','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('RosaBold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
W,H=595.276,841.89
ROSE=HexColor('#9c305b'); INK=HexColor('#302c35')
COLORS=['#df678d','#5087b8','#e9b640','#79a980']
ASSETS=ROOT/'sources'
Image.open(ASSETS/'classroom-paper.png').save(OUT/'assets/fondo-aula.webp',quality=85)
sheet=Image.open(ASSETS/'dinosaur-sheet.png').convert('RGB')
for i,d in enumerate(DATA['dinosaurs']):
    xs=[0,418,836,1254]; ys=[0,390,813,1254]
    crop=sheet.crop((xs[i%3],ys[i//3],xs[i%3+1],ys[i//3+1]))
    crop.save(OUT/f"assets/dinos/{d['id']}.png")
    crop.save(OUT/f"assets/dinos/{d['id']}.webp",quality=88)
    ImageOps.grayscale(crop).save(OUT/f"assets/dinos/{d['id']}-bn.png")

emoji_font=ROOT/'scripts/NotoColorEmoji.ttf'
SYMBOLS={}
def outline_image(source):
    """Return black line art on white, removing every colour and solid fill."""
    im=source.convert('RGBA')
    background=Image.new('RGBA',im.size,'white');background.alpha_composite(im)
    gray=ImageOps.grayscale(background.convert('RGB'))
    edges=ImageOps.autocontrast(gray.filter(ImageFilter.FIND_EDGES))
    lines=edges.point(lambda value: 0 if value>34 else 255)
    return lines.filter(ImageFilter.MinFilter(3)).convert('RGB')

def outline_asset(path):
    target=path.with_name(path.stem+'-outline'+path.suffix)
    outline_image(Image.open(path)).save(target,quality=92)
    return target

def symbol_image(char):
    if char in SYMBOLS: return SYMBOLS[char]
    path=OUT/'assets/symbols'/('-'.join(hex(ord(c))[2:] for c in char)+'.png')
    if emoji_font.exists():
        font=ImageFont.truetype(str(emoji_font),109)
        im=Image.new('RGBA',(160,160),'white'); dr=ImageDraw.Draw(im)
        box=dr.textbbox((0,0),char,font=font,embedded_color=True)
        dr.text(((160-(box[2]-box[0]))/2-box[0],(160-(box[3]-box[1]))/2-box[1]),char,font=font,embedded_color=True)
        im.convert('RGB').save(path)
        SYMBOLS[char]=path
        return path
    return None

def wrap(txt,font,size,width):
    lines=[]
    for para in str(txt).split('\n'):
        line=''
        for word in para.split():
            test=(line+' '+word).strip()
            if pdfmetrics.stringWidth(test,font,size)>width and line:
                lines.append(line);line=word
            else: line=test
        lines.append(line)
    return lines

class Material:
    def __init__(self,r,bw,coloring=False):
        self.r=r;self.bw=bw;self.coloring=coloring;self.page=0
        suffix='-colorear' if coloring else ('-bn' if bw else '')
        self.path=OUT/'pdf'/(r['id']+suffix+'.pdf')
        self.c=canvas.Canvas(str(self.path),pagesize=(W,H),pageCompression=1)
        self.c.setTitle(r['title']+' | La Clase Rosa')
        self.c.setAuthor('La Clase Rosa')
    def text(self,txt,x,y,width=500,size=12,bold=False,center=False,color=None):
        c=self.c; font='RosaBold' if bold else 'Rosa'; c.setFont(font,size)
        c.setFillColor(color or (black if self.bw else INK))
        lines=wrap(txt,font,size,width)
        for line in lines:
            if center: c.drawCentredString(x+width/2,y,line)
            else: c.drawString(x,y,line)
            y-=size*1.35
        return y
    def new(self,subtitle=None):
        if self.page:self.c.showPage()
        self.page+=1;c=self.c
        c.setFillColor(black if self.bw else ROSE);c.setFont('RosaBold',11)
        c.drawString(32,H-32,'LA CLASE ROSA')
        c.setFont('Rosa',9);c.drawRightString(W-32,H-32,'INFANTIL · 4 AÑOS')
        title=self.r['title'] if not subtitle else subtitle
        size=20
        while pdfmetrics.stringWidth(title,'RosaBold',size)>W-64:size-=.5
        self.text(title,32,H-64,W-64,size,True)
        self.text(self.r['instructions'],32,H-86,W-64,9)
        c.setStrokeColor(HexColor('#bbbbbb') if self.bw else HexColor('#dec7d1'));c.setLineWidth(.6)
        c.line(32,35,W-32,35)
        footer=self.r.get('sourceNote') or ('Material de aula · Supervisión adulta · '+('Para colorear' if self.coloring else ('Bajo consumo de tinta' if self.bw else 'Color')))
        self.text(footer,32,22,470,7.5)
        c.setFont('Rosa',8);c.drawRightString(W-32,22,str(self.page))
    def rect(self,x,y,w,h,fill=False,dashed=False):
        c=self.c;c.setStrokeColor(HexColor('#777777') if self.bw else HexColor('#cdb4bf'));c.setLineWidth(1)
        if dashed:c.setDash(4,3)
        c.setFillColor(white if self.bw else HexColor('#fff9fb'))
        c.roundRect(x,y,w,h,9,stroke=1,fill=1 if fill else 0)
        c.setDash()
    def pic(self,thing,x,y,w,h,shadow=False):
        c=self.c
        if thing.startswith('dino:'):
            did=thing[5:];p=OUT/f"assets/dinos/{did}{'-bn' if self.bw else ''}.png"
        else:p=symbol_image(thing)
        if p:
            im=Image.open(p).convert('RGB')
            if self.coloring:im=outline_image(im)
            elif self.bw:im=ImageOps.grayscale(im)
            if shadow:
                # Silhouette is a printable single-ink representation of the same original art.
                im=ImageOps.grayscale(im).point(lambda a:255 if a>238 else 0)
            c.drawImage(ImageReader(im),x,y,w,h,preserveAspectRatio=True,anchor='c',mask='auto')
        else:self.text(thing,x,y+h/2,w,min(30,h/3),center=True)
    def shape(self,n,x,y,size=48,variant=0):
        c=self.c;c.setLineWidth(2);c.setStrokeColor(INK)
        c.setFillColor(white if self.bw else HexColor(COLORS[variant%4]))
        if n%3==0:c.circle(x+size/2,y+size/2,size/2,fill=1,stroke=1)
        elif n%3==1:c.rect(x,y,size,size,fill=1,stroke=1)
        else:
            p=c.beginPath();p.moveTo(x+size/2,y+size);p.lineTo(x+size,y);p.lineTo(x,y);p.close();c.drawPath(p,fill=1,stroke=1)
        # Counted center marks retain the color category in monochrome.
        if self.bw and not self.coloring:
            c.setFillColor(black)
            for j in range(variant%4+1):c.circle(x+size/2+(j-(variant%4)/2)*5,y+size*.42,1.6,fill=1,stroke=0)
    def dots(self,n,x,y,w=170,h=80,oval=False):
        cols=3 if n<=6 else 5; rows=max(1,math.ceil(n/cols));size=min(w/cols,h/rows)*.52
        for j in range(n):
            px=x+(j%cols+.5)*w/cols;py=y+h-(j//cols+.5)*h/rows
            self.c.setStrokeColor(INK);self.c.setFillColor(white if self.bw else HexColor('#8ba88a'));self.c.setLineWidth(1.5)
            if oval:self.c.ellipse(px-size*.4,py-size*.55,px+size*.4,py+size*.55,fill=1)
            else:self.c.circle(px,py,size*.45,fill=1)
    def cards(self,items,draw,cols=2,rows=3):
        w=(W-64-(cols-1)*14)/cols;h=(H-165-(rows-1)*14)/rows
        for i,item in enumerate(items):
            if i%(cols*rows)==0:self.new()
            j=i%(cols*rows);x=32+(j%cols)*(w+14);y=55+(rows-1-j//cols)*(h+14)
            self.rect(x,y,w,h,True,True);draw(item,x,y,w,h)
    def labeled(self,items,cols=2,rows=3):
        def draw(item,x,y,w,h):
            label,art,*more=item
            if art:self.pic(art,x+20,y+48,w-40,h-68)
            self.text(label,x+10,y+27,w-20,12,True,True)
            if more:self.text(more[0],x+10,y+h-24,w-20,9,center=True)
        self.cards(items,draw,cols,rows)
    def finish(self):self.c.save();return self.page

KUSAMA_COLORS=['#f1c928','#d93672','#28232b','#4c87bd','#63a36d','#ef7e45']
def kdot(m,x,y,radius,color_index=0,dashed=False,mark=True):
    c=m.c;c.saveState();c.setStrokeColor(INK);c.setLineWidth(1.5)
    if dashed:c.setDash(5,3)
    c.setFillColor(white if m.bw else HexColor(KUSAMA_COLORS[color_index%len(KUSAMA_COLORS)]))
    c.circle(x,y,radius,fill=1,stroke=1)
    if m.bw and mark and not m.coloring:
        c.setFillColor(black)
        count=color_index%4+1
        for i in range(count):c.circle(x+(i-(count-1)/2)*7,y,1.8,fill=1,stroke=0)
    c.restoreState()

def kpumpkin(m,x,y,w,h,dots=False,blank=False):
    c=m.c;c.saveState();c.setStrokeColor(INK);c.setLineWidth(2)
    c.setFillColor(white if m.bw or blank else HexColor('#f0ad2d'))
    c.ellipse(x+w*.08,y,x+w*.92,y+h*.82,fill=1,stroke=1)
    c.setFillColor(white if m.bw else HexColor('#65a45a'))
    c.roundRect(x+w*.44,y+h*.78,w*.12,h*.2,4,fill=1,stroke=1)
    c.setFillColor(black if m.bw else INK);c.setLineWidth(1.2)
    for frac in [.28,.5,.72]:
        p=c.beginPath();p.moveTo(x+w*.5,y+h*.81);p.curveTo(x+w*frac,y+h*.65,x+w*frac,y+h*.18,x+w*.5,y);c.drawPath(p)
    if dots:
        positions=[(.28,.58,0),(.48,.66,1),(.68,.56,2),(.37,.32,2),(.58,.38,0),(.76,.28,1)]
        for px,py,ci in positions:kdot(m,x+w*px,y+h*py,min(w,h)*.055,ci)
    c.restoreState()

def kflower(m,cx,cy,radius,petals=6,color_index=0,outline=False):
    c=m.c;c.saveState();c.setStrokeColor(INK);c.setLineWidth(1.5)
    for i in range(petals):
        c.saveState();c.translate(cx,cy);c.rotate(i*360/petals)
        c.setFillColor(white if m.bw or outline else HexColor(KUSAMA_COLORS[(color_index+i)%len(KUSAMA_COLORS)]))
        c.ellipse(-radius*.32,radius*.22,radius*.32,radius*1.12,fill=1,stroke=1);c.restoreState()
    kdot(m,cx,cy,radius*.34,color_index+1,mark=True);c.restoreState()

def kloops(m,x,y,count,size,color_index=0):
    c=m.c;c.saveState();c.setStrokeColor(black if m.bw else HexColor(KUSAMA_COLORS[color_index%len(KUSAMA_COLORS)]));c.setLineWidth(4)
    p=c.beginPath();p.moveTo(x,y)
    for i in range(count):
        x0=x+i*size
        p.curveTo(x0+size*.18,y+size*.72,x0+size*.82,y+size*.72,x0+size,y)
        p.curveTo(x0+size*.82,y-size*.72,x0+size*.18,y-size*.72,x0+size,y)
    c.drawPath(p);c.restoreState()

def build_one(r,bw,coloring=False):
    m=Material(r,bw,coloring);k=r['kind'];c=m.c
    dinos=DATA['dinosaurs']; ds=['dino:'+d['id'] for d in dinos]
    if k in ['rutinas','tiempo','emociones','encargado','movimientos','etiquetas']:
        sets={
          'rutinas':[('BUENOS DÍAS','☀️'),('¿QUIÉN HA VENIDO?','🙋'),('¿QUIÉN FALTA?','🏠'),('¿CUÁNTOS SOMOS?','🔢'),('DÍA DE LA SEMANA','📅'),('FECHA','📆'),('MES','🗓️'),('ESTACIÓN','🍂'),('TIEMPO','🌤️'),('EMOCIONES','🙂'),('ENCARGADO/A','⭐'),('NÚMERO','🔢'),('LETRA','🔤'),('PALABRA','💬'),('RETO','🎯'),('ADIVINANZA','❓'),('CANCIÓN','🎵'),('CONVERSAMOS','💬')],
          'tiempo':[('SOL','☀️'),('NUBES','☁️'),('LLUVIA','🌧️'),('VIENTO','💨'),('NIEVE','❄️'),('SOL Y NUBES','🌤️')],
          'emociones':[('ALEGRÍA','🙂'),('TRISTEZA','😢'),('ENFADO','😠'),('MIEDO','😟'),('SORPRESA','😮'),('CALMA','😌'),('NO LO SÉ','❓'),('PREFIERO PASAR','✋')],
          'encargado':[('REPARTIR','🤲'),('CUIDAR LAS PLANTAS','🌱'),('MIRAR EL TIEMPO','🌤️'),('AYUDAR A RECOGER','🧺'),('CUIDAR LOS LIBROS','📚'),('DAR LA BIENVENIDA','👋')],
          'movimientos':[('CAMINA DESPACIO',ds[3]),('ESTIRA LOS BRAZOS',ds[0]),('PASOS PEQUEÑOS',ds[4]),('EQUILIBRIO A RAS DE SUELO',ds[6]),('TRANSPORTA UN HUEVO','🥚'),('PARA Y DESCANSA',ds[5]),('RODEA EL ARO',ds[1]),('MUEVE LOS BRAZOS SENTADO',ds[7])],
          'etiquetas':[('BROCHA','🖌️'),('LUPA','🔎'),('BANDEJA','🧺'),('CUADERNO','📓'),('FÓSIL','🐚'),('HUELLA','👣'),('HUEVO','🥚'),('HUESO','🦴'),('POR OBSERVAR','👀'),('PARA EL MUSEO','🏛️')]}
        m.labeled(sets[k])
    elif k=='calendario':
        items=[(x,'') for x in ['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO','ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']]
        items += [('PRIMAVERA','🌷'),('VERANO','☀️'),('OTOÑO','🍂'),('INVIERNO','❄️')]
        m.labeled(items,2,4)
    elif k in ['preguntas','retos','canciones','adivinanzas','verdadero']:
        if k=='preguntas':items=[(cat,q,'Puedes hablar, señalar o pasar.') for cat,qs in DATA['questionGroups'].items() for q in qs]
        elif k=='retos':items=[(x['title'],x['text'],str(x['duration'])+' minutos') for x in DATA['challenges']]
        elif k=='canciones':items=[(x[0],x[1].replace(' / ','\n'),x[2]) for x in DATA['songs']]
        elif k=='adivinanzas':items=[('ESCUCHA LAS PISTAS',x[0],x[1]) for x in DATA['riddles']]
        else:items=[('¿SÍ O NO?',x[0],('Sí. ' if x[1] else 'No. ')+x[2]) for x in DATA['truth']]
        def draw(it,x,y,w,h):
            m.text(it[0],x+18,y+h-30,w-36,11,True)
            m.text(it[1],x+18,y+h-63,w-36,14 if k!='canciones' else 12,True)
            m.text(it[2],x+18,y+55,w-36,9)
        m.cards(items,draw,2,2)
    elif k=='protagonista':
        m.new();m.text('HOY EXPLORAMOS EL',40,690,515,20,True,True);m.rect(215,520,165,145)
        m.text('PONGO TANTAS PIEZAS',45,480,505,17,True,True);m.rect(45,310,505,145)
        m.text('ASÍ LO MUESTRO CON DEDOS O DIBUJOS',45,268,505,15,True,True);m.rect(45,75,505,165)
    elif k in ['numeros','pinzas','huevos','marcos','subitizacion','completar','orden']:
        vals=list(range(1,r.get('max',6)+1))
        if k=='numeros': vals=[('n',n) for n in vals]+[('d',n) for n in vals]
        if k=='subitizacion':vals=vals*2
        def draw(it,x,y,w,h):
            n=it[1] if isinstance(it,tuple) else it
            if k=='numeros' and it[0]=='n':m.text(str(n),x,y+h/2-18,w,85,True,True);return
            if k=='marcos':
                m.text(str(n),x+10,y+h-38,w-20,26,True,True)
                cell=(w-30)/5
                for j in range(10):
                    xx=x+15+(j%5)*cell;yy=y+30+(1-j//5)*cell
                    c.setStrokeColor(INK);c.rect(xx,yy,cell,cell)
                    if j<n:m.dots(1,xx,yy,cell,cell)
                return
            if k=='completar':
                m.text('COMPLETA HASTA '+str(n),x+10,y+h-30,w-20,13,True,True)
                for j in range(n):
                    xx=x+28+(j%3)*65;yy=y+55+(1-j//3)*50
                    c.setStrokeColor(INK);c.setDash(3,2);c.circle(xx,yy,17);c.setDash()
                    if j==0:c.setFillColor(black if bw else ROSE);c.circle(xx,yy,13,fill=1)
                return
            m.dots(n,x+20,y+65,w-40,h-95,oval=k=='huevos')
            if k=='pinzas':
                choices=[n,max(1,n-1),min(6,n+1)]
                choices=list(dict.fromkeys(choices))
                for q in range(1,7):
                    if len(choices)<3 and q not in choices:choices.append(q)
                random.Random(n).shuffle(choices)
                for j,v in enumerate(choices):m.rect(x+8+j*(w-16)/3,y+8,(w-22)/3,38);m.text(str(v),x+8+j*(w-16)/3,y+17,(w-22)/3,22,True,True)
            elif k=='huevos':m.text(str(n),x+10,y+18,w-20,28,True,True)
            elif k=='subitizacion':m.text('MIRA · TAPA · COMPRUEBA',x+10,y+22,w-20,9,center=True)
        m.cards(vals,draw)
    elif k=='recta':
        m.new()
        for i in range(10):
            x=38+(i%2)*266;y=80+(4-i//2)*120
            m.rect(x,y,250,110,True,True);m.text(str(i+1),x+10,y+54,70,42,True,True);m.dots(i+1,x+85,y+12,145,90)
    elif k=='juntar':
        def draw(pair,x,y,w,h):
            a,b=pair;m.text('HABÍA '+str(a)+'. LLEGAN '+str(b)+'.',x+12,y+h-28,w-24,12,True,True)
            for j in range(a):m.pic(ds[1],x+12+j*34,y+100,33,55)
            for j in range(b):m.pic(ds[1],x+w/2+8+j*34,y+100,33,55)
            m.text('JUNTAMOS Y CONTAMOS',x+10,y+68,w-20,11,True,True);m.rect(x+22,y+14,w-44,40)
        m.cards([(1,1),(2,1),(1,2),(2,2),(3,1),(3,2)],draw)
    elif k=='dado':
        m.new();s=105;ox=130;oy=150
        for i,(gx,gy) in enumerate([(1,3),(0,2),(1,2),(2,2),(1,1),(1,0)]):
            x=ox+gx*s;y=oy+gy*s;c.setStrokeColor(INK);c.setLineWidth(1.2);c.rect(x,y,s,s);m.dots(i%3+1,x,y,s,s)
        # Fold/cut net, tape applied by adult; no tabs needed.
        m.text('Un adulto recorta el contorno exterior, dobla las aristas y cierra con cinta adhesiva.',45,650,505,13)
        m.text('DOBLAR POR LAS LÍNEAS INTERIORES',45,95,505,12,True,True)
    elif k in ['series','crea-series']:
        pattern=r.get('pattern','AB');theme=r.get('theme','formas');columns=10 if len(pattern)==4 else 8;stride=525/columns;cell= stride-7;m.new()
        for row in range(4):
            y=565-row*122
            m.text(('COPIA' if row==0 else 'CONTINÚA' if row==1 else '¿QUÉ FALTA?' if row==2 else 'INVENTA') if k=='series' else 'CREA Y REPITE TU UNIDAD',35,y+83,510,11,True)
            for col in range(columns):
                x=35+col*stride;m.rect(x,y,cell,68)
                idx=ord(pattern[col%len(pattern)])-65
                blank=k=='crea-series' or row==3 or (row==0 and col>=len(pattern)) or (row==1 and col>=len(pattern)*2) or (row==2 and col in [2,5])
                if not blank:
                    if theme=='dinos':m.pic(ds[idx],x+3,y+4,cell-6,60)
                    else:m.shape(idx,x+(cell-34)/2,y+16,34,(idx+row)%4)
        m.new('Piezas para nuestras series')
        m.text('Recorta por las líneas discontinuas. Las piezas tienen el mismo tamaño que los huecos.',35,710,525,10)
        for i in range(48):
            x=35+(i%columns)*stride;y=615-(i//columns)*86
            m.rect(x,y,cell,68,False,True)
            if theme=='dinos':m.pic(ds[i%3],x+3,y+4,cell-6,60)
            else:m.shape(i%3,x+(cell-34)/2,y+16,34,(i//3)%4)
    elif k in ['clasificar','atributos','intrusos','memoria-modelo']:
        m.new()
        if k=='atributos':
            for row in range(2):
                m.text('GRANDE' if row==0 else 'PEQUEÑO',35,590-row*180,110,12,True)
                for col in range(3):m.rect(140+col*138,460-row*180,130,170)
            for col in range(3):m.shape(col,183+col*138,646,43)
        elif k=='clasificar':
            for i in range(3):m.rect(38+i*174,305,164,345);m.shape(i,94+i*174,565,48)
            m.text('Primero por forma; después mezcla y agrupa por color o marcas centrales.',40,235,510,14)
        else:
            for row in range(4):
                y=560-row*130;m.rect(35,y-15,525,110)
                for col in range(4):m.shape((row+1)%3 if col==row and k=='intrusos' else row%3,78+col*123,y+8,58,col%2 if k=='memoria-modelo' else row%4)
                m.text('¿Cuál es diferente?' if k=='intrusos' else 'Mira el grupo. Tapa una pieza con papel.',45,y+73,500,11,True)
        if k in ['clasificar','atributos','memoria-modelo']:
            m.cards(range(18),lambda i,x,y,w,h:m.shape(i%3,x+w/2-25,y+h/2-25,35 if i%2 else 65,i//3%4),3,6)
    elif k in ['tamanos','sombras','puzles']:
        if k=='tamanos':
            for d in [0,1,3]:
                m.new('Ordena cada familia de dibujos')
                for i,sz in enumerate([110,165,215]):m.rect(36,75+i*208,525,195,False,True);m.pic(ds[d],285-sz/2,80+i*208,sz,185)
        elif k=='sombras':
            m.cards([(i,shadow) for shadow in [False,True] for i in range(6)],lambda item,x,y,w,h:m.pic(ds[item[0]],x+12,y+12,w-24,h-24,shadow=item[1]))
        else:
            for idx in [0,1,2]:
                m.new('Reconstruye el dinosaurio')
                m.pic(ds[idx],185,535,225,185)
                m.text('MODELO',35,527,525,10,True,True)
                m.rect(70,75,455,400,False,True);m.pic(ds[idx],80,85,435,380)
                c.setDash(6,4);c.line(W/2,75,W/2,475)
                if idx>0:c.line(70,275,525,275)
                c.setDash()
    elif k=='secuencias':
        scenes=[[('ME MOJO LAS MANOS','💧'),('USO JABÓN','🧼'),('ME SECO','🧻')],[('SIEMBRO','🌱'),('RIEGO','💧'),('LA PLANTA CRECE','🌿')],[('DESCUBRO','🔎'),('OBSERVO','👀'),('COMPARTO','🏛️')]]
        m.labeled([it for scene in scenes for it in scene],3,3)
    elif k=='laberintos':
        m.new()
        # Three wide corridors with simple branches. No arbitrary unsolvable maze.
        for row in range(3):
            y=545-row*190
            m.text('ENTRADA',38,y+137,150,11,True);m.text('SALIDA',450,y-63,110,11,True)
            c.setStrokeColor(INK);c.setLineWidth(2)
            walls=[[(45,117),(242,117),(242,42),(290,42),(290,100),(330,100),(330,42),(422,42),(422,4),(548,4)],[(45,75),(198,75),(198,0),(378,0),(378,-38),(548,-38)]]
            for points in walls:
                p=c.beginPath();p.moveTo(points[0][0],y+points[0][1])
                for px,py in points[1:]:p.lineTo(px,y+py)
                c.drawPath(p)
    elif k in ['rimas','silabas','sonidos','vocales','historias','vocabulario','dinosaurios']:
        if k=='rimas':m.labeled([('GATO','🐱'),('PATO','🦆'),('QUESO','🧀'),('HUESO','🦴'),('CONEJO','🐰'),('ESPEJO','🪞')])
        elif k=='silabas':
            its=[('SOL','☀️',1),('LUNA','🌙',2),('PELOTA','⚽',3),('CASA','🏠',2),('MARIPOSA','🦋',4),('GATO','🐱',2)]
            def draw(it,x,y,w,h):m.pic(it[1],x+45,y+70,w-90,h-88);m.text(it[0],x+10,y+55,w-20,13,True,True);m.dots(it[2],x+40,y+9,w-80,35)
            m.cards(its,draw)
        elif k=='sonidos':m.labeled([('SOL','☀️'),('SOPA','🍲'),('SILLA','🪑'),('MARIPOSA','🦋'),('MANO','✋'),('MOTO','🏍️')])
        elif k=='vocales':
            def draw(letter,x,y,w,h):
                m.text(letter,x,y+h-72,w,52,True,True)
                line=['A','E','I','O','U'];random.Random(ord(letter)).shuffle(line)
                m.text('   '.join(line),x+10,y+68,w-20,21,True,True)
                m.text(letter+'   M   '+letter+'   S',x+10,y+24,w-20,21,True,True)
            m.cards('AEIOU',draw)
        elif k=='historias':m.labeled([('UN PERSONAJE','🐱'),('UN PERSONAJE','🦋'),('UN PERSONAJE',ds[1]),('UN LUGAR','🏠'),('UN LUGAR','🌳'),('UN LUGAR','🏖️'),('UN OBJETO','📦'),('UN OBJETO','🔑'),('UN OBJETO','⚽')],3,3)
        elif k=='vocabulario':
            def draw(v,x,y,w,h):m.pic(v['icon'],x+50,y+90,w-100,h-110);m.text(v['word'].upper(),x+10,y+74,w-20,11,True,True);m.text(v['definition'],x+14,y+49,w-28,9)
            m.cards(DATA['vocab'],draw)
            def word_draw(it,x,y,w,h):
                word,icon,syllables=it;m.pic(icon,x+45,y+93,w-90,h-115)
                m.text(word,x+10,y+76,w-20,19,True,True)
                m.text(syllables,x+10,y+48,w-20,12,center=True)
                m.dots(len(syllables.split(' · ')),x+50,y+5,w-100,30)
            m.cards([('HUEVO','🥚','HUE · VO'),('HUELLA','👣','HUE · LLA'),('FÓSIL','🐚','FÓ · SIL'),('MUSEO','🏛️','MU · SE · O')],word_draw,2,2)
            m.cards(list('HUEVOHUELLAFÓSILMUSEO'),lambda letter,x,y,w,h:m.text(letter,x,y+h/2-22,w,45,True,True),4,5)
        else:
            def draw(d,x,y,w,h):m.pic('dino:'+d['id'],x+20,y+110,w-40,h-135);m.text(d['name'],x+12,y+88,w-24,13,True,True);m.text(d['diet']+' · '+d['period'],x+10,y+66,w-20,10,center=True);m.text(d['fact'],x+16,y+46,w-32,9)
            m.cards(dinos,draw,2,2)
    elif k=='letras':m.cards(list('AABCDEEEFGHIIIJKLMNÑOOOPQRSTUUUVWXYZ'),lambda letter,x,y,w,h:m.text(letter,x,y+h/2-22,w,55,True,True),4,5)
    elif k=='nombre':
        m.new();m.text('ASÍ ES MI NOMBRE',40,670,515,20,True,True);m.rect(45,510,505,135)
        m.text('BUSCO SUS LETRAS',40,459,515,17,True,True)
        for row in range(2):
            for col in range(5):m.rect(45+col*103,308-row*110,93,96,False,True)
        m.text('La maestra escribe un nombre modelo y repite sus letras en las piezas. Para nombres más largos, imprime otra copia.',45,138,505,12)
    elif k in ['trazos','recorte','plastilina','ensartar','puntos','collage','huevo-arte','coronas']:
        if k not in ['ensartar','collage']:m.new()
        if k=='trazos':
            for i in range(4):
                y=640-i*140;c.setStrokeColor(INK);c.setLineWidth(2);c.setDash(6,5)
                p=c.beginPath();p.moveTo(50,y)
                if r['trace']=='rectos':
                    for j in range(5):p.lineTo(70+j*95,y-(i%2)*75*(j%2))
                else:
                    for j in range(3):p.curveTo(90+j*160,y+65,125+j*160,y-65,210+j*160,y)
                c.drawPath(p);c.setDash();m.text('EMPIEZA',43,y+30,140,10);m.text('LLEGA',468,y+30,95,10)
            if r['trace']=='curvos':
                m.new('Una espiral para recorrer')
                c.setStrokeColor(INK);c.setLineWidth(2);c.setDash(7,6);p=c.beginPath()
                for i in range(200):
                    t=i/199*math.pi*4.5;rr=15+i*.85;x=W/2+math.cos(t)*rr;y=390+math.sin(t)*rr
                    if i==0:p.moveTo(x,y)
                    else:p.lineTo(x,y)
                c.drawPath(p);c.setDash()
        elif k=='recorte':
            for i in range(5):
                y=580-i*100;m.rect(45,y,505,80);c.setStrokeColor(INK);c.setDash(6,5)
                for j in range(1,7):c.line(45+j*70,y,45+j*70,y+80)
                c.setDash()
        elif k=='plastilina':
            for i in range(3):
                for j in range(4):c.setStrokeColor(INK);c.circle(90+j*135,610-i*190,28)
                c.setLineWidth(5);c.line(70,550-i*190,530,550-i*190);c.setLineWidth(1)
        elif k=='ensartar':
            def draw(i,x,y,w,h):
                m.shape(i,x+w/2-60,y+h/2-60,120,i)
                c.setFillColor(white);c.setStrokeColor(black)
                for dx,dy in ([(0,27),(20,-15),(0,-38),(-20,-15)] if i%3==2 else [(0,35),(35,0),(0,-35),(-35,0)]):c.circle(x+w/2+dx,y+h/2+dy,5,fill=1)
            m.cards(range(6),draw)
        elif k=='puntos':
            for row in range(3):
                pts=[(55,580),(140,620),(225,560),(320,615),(420,575),(535,610)]
                for i,(x,y) in enumerate(pts):y-=row*190;c.setFillColor(INK);c.circle(x,y,4,fill=1);m.text(str(i+1),x-8,y-24,30,14,True)
        elif k=='collage':
            m.cards(range(12),lambda i,x,y,w,h:m.shape(i,x+w/2-50,y+h/2-50,100,i%4),3,4)
        elif k=='huevo-arte':
            c.setStrokeColor(INK);c.setLineWidth(3);c.ellipse(110,115,485,655)
        else:
            for i in range(3):
                y=120+i*190;m.rect(40,y,515,130,False,True)
                for j in range(5):m.shape(j,75+j*94,y+38,46,j%4)
            m.text('Une las bandas por los extremos con ayuda de un adulto. Ajusta a la cabeza sin apretar.',42,695,510,11)
    elif k in ['kusama-mirar','kusama-series','kusama-calabazas','kusama-cantidades','kusama-clasificar','kusama-flores','kusama-redes','kusama-espacios','kusama-cuento','kusama-museo']:
        if k=='kusama-mirar':
            m.new('Tres imágenes para mirar')
            for i,label in enumerate(['PUNTOS','CALABAZA','ESPACIO']):
                x=35+i*177;m.rect(x,170,165,500,True)
                m.text(label,x+8,637,149,13,True,True)
                if i==0:
                    for j,(px,py,rr) in enumerate([(45,540,21),(105,560,14),(70,475,29),(125,430,19),(42,390,12),(100,330,31),(55,260,20),(125,235,13)]):kdot(m,x+px,py,rr,j)
                elif i==1:kpumpkin(m,x+15,280,135,265,True)
                else:
                    c.setStrokeColor(INK);c.setLineWidth(2);c.rect(x+18,255,129,310)
                    c.line(x+18,255,x+64,340);c.line(x+147,255,x+101,340);c.line(x+64,340,x+101,340)
                    for j,(px,py) in enumerate([(45,525),(112,500),(72,445),(120,390),(48,335),(90,285)]):kdot(m,x+px,py,13+(j%2)*5,j)
            m.new('Marcos para centrar la mirada')
            for i in range(4):
                x=42+(i%2)*265;y=105+(1-i//2)*295;m.rect(x,y,245,255,False,True)
                c.setStrokeColor(INK);c.setLineWidth(5);c.rect(x+30,y+48,185,150)
                for j in range(7):kdot(m,x+28+j*31,y+222,7,j,False)
                m.text('ACERCA · ALEJA · ENCUENTRA',x+12,y+18,221,9,True,True)
            m.new('Preguntas visuales')
            prompts=[('BUSCA UN PUNTO',0),('BUSCA UNA LÍNEA',1),('BUSCA ALGO GRANDE',2),('BUSCA ALGO PEQUEÑO',3),('¿QUÉ SE REPITE?',4),('¿QUÉ CAMBIA?',5)]
            for i,(label,kind) in enumerate(prompts):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,True,True);m.text(label,x+12,y+128,226,13,True,True)
                if kind==0:kdot(m,x+125,y+72,32,1)
                elif kind==1:c.setStrokeColor(INK);c.setLineWidth(5);c.line(x+55,y+72,x+195,y+72)
                elif kind in [2,3]:kdot(m,x+125,y+70,42 if kind==2 else 16,kind)
                else:
                    for j in range(3):kdot(m,x+85+j*40,y+70,13,(j if kind==5 else 1))
        elif k=='kusama-series':
            patterns=['AB','AAB','ABB','ABC']
            for page,pattern in enumerate(patterns):
                m.new('Series '+pattern+' · cuatro propuestas')
                for row in range(4):
                    y=555-row*145;m.text('SERIE '+str(row+1),35,y+96,525,11,True)
                    shown=min(8,max(len(pattern)*2,6));stride=52.5
                    for col in range(10):
                        x=35+col*stride;m.rect(x,y,47,76,True)
                        if col<shown:
                            index=ord(pattern[col%len(pattern)])-65+row
                            kdot(m,x+23.5,y+38,15,index)
                        else:pass
        elif k=='kusama-calabazas':
            m.new('Una calabaza grande para transformar');kpumpkin(m,105,145,385,500,False,True)
            m.text('Añade puntos con ceras, sellos, papel o plastilina. No hace falta cubrir toda la silueta.',65,96,465,12,center=True)
            m.new('Dos calabazas para comparar y modelar');kpumpkin(m,45,250,235,330,True,False);kpumpkin(m,315,335,200,245,False,True)
            m.text('OBSERVA LOS SURCOS',45,190,235,13,True,True);m.text('INVENTA TUS PUNTOS',315,190,200,13,True,True)
            m.new('Modelo para una obra colectiva');kpumpkin(m,62,105,470,560,False,True)
            for j,(px,py,rr) in enumerate([(155,520,28),(290,560,18),(410,500,34),(210,390,22),(350,340,30),(130,245,17),(290,210,26),(430,220,16)]):kdot(m,px,py,rr,j,True)
            m.new('Tarjetas para observar')
            labels=['CONTORNO','SURCOS','PUNTOS','GRANDE','PEQUEÑA','MI IDEA']
            for i,label in enumerate(labels):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,True,True);m.text(label,x+12,y+126,226,13,True,True)
                if i<3:kpumpkin(m,x+75,y+22,100,92,i==2,True)
                elif i in [3,4]:kdot(m,x+125,y+65,42 if i==3 else 18,i)
                else:m.rect(x+67,y+27,116,70,False,True)
        elif k=='kusama-cantidades':
            for group in [(1,2,3),(4,5,6)]:
                m.new('Calabazas '+str(group[0])+'-'+str(group[-1]))
                for i,n in enumerate(group):
                    x=35+i*177;m.rect(x,135,165,535,True,True);m.text(str(n),x,615,165,42,True,True);kpumpkin(m,x+16,245,133,285,False,True)
                    m.text('COLOCA '+str(n)+' PUNTO'+('' if n==1 else 'S'),x+8,190,149,10,True,True)
            m.new('Tarjetas de cantidad · 1-6')
            for i,n in enumerate(range(1,7)):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,True,True);m.text(str(n),x+10,y+63,70,42,True,True);m.dots(n,x+83,y+37,145,95)
            m.new('Puntos móviles grandes')
            for i in range(20):kdot(m,92+(i%4)*137,620-(i//4)*125,41,i,True)
        elif k=='kusama-clasificar':
            m.new('Primero clasificamos por tamaño')
            for i,(label,rad) in enumerate([('GRANDE',64),('MEDIANO',46),('PEQUEÑO',28)]):
                x=35+i*177;m.rect(x,105,165,565,True);m.text(label,x+8,625,149,12,True,True);kdot(m,x+82.5,505,rad,i);m.text('COLOCA AQUÍ',x+10,145,145,10,True,True)
            m.new('Después cambiamos la regla: color o marca')
            for i,label in enumerate(['AMARILLO · 1 MARCA','ROSA · 2 MARCAS','NEGRO · 3 MARCAS']):
                x=35+i*177;m.rect(x,105,165,565,True);m.text(label,x+8,615,149,10,True,True);kdot(m,x+82.5,500,52,i);m.text('COLOCA AQUÍ',x+10,145,145,10,True,True)
            m.new('Círculos grandes y medianos')
            for i in range(9):kdot(m,105+(i%3)*192,590-(i//3)*205,61 if i%2==0 else 45,i,True)
            m.new('Círculos pequeños')
            for i in range(20):kdot(m,82+(i%4)*145,620-(i//4)*125,31+(i%3)*4,i,True)
        elif k=='kusama-flores':
            m.new('Pétalos grandes')
            for i in range(8):
                x=85+(i%4)*140;y=560-(i//4)*300;c.saveState();c.setStrokeColor(INK);c.setDash(5,3);c.setFillColor(white if bw else HexColor(KUSAMA_COLORS[i%6]));c.ellipse(x-43,y-92,x+43,y+92,fill=1,stroke=1);c.restoreState()
            m.new('Centros y pétalos pequeños')
            for i in range(12):kdot(m,85+(i%4)*140,620-(i//4)*185,43,i,True)
            for i in range(4):
                x=95+i*135;c.saveState();c.setStrokeColor(INK);c.setDash(5,3);c.setFillColor(white);c.ellipse(x-32,100,x+32,225,fill=1,stroke=1);c.restoreState()
            m.new('Una flor para decorar');kflower(m,297,380,190,8,0,True)
            m.new('Nuestro jardín común')
            for i,(x,y,rad) in enumerate([(95,500,62),(220,430,52),(350,510,70),(485,410,48)]):
                c.setStrokeColor(black if bw else HexColor('#4b8e58'));c.setLineWidth(5);c.line(x,130,x,y-rad*.8);kflower(m,x,y,rad,6+i%3,i,True)
            c.setStrokeColor(black if bw else HexColor('#4b8e58'));c.setLineWidth(3);c.line(42,130,550,130)
        elif k=='kusama-redes':
            m.new('Cuatro redes para continuar')
            for row in range(4):
                y=610-row*145;m.rect(35,y-54,525,110,False);kloops(m,55,y,3,46,row)
            m.new('Una red grande')
            for row in range(6):kloops(m,55,625-row*92,4,47,row)
            m.text('Continúa hacia la derecha, arriba o abajo. Para cuando tu mano necesite descansar.',55,75,485,12,center=True)
            m.new('Marcos para descubrir caminos y huecos')
            for i in range(4):
                x=42+(i%2)*265;y=105+(1-i//2)*295;m.rect(x,y,245,255,False,True)
                for row in range(3):kloops(m,x+22,y+72+row*54,3,48,i+row)
        elif k=='kusama-espacios':
            m.new('Puntos grandes para paneles')
            for i in range(12):kdot(m,105+(i%3)*193,610-(i//3)*155,55,i,True)
            m.new('Puntos de bajo consumo y tamaños variados')
            for i,(x,y,rad) in enumerate([(95,610,62),(255,620,42),(440,610,70),(120,410,38),(285,420,66),(470,420,44),(90,220,48),(260,215,73),(460,220,55)]):kdot(m,x,y,rad,i,True,False)
            m.new('Señales para un recorrido')
            for i,(label,symbol,color) in enumerate([('PARAR','Ⅱ',1),('SEGUIR','→',4)]):
                x=55+i*270;m.rect(x,160,220,500,True,True);kdot(m,x+110,475,82,color);m.text(symbol,x+32,430,156,70,True,True);m.text(label,x+12,235,196,25,True,True)
            m.new('Reglas visuales para el camino')
            cues=[('PASO GRANDE',70),('PASO PEQUEÑO',32),('PARA EN ROSA',48),('SIGUE EN AMARILLO',48),('DOS PUNTOS',36),('TURNO DE PAREJA',36)]
            for i,(label,rad) in enumerate(cues):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,True,True);m.text(label,x+10,y+125,230,11,True,True);kdot(m,x+125,y+68,rad,i)
            m.new('Antes y después')
            m.text('ANTES',45,665,505,14,True,True);m.rect(45,415,505,225)
            m.text('DESPUÉS',45,375,505,14,True,True);m.rect(45,105,505,245)
        elif k=='kusama-cuento':
            m.new('Elige un punto protagonista')
            for i in range(4):
                x=105+(i%2)*280;y=500-(i//2)*300;kdot(m,x,y,92,i,True)
                face=white if not bw and i==2 else black;c.setFillColor(face);c.setStrokeColor(face);c.circle(x-25,y+18,5,fill=1,stroke=0);c.circle(x+25,y+18,5,fill=1,stroke=0);c.arc(x-35,y-35,x+35,y+25,200,140)
            m.new('Elige un escenario')
            scenes=[('AULA','🏫'),('JARDÍN','🌳'),('CIELO','☁️')]
            for i,(label,art) in enumerate(scenes):
                x=35+i*177;m.rect(x,160,165,500,True,True);m.text(label,x+8,620,149,13,True,True);m.pic(art,x+25,300,115,230);m.rect(x+20,205,125,70,False,True)
            m.new('Ordenamos el cuento')
            for i,label in enumerate(['INICIO','VIAJE','LLEGADA']):
                x=35+i*177;m.rect(x,155,165,505,True,True);m.text(label,x+8,620,149,13,True,True);m.rect(x+20,255,125,315,False,True);kdot(m,x+82.5,205,24,i)
            m.new('Preguntas para hacer avanzar la historia')
            prompts=[('¿A DÓNDE VA?','↗'),('¿QUÉ ENCUENTRA?','?'),('¿QUÉ HACE?','★'),('¿CÓMO TERMINA?','✓')]
            for i,(label,art) in enumerate(prompts):
                x=42+(i%2)*265;y=105+(1-i//2)*295;m.rect(x,y,245,255,True,True);m.text(label,x+12,y+208,221,14,True,True);m.text(art,x,y+75,245,65,True,True)
        else:
            m.new('Títulos y etiquetas de obra')
            for i in range(6):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,False,True);m.text('TÍTULO',x+15,y+125,220,11,True);c.line(x+18,y+92,x+232,y+92);m.text('HECHO POR EL GRUPO',x+15,y+38,220,9)
            m.new('Carteles para organizar el museo')
            for i,(label,kind) in enumerate([('PUNTOS',0),('FORMAS',1),('ESPACIOS',2)]):
                x=35+i*177;m.rect(x,145,165,525,True,True);m.text(label,x+8,625,149,14,True,True)
                if kind==0:
                    for j in range(7):kdot(m,x+45+(j%2)*72,510-(j//2)*78,16+j%3*5,j)
                elif kind==1:kpumpkin(m,x+18,310,129,245,True,True)
                else:
                    c.setStrokeColor(INK);c.rect(x+25,305,115,250)
                    for j in range(6):kdot(m,x+50+(j%2)*62,500-(j//2)*68,14,j)
            m.new('Invitación a nuestro museo');m.rect(55,120,485,550,True,True);m.text('TE INVITAMOS A NUESTRO MUSEO',75,610,445,23,True,True);m.text('DÍA:',85,485,100,14,True);c.line(155,483,500,483);m.text('HORA:',85,405,100,14,True);c.line(165,403,500,403);m.text('LUGAR:',85,325,100,14,True);c.line(170,323,500,323);m.text('VEN A DESCUBRIR PUNTOS, FORMAS Y ESPACIOS.',85,215,425,14,True,True)
            m.new('Tarjetas para contar lo que hicimos')
            for i,label in enumerate(['MI TÍTULO','HE USADO…','HE DESCUBIERTO…','ME GUSTA…','UNA PREGUNTA…','GRACIAS POR VENIR']):
                x=38+(i%2)*266;y=105+(2-i//2)*190;m.rect(x,y,250,165,True,True);m.text(label,x+15,y+125,220,12,True);c.line(x+18,y+88,x+232,y+88);c.line(x+18,y+50,x+232,y+50)
    elif k=='aportado-imagen':
        m.new()
        image_path=OUT/r['sourceImage']
        im=Image.open(image_path).convert('RGB')
        if bw:im=ImageOps.grayscale(im).convert('RGB')
        max_w,max_h=515,690
        scale=min(max_w/im.width,max_h/im.height)
        iw,ih=im.width*scale,im.height*scale
        c.drawImage(ImageReader(im),(W-iw)/2,58+(max_h-ih)/2,iw,ih,preserveAspectRatio=True,anchor='c')
    elif k=='curso-extra':
        kind=r['extraType'];m.new();c.setStrokeColor(INK);c.setLineWidth(3);c.setFillColor(white)
        if kind=='otono-hoja':
            m.text('REPASA LAS VENAS Y DECORA LA HOJA',45,680,505,16,True,True)
            p=c.beginPath();p.moveTo(297,135);p.curveTo(75,285,92,575,297,650);p.curveTo(510,570,520,285,297,135);c.drawPath(p)
            c.line(297,135,297,620)
            for y in [235,315,395,475,555]:
                c.line(297,y,155+(y%3)*8,y+60);c.line(297,y,440-(y%3)*8,y+60)
        elif kind=='halloween-calabaza':
            m.text('INVENTA UNA CARA AMABLE Y LLÉNALA DE PUNTOS',45,680,505,15,True,True);kpumpkin(m,105,155,385,485,True,True)
            m.text('MI CALABAZA SE LLAMA:',75,105,250,12,True);c.line(260,102,505,102)
        elif kind=='halloween-busca':
            m.text('BUSCA, RODEA Y CUENTA',45,680,505,16,True,True)
            icons=['🎃','👻','🕷️','🌙'];grid=['🎃','👻','🎃','🌙','🕷️','🎃','👻','🕷️','🌙','👻','🎃','🕷️']
            for i,art in enumerate(grid):m.pic(art,63+(i%4)*125,345-(i//4)*125,78,82)
            for i,art in enumerate(icons):m.pic(art,62+i*127,135,58,60);m.rect(65+i*127,82,52,42,False,True)
        elif kind=='flamenco-manton':
            m.text('DECORA EL MANTÓN CON FLORES, LÍNEAS Y PUNTOS',45,680,505,15,True,True)
            p=c.beginPath();p.moveTo(75,615);p.lineTo(520,615);p.lineTo(297,155);p.close();c.drawPath(p)
            for i in range(11):c.line(260+i*7,155,248+i*10,92)
            for x,y in [(175,500),(360,500),(270,350)]:
                c.circle(x,y,22,fill=0,stroke=1)
                for a in range(0,360,72):c.circle(x+42*math.cos(math.radians(a)),y+42*math.sin(math.radians(a)),21,fill=0,stroke=1)
        elif kind=='navidad-arbol':
            m.text('COLOREA Y DIBUJA ADORNOS EN EL ÁRBOL',45,680,505,16,True,True)
            for pts in [[(297,630),(150,430),(230,430)],[(297,550),(110,300),(250,300)],[(297,455),(75,170),(520,170)]]:
                p=c.beginPath();p.moveTo(*pts[0]);p.lineTo(*pts[1]);p.lineTo(*pts[2]);p.lineTo(485 if pts[1][1]==300 else 445 if pts[1][1]==430 else 297,pts[1][1]);p.close();c.drawPath(p)
            c.rect(265,100,64,70,fill=0,stroke=1)
            for x,y in [(240,500),(350,430),(190,350),(300,310),(420,245),(145,235)]:c.circle(x,y,23,fill=0,stroke=1)
        elif kind=='navidad-bolas':
            m.text('CREA UN DISEÑO DIFERENTE EN CADA BOLA',45,680,505,16,True,True)
            for i in range(6):
                x=155+(i%2)*285;y=505-(i//2)*190;c.circle(x,y,72,fill=0,stroke=1);c.rect(x-20,y+72,40,22,fill=0,stroke=1);c.line(x,y+94,x,y+125)
        elif kind=='paz-corazon':
            m.text('DIBUJA O DICTA PALABRAS QUE CUIDAN',45,680,505,16,True,True)
            p=c.beginPath();p.moveTo(297,145);p.curveTo(65,310,120,610,297,505);p.curveTo(475,610,530,310,297,145);c.drawPath(p)
            for y in [380,315,250]:c.line(175,y,420,y)
        elif kind=='carnaval-disfraz':
            m.text('INVENTA EL DISFRAZ: COLORES, TEXTURAS Y COMPLEMENTOS',45,680,505,14,True,True)
            c.circle(297,560,70,fill=0,stroke=1);c.line(297,490,297,260);c.line(297,430,145,350);c.line(297,430,450,350);c.line(297,260,195,110);c.line(297,260,400,110)
            c.setDash(7,5);c.rect(185,270,225,210,fill=0,stroke=1);c.setDash()
        elif kind=='andalucia-28f':
            green=HexColor('#16874a');m.text('28F · BANDERA DE ANDALUCÍA' if coloring else '28F · VERDE, BLANCO Y VERDE',45,680,505,20,True,True)
            for i,label in enumerate(['VERDE','BLANCO','VERDE']):
                y=470-i*125;c.setStrokeColor(INK);c.setFillColor(white if coloring else (HexColor('#d8d8d8') if bw and label=='VERDE' else (green if not bw and label=='VERDE' else white)));c.rect(75,y,445,125,fill=1,stroke=1)
                if not coloring:m.text(label,75,y+52,445,19,True,True,color=white if not bw and label=='VERDE' else INK)
            m.text('DIBUJA ALGO DE ANDALUCÍA',45,135,505,14,True,True);c.setDash(6,4);c.rect(75,62,445,58,fill=0,stroke=1);c.setDash()
        elif kind=='primavera-mariposa':
            m.text('COMPLETA LAS DOS ALAS CON FORMAS Y COLORES',45,680,505,15,True,True)
            c.ellipse(275,205,320,570,fill=0,stroke=1);c.ellipse(100,350,285,620,fill=0,stroke=1);c.ellipse(310,350,495,620,fill=0,stroke=1);c.ellipse(120,155,285,390,fill=0,stroke=1);c.ellipse(310,155,475,390,fill=0,stroke=1);c.line(285,570,235,645);c.line(310,570,360,645)
        elif kind=='libro-marcapaginas':
            m.text('DISEÑA, ESCRIBE TU NOMBRE Y RECORTA CON UN ADULTO',45,680,505,14,True,True)
            for i in range(3):
                x=55+i*175;m.rect(x,105,150,520,False,True)
                if not coloring:m.text('NOMBRE',x+10,575,130,10,True,True);c.line(x+18,545,x+132,545)
                for j in range(5):c.circle(x+35+(j%2)*75,470-j*70,18+j%2*6,fill=0,stroke=1)
        else:
            m.text('DIBUJA A TU CLASE Y UN RECUERDO BONITO',45,680,505,16,True,True);m.rect(55,145,485,490,False,False);m.text('NUESTRA CLASE',75,585,445,25,True,True);m.text('MI RECUERDO:',75,105,140,12,True);c.line(190,102,505,102)
    elif k=='curso-pack':
        moment=r['moment']
        if moment=='Otoño':
            m.new('Clasifico hojas de otoño')
            m.text('UNE CADA HOJA CON SU CESTA',45,680,505,16,True,True)
            for i,art in enumerate(['🍂','🍁','🍃','🍂','🍁','🍃']):m.pic(art,65+(i%3)*170,470-(i//3)*145,95,105)
            for x,label in [(70,'HOJAS AMARILLAS'),(325,'HOJAS MARRONES')]:m.rect(x,105,200,120,False,True);m.text(label,x+10,155,180,12,True,True)
            m.new('Mi observación de otoño')
            m.text('DIBUJO ALGO QUE HE VISTO EN EL PATIO',45,680,505,16,True,True);m.rect(45,325,505,325,False,True)
            m.text('TOCO SU CONTORNO Y CONTINÚO EL CAMINO',45,285,505,14,True)
            c.setStrokeColor(INK);c.setDash(6,5);c.setLineWidth(2);c.bezier(60,180,170,275,330,85,535,205);c.setDash();m.pic('🍂',48,82,90,90);m.pic('🧺',470,175,75,75)
        elif moment=='Halloween':
            m.new('Calabazas para contar')
            for i,n in enumerate(range(1,7)):
                x=42+(i%2)*260;y=410-(i//2)*170;m.rect(x,y,245,145,True,True);m.text(str(n),x+12,y+92,45,32,True,True);m.pic('🎃',x+60,y+25,95,95);m.dots(n,x+160,y+35,72,72)
            m.new('Mi monstruo amable')
            m.text('INVENTA UN PERSONAJE DIVERTIDO: OJOS, BOCA, PELO Y PUNTOS',45,680,505,14,True,True)
            c.setStrokeColor(INK);c.setLineWidth(3);c.setFillColor(white);c.roundRect(120,180,355,430,85,fill=1,stroke=1)
            for x in [210,380]:c.circle(x,470,42,fill=0,stroke=1)
            c.setDash(7,5);c.line(185,350,410,350);c.setDash();m.text('NOMBRE:',95,115,110,14,True);c.line(190,112,500,112)
        elif moment=='Flamenco':
            m.new('Palmas: miro, repito y continúo')
            rhythms=[['👏','·','👏','·',''],['👏','👏','·','👏','👏','·',''],['👏','·','👏','👏','·','👏','']]
            for row,seq in enumerate(rhythms):
                y=540-row*185;m.rect(45,y,505,135,True,True)
                for i,item in enumerate(seq):
                    if item=='👏':m.pic(item,65+i*68,y+37,55,60)
                    elif item=='·':m.text('PAUSA',65+i*68,y+56,55,8,True,True)
            m.new('Diseño un abanico')
            m.text('TRAZA LÍNEAS, PUNTOS Y FORMAS DESDE EL CENTRO',45,680,505,15,True,True)
            c.setStrokeColor(INK);c.setLineWidth(2);c.arc(90,170,505,655,0,180);c.line(90,412,297,170);c.line(505,412,297,170)
            for i in range(1,8):
                ang=math.pi*i/8;c.line(297,170,297+208*math.cos(ang),170+242*math.sin(ang))
            c.circle(297,170,18,fill=0,stroke=1)
        elif moment=='Navidad':
            m.new('Guirnaldas de Navidad')
            patterns=[['●','▲','●','▲','',''],['★','★','●','★','★','●',''],['▲','●','★','▲','●','★','']]
            for row,seq in enumerate(patterns):
                y=545-row*175;m.rect(40,y,515,125,True,True)
                for i,item in enumerate(seq):
                    x=62+i*70
                    if item=='●':m.shape(0,x,y+32,48,row)
                    elif item=='▲':m.shape(2,x,y+32,48,row+1)
                    elif item=='★':m.pic('⭐',x,y+28,52,58)
                    else:pass
            m.new('Una tarjeta hecha por mí')
            m.rect(55,135,485,520,False,True);c.setDash(6,4);c.line(297,135,297,655);c.setDash()
            m.text('DIBUJO PARA ALGUIEN',75,610,200,14,True,True);m.rect(75,270,200,310,False,True)
            m.text('UN MENSAJE QUE DICTO',320,610,190,14,True,True);m.rect(320,270,190,310,False,True);m.text('DE:',330,220,170,12,True);c.line(370,217,500,217)
        elif moment=='Día de la Paz':
            items=[('ESCUCHAR','👂'),('AYUDAR','🤝'),('ESPERAR TURNO','✋'),('EMPUJAR','💥'),('REPARAR','🩹'),('GRITAR','📣')]
            def draw_peace(it,x,y,w,h):m.pic(it[1],x+45,y+55,w-90,h-88);m.text(it[0],x+8,y+25,w-16,10,True,True)
            m.cards(items,draw_peace,2,3)
            m.new('Una palabra que cuida')
            m.text('LA MAESTRA ESCRIBE LA PALABRA QUE YO DIGO',45,680,505,14,True,True);m.rect(75,530,445,105,False,True)
            m.text('HAGO UN DIBUJO PARA EXPLICARLA',45,485,505,14,True,True);m.rect(75,120,445,340,False,True)
        elif moment=='Carnaval':
            m.new('Mi máscara de carnaval')
            m.text('DECORA CON FORMAS, RAYAS, PUNTOS O COLORES',45,680,505,15,True,True)
            c.setStrokeColor(INK);c.setLineWidth(3);c.setFillColor(white);c.ellipse(90,220,505,610,fill=1,stroke=1)
            for x in [210,385]:c.ellipse(x-55,390,x+55,485,fill=0,stroke=1)
            c.setDash(5,4);c.line(90,410,45,430);c.line(505,410,550,430);c.setDash()
            m.new('Diseño un personaje')
            m.text('ELIJO UN SOMBRERO, UN COMPLEMENTO Y UN MOVIMIENTO',45,680,505,14,True,True)
            for i,(label,arts) in enumerate([('SOMBRERO',['🎩','👑','🧢']),('COMPLEMENTO',['👓','🎀','🪄']),('MOVIMIENTO',['↟','↔','○'])]):
                y=520-i*170;m.rect(45,y,505,130,True,True);m.text(label,58,y+98,120,12,True)
                for j,art in enumerate(arts):m.pic(art,190+j*105,y+28,72,72)
        elif moment=='Día de Andalucía':
            m.new('Verde y blanco: continúa')
            green=HexColor('#16874a');m.text('28F · SOLO VERDE Y BLANCO',45,680,505,15,True,True)
            for row,pattern in enumerate([[0,1],[0,0,1],[0,1,1],[0,1,0,1]]):
                y=545-row*120;m.rect(45,y,505,85,True,True)
                for i in range(7):
                    if i>=5:pass
                    else:
                        val=pattern[i%len(pattern)];c.setStrokeColor(INK);c.setFillColor(white if coloring or val else (HexColor('#d8d8d8') if bw else green));c.circle(92.5+i*65,y+42.5,22.5,fill=1,stroke=1)
            m.new('Mi azulejo simétrico')
            m.text('COMPLETA EL OTRO LADO COMO EN UN ESPEJO O INVENTA EL TUYO',45,680,505,14,True,True)
            m.rect(75,145,445,445,False,False);c.setStrokeColor(INK);c.setLineWidth(2);c.line(297,145,297,590);c.line(75,367,520,367)
            for idx,(x,y,n) in enumerate([(125,490,0),(205,490,2),(125,285,1),(210,285,0)]):
                c.setStrokeColor(INK);c.setFillColor(white if coloring or idx%2 else (HexColor('#d8d8d8') if bw else green))
                if n==0:c.circle(x+29,y+29,29,fill=1,stroke=1)
                elif n==1:c.rect(x,y,58,58,fill=1,stroke=1)
                else:
                    p=c.beginPath();p.moveTo(x+29,y+58);p.lineTo(x,y);p.lineTo(x+58,y);p.close();c.drawPath(p,fill=1,stroke=1)
        elif moment=='Primavera':
            m.new('Flores con la cantidad justa')
            for i,n in enumerate(range(1,7)):
                x=48+(i%3)*175;y=385-(i//3)*260;m.rect(x,y,150,230,True,True);m.text(str(n),x,y+188,150,28,True,True)
                c.setStrokeColor(INK);c.line(x+75,y+35,x+75,y+120);c.circle(x+75,y+135,22,fill=0,stroke=1)
                for j in range(n):
                    ang=2*math.pi*j/n if n>1 else 0;c.ellipse(x+75+35*math.cos(ang)-16,y+135+35*math.sin(ang)-22,x+75+35*math.cos(ang)+16,y+135+35*math.sin(ang)+22,fill=0,stroke=1)
            m.new('Mi observación de primavera')
            m.text('HOY HE VISTO…',45,680,505,17,True,True);m.rect(45,330,505,325,False,True)
            for x,label,art in [(45,'COLOR','🎨'),(215,'FORMA','○'),(385,'MOVIMIENTO','↝')]:m.rect(x,135,150,150,True,True);m.pic(art,x+45,185,60,65);m.text(label,x+8,155,134,10,True,True)
        elif moment=='Día del Libro':
            m.new('La portada de mi libro')
            m.rect(65,120,465,540,False,True);m.text('TÍTULO',90,610,415,13,True);c.line(90,575,505,575);m.rect(90,235,415,305,False,True);m.text('AUTOR/A:',90,185,120,12,True);c.line(180,182,505,182)
            m.new('Mi historia en tres momentos')
            for i,label in enumerate(['PRIMERO','DESPUÉS','AL FINAL']):
                x=40+i*177;m.rect(x,160,165,500,False,True);m.text(label,x+8,620,149,12,True,True);m.rect(x+18,255,129,320,False,True);m.text(str(i+1),x+62,195,42,28,True,True)
        else:
            m.new('La maleta de mis recuerdos')
            m.text('DIBUJO ALGO QUE APRENDÍ, ALGO QUE ME GUSTÓ Y ALGUIEN QUE ME AYUDÓ',45,680,505,13,True,True)
            c.setStrokeColor(INK);c.setLineWidth(3);c.roundRect(70,155,455,445,28,fill=0,stroke=1);c.roundRect(210,600,175,60,20,fill=0,stroke=1)
            for i,label in enumerate(['APRENDÍ','ME GUSTÓ','ME AYUDÓ']):m.rect(95,435-i*115,405,92,False,True);m.text(label,108,495-i*115,100,10,True)
            m.new('Diploma: hemos crecido juntos')
            m.rect(50,105,495,565,False,False);m.text('DIPLOMA DE NUESTRA CLASE',70,610,455,25,True,True);m.text('PARA',70,535,455,14,True,True);c.line(115,495,480,495)
            m.text('POR…',70,425,455,14,True,True);m.rect(95,245,405,150,False,True);m.text('UNA APORTACIÓN ESPECIAL',70,190,455,12,True,True);c.line(105,150,490,150)
    elif k in ['memory','domino','bingo','loto','yo-tengo','busca','tablero','ruleta','alimentacion']:
        if k=='memory':m.labeled([(d['short'],'dino:'+d['id']) for _ in range(2) for d in dinos[:6]])
        elif k=='domino':
            pairs=[(i,j) for i in range(4) for j in range(i,4)]
            def draw(pair,x,y,w,h):c.setStrokeColor(INK);c.line(x+w/2,y,x+w/2,y+h);m.pic(ds[pair[0]],x+3,y+7,w/2-6,h-14);m.pic(ds[pair[1]],x+w/2+3,y+7,w/2-6,h-14)
            m.cards(pairs,draw,1,5)
        elif k in ['bingo','loto']:
            count=6 if k=='bingo' else 3
            for b in range(6):
                m.new(('Bingo · cartón ' if k=='bingo' else 'Loto · tablero ')+str(b+1))
                chosen=random.Random(100+b).sample(range(9),count)
                for j,idx in enumerate(chosen):
                    x=35+j%3*176;y=190+(1-j//3)*225
                    m.rect(x,y,166,205);m.pic(ds[idx],x+8,y+35,150,160);m.text(dinos[idx]['short'],x+5,y+17,156,10,True,True)
            m.labeled([(d['short'],'dino:'+d['id']) for d in dinos],3,3)
        elif k=='yo-tengo':
            def draw(i,x,y,w,h):m.text('YO TENGO',x+8,y+h-25,w-16,11,True,True);m.pic(ds[i],x+10,y+h/2+8,w-20,h/2-45);m.text('¿QUIÉN TIENE?',x+8,y+h/2-12,w-16,11,True,True);m.pic(ds[(i+1)%6],x+10,y+6,w-20,h/2-35)
            m.cards(range(6),draw)
        elif k=='busca':
            m.new();m.text('BUSCA ESTOS TRES',35,685,525,16,True,True)
            for i in range(3):m.pic(ds[i],75+i*175,550,105,110)
            seq=[0,3,1,4,2,5,6,0,7,1,8,2,3,0,4,1,5,2]
            for i,n in enumerate(seq):m.pic(ds[n],35+i%6*88,110+(2-i//6)*132,83,115)
        elif k=='tablero':
            m.new();m.text('SALIDA',40,683,100,12,True)
            for i in range(18):
                row=i//3;col=i%3 if row%2==0 else 2-i%3;x=40+col*175;y=90+(5-row)*98
                m.rect(x,y,165,88,True);m.text(str(i+1),x+6,y+58,150,20,True,True)
                if i in [2,5,8,11,14]:m.pic(ds[i%9],x+57,y+3,50,45)
                if i==17:m.text('MUSEO',x+10,y+18,145,15,True,True)
            m.text('Sigue los números. Tira el dado 1-3. Si sobran pasos al llegar al museo, la visita empieza igualmente.',42,735,510,10)
        elif k=='ruleta':
            m.new();cx=W/2;cy=390;rad=205
            c.setStrokeColor(INK);c.setLineWidth(2);c.circle(cx,cy,rad)
            acts=['CAMINAR','ESTIRAR','PARAR','GIRAR DESPACIO','BRAZOS ARRIBA','DESCANSAR']
            for i,a in enumerate(acts):
                ang=i*math.pi/3;c.line(cx,cy,cx+rad*math.cos(ang),cy+rad*math.sin(ang))
                mid=ang+math.pi/6;x=cx+130*math.cos(mid);y=cy+130*math.sin(mid)
                m.text(a,x-65,y,130,12,True,True)
            m.text('Deja caer una ficha grande sobre un sector. No hace falta perforar ni añadir piezas pequeñas.',45,120,505,12)
        else:
            for diet,art in [('HERBÍVOROS','🌿'),('CARNÍVOROS','🐟')]:m.new(diet);m.pic(art,215,555,165,140);m.rect(45,85,505,425)
            m.labeled([(d['short'],'dino:'+d['id']) for d in dinos],3,3)
    elif k in ['carteles','carnets','descubrimiento','diplomas','museo-plan']:
        if k=='carteles':
            for title,art in [('ZONA DE EXCAVACIÓN','🔎'),('NUESTRO MUSEO','🏛️'),('MIRAMOS CON CUIDADO','👀'),('LIMPIAMOS CON SUAVIDAD','🖌️')]:m.new(title);m.text(title,45,620,505,30,True,True);m.pic(art,160,200,275,300)
        elif k=='carnets':
            def draw(i,x,y,w,h):m.text('EQUIPO DE PALEONTOLOGÍA',x+10,y+h-28,w-20,10,True,True);m.rect(x+15,y+48,75,h-94);m.text('MI RETRATO',x+17,y+56,72,7,center=True);m.text('NOMBRE:',x+110,y+h-76,w-125,10,True);c.line(x+110,y+68,x+w-15,y+68)
            m.cards(range(6),draw)
        elif k=='descubrimiento':
            m.new();m.text('DIBUJO LO QUE HE ENCONTRADO',45,680,505,17,True,True);m.rect(45,345,505,310)
            m.text('MI HALLAZGO SE PARECE A…',45,308,505,16,True);m.rect(45,210,505,75)
            m.text('UNA PREGUNTA QUE ME HAGO…',45,170,505,16,True);m.rect(45,75,505,72)
        elif k=='diplomas':
            m.new('Hemos investigado juntos');m.rect(42,80,511,625);m.pic(ds[1],185,440,225,225)
            m.text('DIPLOMA DE CURIOSIDAD',55,418,485,24,True,True);m.text('Para',55,365,485,16,center=True);c.line(100,310,495,310)
            m.text('Gracias por observar, preguntar y cuidar nuestro museo.',75,265,445,16,center=True)
            m.text('TU APORTACIÓN AL EQUIPO',75,194,445,12,True,True);c.line(85,135,510,135)
        else:
            for title in ['CREEMOS QUE…','QUEREMOS SABER…','HEMOS DESCUBIERTO…']:m.new(title);m.text(title,40,675,515,25,True,True);m.rect(42,75,511,555)
    else:raise ValueError('Missing printable renderer: '+k)
    return m.finish()

def build_external(r):
    """Keep the supplied color PDF and derive print-friendly monochrome variants."""
    source=ROOT/'sources'/'imported'/r['externalPdf']
    if not source.is_file():raise FileNotFoundError(source)
    color_target=OUT/'pdf'/(r['id']+'.pdf')
    shutil.copyfile(source,color_target)
    doc=fitz.open(source); rendered=[]
    for page in doc:
        pix=page.get_pixmap(matrix=fitz.Matrix(1.25,1.25),alpha=False)
        rendered.append(Image.frombytes('RGB',[pix.width,pix.height],pix.samples))
    page_count=len(rendered);doc.close()
    for suffix,converter in [('-bn',lambda im:ImageOps.grayscale(im).convert('RGB')),('-colorear',outline_image)]:
        pages=[converter(im) for im in rendered]
        pages[0].save(OUT/'pdf'/(r['id']+suffix+'.pdf'),save_all=True,append_images=pages[1:],resolution=90,quality=65,optimize=True)
    return page_count

def main():
    # Additional visual tokens used by the interactive pattern workshop.
    for char in ['🐱','🦆','🐰','✏️','📚','✂️','🌿','🍂','🍃','🍎','🍊','🍇','⚽','🚗','🧸']:
        symbol_image(char)
    for folder in [OUT/'assets/dinos-pdi',OUT/'assets/vocab-child',OUT/'assets/symbols',OUT/'assets/dino-footprints']:
        for path in folder.glob('*'):
            if path.is_file() and '-outline' not in path.stem and path.suffix.lower() in {'.png','.jpg','.jpeg','.webp'}:
                outline_asset(path)
    resources=[r for r in DATA['resources'] if r['printable']]
    manifest={}
    for r in resources:
        if r.get('externalPdf'):
            n=build_external(r)
        else:
            n=build_one(r,False); nb=build_one(r,True)
            assert n==nb
            nc=build_one(r,True,True);assert n==nc
        entry={'pages':n,'pdf':'pdf/'+r['id']+'.pdf','bw':'pdf/'+r['id']+'-bn.pdf','preview':'previews/'+r['id']+'.webp'}
        entry['coloring']='pdf/'+r['id']+'-colorear.pdf'
        manifest[r['id']]=entry
    def render(r):
        variants=[(False,''),(True,'-bn'),(True,'-colorear')]
        for bw,suffix in variants:
            stem=r['id']+suffix
            doc=fitz.open(OUT/'pdf'/(stem+'.pdf'))
            for i,p in enumerate(doc):
                scale=1 if r.get('externalPdf') else 1.5
                pix=p.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
                im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
                im.save(OUT/'pages'/(stem+'-'+str(i+1)+'.jpg'),quality=65 if r.get('externalPdf') else 86,optimize=bool(r.get('externalPdf')))
                if i==0 and suffix!='-colorear':
                    im.thumbnail((420,595));im.save(OUT/'previews'/(stem+'.webp'),quality=85)
            doc.close()
    with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(render,resources))
    (OUT/'materials.json').write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf8')
    entries=''.join('<li><a href="'+v['pdf']+'">'+html.escape(next(r['title'] for r in resources if r['id']==k))+'</a> · <a href="'+v['bw']+'">Bajo consumo</a></li>' for k,v in manifest.items())
    (OUT/'materiales.html').write_text('''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="refresh" content="0;url=index.html#imprimibles">
  <title>Imprimibles · La Clase Rosa</title>
  <script>location.replace('index.html#imprimibles');</script>
</head>
<body><p><a href="index.html#imprimibles">Ir a los imprimibles</a></p></body>
</html>
''',encoding='utf8')
    print(json.dumps({'resources':len(resources),'pdf_files':sum(2+('coloring' in v) for v in manifest.values()),'pages_color':sum(v['pages'] for v in manifest.values()),'emoji_font_available':emoji_font.exists()}))

if __name__=='__main__':main()
