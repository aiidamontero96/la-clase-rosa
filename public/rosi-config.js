'use strict';
window.ROSA_EPISODES=(()=>{
  // Change the mascot's name here; spoken lines and titles use this value.
  const mascot={name:'Rosi',atlas:'assets/rosi/rosi-atlas.webp',head:'assets/rosi/rosi-head.webp',background:'assets/rosi/valle.webp'};
  const pupils=['Tristán','Emma','Alma','Alejandro','Marcelo','Sergio','Martín','Abril','Francisco','Álvaro'];
  const episodes=[{
    id:'dinosaurio-escondido',week:1,title:'El dinosaurio escondido',helpers:['Tristán','Emma'],
    mission:{label:'Seis retos de observación, pistas y memoria'},
    scenes:[
      {text:'¡Hola, pequeños paleontólogos!',expression:'happy',gesture:'wave',prop:'welcome'},
      {text:'Soy {mascot}. Me encanta explorar, aunque a veces se me despistan las pistas.',expression:'curious',gesture:'think',prop:'welcome'},
      {text:'¡Mirad! He encontrado unas huellas junto a mi mochila.',expression:'surprised',gesture:'point',prop:'tracks'},
      {text:'¿Serán de un dinosaurio? Vamos a mirar con mucho cuidado.',expression:'curious',gesture:'think',prop:'tracks'},
      {text:'{helper1} y {helper2}, hoy sois mis ayudantes de exploración.',expression:'happy',gesture:'wave',prop:'helpers'},
      {text:'{helper1}, ayúdame a observar los dinosaurios.',expression:'happy',gesture:'point',prop:'helpers',spotlight:0},
      {text:'{helper2}, fíjate bien en sus formas.',expression:'happy',gesture:'point',prop:'helpers',spotlight:1},
      {text:'Y los demás pequeños paleontólogos también podéis ayudarnos.',expression:'happy',gesture:'wave',prop:'helpers'},
      {text:'Primero compararemos sus cuerpos. Después, se esconderán dos dinosaurios.',expression:'curious',gesture:'point',prop:'dinosaurs'},
      {text:'Recordad las pistas y el orden. Nos esperan varios retos.',expression:'curious',gesture:'think',prop:'hidden'},
      {text:'¡Creo que ya tengo todas mis pistas! ¿Empezamos la misión?',expression:'happy',gesture:'celebrate',prop:'ready'}
    ]
  }];
  function lines(episode){return episode.scenes.map(scene=>({...scene,text:scene.text.replaceAll('{mascot}',mascot.name).replaceAll('{helper1}',episode.helpers[0]).replaceAll('{helper2}',episode.helpers[1])}));}
  return {mascot,pupils,episodes,lines};
})();
