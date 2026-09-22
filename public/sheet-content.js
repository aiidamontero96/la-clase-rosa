'use strict';

window.ROSA_SHEET_CONTENT = (() => {
  const vocabAsset=(file,label)=>({type:'image',src:'assets/vocab-child/'+file+'.webp',label});
  const symbolAsset=(hex,label)=>({type:'image',src:'assets/symbols/'+hex+'.png',label});
  const colorAsset=(label,color)=>({type:'color',label,color});

  const cleanLetters=text=>[...String(text).toLocaleUpperCase('es-ES').replace(/[^A-ZÁÉÍÓÚÜÑ]/g,'')];
  const entry=(id,word,item,syllables)=> {
    const letters=cleanLetters(word);
    return {
      id,
      word:String(word).toLocaleUpperCase('es-ES'),
      item,
      syllables,
      letters:letters.length,
      initial:letters[0]||'',
      final:letters.at(-1)||''
    };
  };

  const vocabulary={
    Animales:[
      entry('gato','GATO',vocabAsset('cat','Gato'),2),
      entry('pato','PATO',vocabAsset('duck','Pato'),2),
      entry('perro','PERRO',vocabAsset('dog','Perro'),2),
      entry('pez','PEZ',vocabAsset('fish','Pez'),1),
      entry('conejo','CONEJO',vocabAsset('rabbit','Conejo'),3),
      entry('mariposa','MARIPOSA',vocabAsset('butterfly','Mariposa'),4),
      entry('leon','LEÓN',symbolAsset('1f981','León'),2),
      entry('elefante','ELEFANTE',symbolAsset('1f418','Elefante'),4)
    ],
    Frutas:[
      entry('pera','PERA',vocabAsset('pear','Pera'),2),
      entry('uva','UVA',vocabAsset('grapes','Uvas'),2),
      entry('fresa','FRESA',vocabAsset('strawberry','Fresa'),2),
      entry('platano','PLÁTANO',vocabAsset('banana','Plátano'),3),
      entry('manzana','MANZANA',vocabAsset('apple','Manzana'),3),
      entry('naranja','NARANJA',vocabAsset('orange','Naranja'),3)
    ],
    Aula:[
      entry('lapiz','LÁPIZ',vocabAsset('pencil','Lápiz'),2),
      entry('libro','LIBRO',vocabAsset('books','Libro'),2),
      entry('tijeras','TIJERAS',vocabAsset('scissors','Tijeras'),3),
      entry('pelota','PELOTA',vocabAsset('ball','Pelota'),3),
      entry('coche','COCHE',vocabAsset('toy-car','Coche'),2),
      entry('oso','OSO',vocabAsset('teddy','Oso de peluche'),2),
      entry('colegio','COLEGIO',vocabAsset('school','Colegio'),3),
      entry('cuento','CUENTO',vocabAsset('open-book','Cuento'),2)
    ],
    Naturaleza:[
      entry('sol','SOL',vocabAsset('sun','Sol'),1),
      entry('nube','NUBE',vocabAsset('cloud','Nube'),2),
      entry('arbol','ÁRBOL',vocabAsset('tree','Árbol'),2),
      entry('hoja','HOJA',vocabAsset('autumn-leaf','Hoja'),2),
      entry('flor','FLOR',vocabAsset('tulip','Flor'),1),
      entry('lluvia','LLUVIA',vocabAsset('rain','Lluvia'),2),
      entry('planta','PLANTA',vocabAsset('herb','Planta'),2),
      entry('brote','BROTE',vocabAsset('seedling','Brote'),2)
    ],
    Andalucía:[
      entry('sol-and','SOL',vocabAsset('sun','Sol'),1),
      entry('naranja-and','NARANJA',vocabAsset('orange','Naranja'),3),
      entry('playa','PLAYA',vocabAsset('beach','Playa'),2),
      entry('flor-and','FLOR',vocabAsset('tulip','Flor'),1),
      entry('musica','MÚSICA',symbolAsset('1f3b5','Música'),3),
      entry('parque','PARQUE',vocabAsset('playground','Parque'),2),
      entry('arbol-and','ÁRBOL',vocabAsset('tree','Árbol'),2),
      entry('nube-and','NUBE',vocabAsset('cloud','Nube'),2)
    ],
    Rutinas:[
      entry('leer','LEER',vocabAsset('open-book','Leer'),2),
      entry('jugar','JUGAR',vocabAsset('playing-teddy','Jugar'),2),
      entry('regar','REGAR',vocabAsset('watering','Regar'),2),
      entry('saludar','SALUDAR',vocabAsset('hello','Saludar'),3),
      entry('escribir','ESCRIBIR',vocabAsset('writing','Escribir'),3),
      entry('abrigo','ABRIGO',vocabAsset('coat','Abrigo'),3),
      entry('recoger','RECOGER',vocabAsset('tidy-toys','Recoger'),3),
      entry('lavar','LAVAR',vocabAsset('handwashing','Lavarse las manos'),2)
    ],
    Emociones:[
      entry('feliz','FELIZ',vocabAsset('happy','Contento'),2),
      entry('triste','TRISTE',vocabAsset('sad','Triste'),2),
      entry('enfado','ENFADO',vocabAsset('angry','Enfadado'),3),
      entry('sorpresa','SORPRESA',vocabAsset('surprised','Sorprendido'),3),
      entry('miedo','MIEDO',vocabAsset('worried','Preocupado'),2),
      entry('saludo','SALUDO',vocabAsset('wave','Saludo'),3)
    ],
    'El tiempo':[
      entry('sol-tiempo','SOL',vocabAsset('sun','Sol'),1),
      entry('nube-tiempo','NUBE',vocabAsset('cloud','Nube'),2),
      entry('lluvia-tiempo','LLUVIA',vocabAsset('rain','Lluvia'),2),
      entry('viento','VIENTO',vocabAsset('wind','Viento'),2),
      entry('nubes','NUBES',vocabAsset('partly-cloudy','Sol y nubes'),2),
      entry('frio','FRÍO',vocabAsset('snowman','Frío'),2)
    ],
    Juguetes:[
      entry('oso-juguete','OSO',vocabAsset('teddy','Peluche'),2),
      entry('pelota-juguete','PELOTA',vocabAsset('ball','Pelota'),3),
      entry('coche-juguete','COCHE',vocabAsset('toy-car','Coche'),2),
      entry('lana','LANA',vocabAsset('yarn','Lana'),2),
      entry('libro-juguete','LIBRO',vocabAsset('books','Libro'),2),
      entry('lapiz-juguete','LÁPIZ',vocabAsset('pencil','Lápiz'),2)
    ],
    Primavera:[
      entry('flor-pri','FLOR',vocabAsset('tulip','Flor'),1),
      entry('sol-pri','SOL',vocabAsset('sun','Sol'),1),
      entry('lluvia-pri','LLUVIA',vocabAsset('rain','Lluvia'),2),
      entry('arbol-pri','ÁRBOL',vocabAsset('tree','Árbol'),2),
      entry('hoja-pri','HOJA',vocabAsset('autumn-leaf','Hoja'),2),
      entry('mariposa-pri','MARIPOSA',vocabAsset('butterfly','Mariposa'),4),
      entry('brote-pri','BROTE',vocabAsset('seedling','Brote'),2)
    ],
    Lugares:[
      entry('casa','CASA',vocabAsset('house','Casa'),2),
      entry('colegio-lugar','COLEGIO',vocabAsset('school','Colegio'),3),
      entry('parque-lugar','PARQUE',vocabAsset('playground','Parque'),2),
      entry('playa-lugar','PLAYA',vocabAsset('beach','Playa'),2),
      entry('estadio','ESTADIO',vocabAsset('stadium','Estadio'),3),
      entry('biblioteca','BIBLIOTECA',vocabAsset('library','Biblioteca'),4)
    ],
    Arte:[
      entry('pincel','PINCEL',vocabAsset('paintbrush','Pincel'),2),
      entry('lapiz-arte','LÁPIZ',vocabAsset('pencil','Lápiz'),2),
      entry('tijeras-arte','TIJERAS',vocabAsset('scissors','Tijeras'),3),
      entry('lana-arte','LANA',vocabAsset('yarn','Lana'),2),
      entry('libro-arte','LIBRO',vocabAsset('books','Libro'),2),
      entry('adorno','ADORNO',vocabAsset('rosette','Adorno'),3)
    ],
    'Higiene y autonomía':[
      entry('manos','MANOS',vocabAsset('handwashing','Lavarse las manos'),2),
      entry('dientes','DIENTES',vocabAsset('brushing-teeth','Cepillarse los dientes'),2),
      entry('abrigo-aut','ABRIGO',vocabAsset('coat','Abrigo'),3),
      entry('recoger-aut','RECOGER',vocabAsset('tidy-toys','Recoger'),3),
      entry('regar-aut','REGAR',vocabAsset('watering','Regar'),2),
      entry('saludar-aut','SALUDAR',vocabAsset('hello','Saludar'),3)
    ]
  };

  const colors=[
    colorAsset('Rojo','#ef5350'),colorAsset('Azul','#42a5f5'),colorAsset('Amarillo','#f4c542'),
    colorAsset('Verde','#43a86b'),colorAsset('Rosa','#ef7aa8'),colorAsset('Naranja','#f59a45'),
    colorAsset('Morado','#8d6dcc'),colorAsset('Celeste','#68c7db')
  ];

  const playThemes=Object.fromEntries(
    Object.entries(vocabulary).map(([name,items])=>[name,items.map(item=>item.item)])
  );
  playThemes.Colores=colors;

  const letterSets={
    MPS:['M','P','S'],
    LTN:['L','T','N'],
    DCR:['D','C','R'],
    BFG:['B','F','G']
  };
  const caseSets={
    vocales:['A','E','I','O','U'],
    inicio:['M','P','S','L','T','N'],
    amplia:['D','C','R','B','F','G'],
    mezcla:['A','M','E','P','I','S']
  };
  const schoolGlyph=letter=>window.ROSA_SCHOOL_SCRIPT.glyph(letter);

  return {
    vocabulary,
    playThemes,
    themeNames:[...Object.keys(vocabulary),'Colores'],
    languageThemeNames:Object.keys(vocabulary),
    letterSets,
    caseSets,
    schoolGlyph,
    shapeColors:['#f4a3bd','#6eb7e8','#f2c94c','#74c69d'],
    outlineSrc:src=>src.replace(/(\.[a-z0-9]+)$/i,'-outline$1')
  };
})();
