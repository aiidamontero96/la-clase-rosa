'use strict';
(() => {
  const weeks=[
  {
    "title": "¡Han aparecido huellas!",
    "question": "¿QUÉ PODEMOS SABER MIRANDO UN RASTRO?",
    "word": "HUELLA",
    "lessons": [
      {
        "image": "human-track",
        "title": "NUESTROS PIES DEJAN MARCAS",
        "text": "AL PISAR ARENA HÚMEDA, EL PIE PUEDE DEJAR UNA HUELLA.",
        "question": "BUSCA EL TALÓN Y LOS DEDOS EN ESTA MARCA."
      },
      {
        "image": "track",
        "title": "UNA PISTA CON TRES DEDOS",
        "text": "ESTE MODELO DE HUELLA TIENE TRES PUNTAS HACIA DELANTE.",
        "question": "CUENTA LAS PUNTAS. ¿TIENE LA MISMA FORMA QUE TU PIE?"
      },
      {
        "image": "skeleton",
        "title": "LOS HUESOS NOS DAN PISTAS",
        "text": "EN LOS MUSEOS PODEMOS OBSERVAR ESQUELETOS DE DINOSAURIOS.",
        "question": "SEÑALA LA CABEZA Y LAS PATAS QUE VES."
      }
    ],
    "challenges": [
      {
        "prompt": "HAY TRES MARCAS. SI AÑADIMOS UNA MÁS, ¿CUÁNTAS HABRÁ?",
        "visual": "@trail",
        "choices": [
          {
            "label": "TRES",
            "mark": "3",
            "icon": "③"
          },
          {
            "label": "CUATRO",
            "mark": "4",
            "icon": "④"
          },
          {
            "label": "CINCO",
            "mark": "5",
            "icon": "⑤"
          }
        ],
        "answer": 1,
        "hint": "CUENTA LAS TRES Y AÑADE UN DEDO MÁS.",
        "success": "TRES Y UNA MÁS SON CUATRO."
      },
      {
        "prompt": "MIRA A COELOPHYSIS: ¿CUÁNTAS PATAS USA PARA CAMINAR?",
        "visual": "coelophysis",
        "choices": [
          {
            "label": "DOS",
            "mark": "2",
            "icon": "②"
          },
          {
            "label": "CUATRO",
            "mark": "4",
            "icon": "④"
          },
          {
            "label": "UNA",
            "mark": "1",
            "icon": "①"
          }
        ],
        "answer": 0,
        "hint": "DISTINGUE LOS BRAZOS DE LAS PATAS TRASERAS.",
        "success": "CAMINABA SOBRE LAS DOS PATAS TRASERAS."
      }
    ],
    "draw": {
      "mode": "paint",
      "title": "COLOREAMOS LOS DOS T. REX",
      "prompt": "ELIGE UN COLOR Y PINTA SOLO LOS DOS T. REX.",
      "animals": [
        "trex",
        "triceratops",
        "trex-two",
        "spinosaurus"
      ],
      "targets": [
        0,
        2
      ],
      "purpose": "Reconocer una especie en dos posturas entre cuatro animales. Pintar al tocar, sin precisión motriz obligatoria."
    },
    "teacher": [
      "Distinguir una observación de una suposición.",
      "Modela una huella y pregunta qué ven antes de preguntar quién la hizo. Una huella de tres dedos no permite identificar por sí sola un T. rex.",
      "Explica una diferencia entre una huella humana y el modelo; anticipa tres más una."
    ]
  },
  {
    "title": "Viajamos millones de años atrás",
    "question": "¿VIVIERON TODOS AL MISMO TIEMPO?",
    "word": "TIERRA",
    "lessons": [
      {
        "image": "triassic",
        "title": "PRIMERO: TRIÁSICO",
        "text": "APARECIERON LOS PRIMEROS DINOSAURIOS, COMO EORAPTOR.",
        "question": "OBSERVA SUS DOS PATAS TRASERAS. VAMOS A CONOCER SU ETAPA."
      },
      {
        "image": "jurassic",
        "title": "DESPUÉS: JURÁSICO",
        "text": "EN ESTA ETAPA VIVIERON GIGANTES DE CUELLO LARGO.",
        "question": "BUSCA EL CUELLO QUE LLEGA HASTA LAS RAMAS."
      },
      {
        "image": "cretaceous",
        "title": "AL FINAL: CRETÁCICO",
        "text": "TRICERATOPS VIVIÓ AL FINAL DE ESTA ETAPA.",
        "question": "OBSERVA SU CABEZA CON CUERNOS. ENTRAMOS EN SU MUNDO."
      }
    ],
    "challenges": [
      {
        "prompt": "RECUERDA LA VISITA: ¿EN QUÉ ETAPA VIVIÓ BRAQUIOSAURIO?",
        "visual": "brachiosaurus",
        "choices": [
          {
            "label": "TRIÁSICO",
            "mark": "1",
            "icon": "🌵"
          },
          {
            "label": "JURÁSICO",
            "mark": "2",
            "icon": "🌲"
          },
          {
            "label": "CRETÁCICO",
            "mark": "3",
            "icon": "🌸"
          }
        ],
        "answer": 1,
        "hint": "ES LA ETAPA QUE VISITAMOS EN SEGUNDO LUGAR.",
        "success": "BRAQUIOSAURIO VIVIÓ EN EL JURÁSICO."
      },
      {
        "prompt": "YA VISITAMOS TRIÁSICO Y JURÁSICO. ¿QUÉ CAPÍTULO SIGUE?",
        "visual": "@timeline",
        "choices": [
          {
            "label": "CRETÁCICO",
            "mark": "3",
            "icon": "🌸"
          },
          {
            "label": "TRIÁSICO",
            "mark": "1",
            "icon": "🌵"
          },
          {
            "label": "JURÁSICO",
            "mark": "2",
            "icon": "🌲"
          }
        ],
        "answer": 0,
        "hint": "SEGUIMOS HACIA DELANTE, HASTA LA TERCERA VENTANA.",
        "success": "AL FINAL DE NUESTRO VIAJE ESTÁ EL CRETÁCICO."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "MI PAISAJE DEL JURÁSICO",
      "prompt": "DIBUJA UN RÍO, HELECHOS Y UN LUGAR PARA DESCANSAR.",
      "guide": "landscape",
      "purpose": "Representar un ambiente a partir de la visita al Jurásico."
    },
    "teacher": [
      "Comprender primero, después y al final.",
      "Usa tres cartulinas en fila. Los nombres de las etapas se escuchan y se señalan; no se exige memorizarlos ni entender millones de años.",
      "Reconoce primero, después y al final con apoyo de los capítulos."
    ]
  },
  {
    "title": "Gigantes y pequeñitos",
    "question": "¿CÓMO COMPARAMOS DOS DINOSAURIOS?",
    "word": "LARGO",
    "lessons": [
      {
        "image": "little",
        "title": "UN CUERPO LIGERO",
        "text": "COELOPHYSIS ERA MUCHO MENOR QUE UN GRAN SAURÓPODO. CAMINABA SOBRE DOS PATAS.",
        "question": "¿QUÉ PATAS TOCAN EL SUELO EN ESTA ESCENA?"
      },
      {
        "image": "giant",
        "title": "UN CUELLO MUY ALTO",
        "text": "EL BRAQUIOSAURIO TENÍA UN CUELLO LARGO Y SE APOYABA EN CUATRO PATAS.",
        "question": "SIGUE SU CUELLO DESDE EL CUERPO HASTA LA CABEZA."
      },
      {
        "image": "diplodocus",
        "title": "UNA COLA LARGUÍSIMA",
        "text": "DIPLODOCUS TENÍA UNA COLA MUY LARGA. NO TODAS LAS PARTES MEDÍAN IGUAL.",
        "question": "COMPARA SU COLA CON UNA PATA EN ESTA MISMA IMAGEN."
      }
    ],
    "challenges": [
      {
        "prompt": "LAS TRES CUERDAS EMPIEZAN JUNTAS. ¿CUÁL LLEGA MÁS LEJOS?",
        "visual": "@ropes",
        "choices": [
          {
            "label": "LA AZUL",
            "mark": "blue",
            "icon": "🔵"
          },
          {
            "label": "LA VERDE",
            "mark": "green",
            "icon": "🟢"
          },
          {
            "label": "LA ROSA",
            "mark": "pink",
            "icon": "🩷"
          }
        ],
        "answer": 1,
        "hint": "MIRA EL EXTREMO DE CADA CUERDA.",
        "success": "LA VERDE ES LA MÁS LARGA EN ESTE MODELO."
      },
      {
        "prompt": "¿CUÁNTOS BRAZOS Y PATAS TIENE EN TOTAL ESTE HERRERASAURIO?",
        "visual": "herrerasaurus",
        "choices": [
          {
            "label": "DOS",
            "mark": "2",
            "icon": "②"
          },
          {
            "label": "TRES",
            "mark": "3",
            "icon": "③"
          },
          {
            "label": "CUATRO",
            "mark": "4",
            "icon": "④"
          }
        ],
        "answer": 2,
        "hint": "CUENTA DOS BRAZOS Y DOS PATAS.",
        "success": "DOS BRAZOS Y DOS PATAS: CUATRO EXTREMIDADES."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "DOS CUELLOS DIFERENTES",
      "prompt": "DESDE LAS DOS MARCAS, DIBUJA UN CUELLO LARGO Y OTRO CORTO.",
      "guide": "lengths",
      "purpose": "Comparar longitudes desde un mismo inicio."
    },
    "teacher": [
      "Comparar tamaño, longitud y cantidades pequeñas.",
      "Compara figuras a la misma escala cuando hables de tamaño real. Coelophysis era pequeño frente a un saurópodo, no necesariamente frente a un niño.",
      "Compara longitudes sin confundir tamaño de imagen y tamaño real."
    ]
  },
  {
    "title": "¡A comer, dinosaurios!",
    "question": "¿QUÉ NOS CUENTAN SUS DIENTES?",
    "word": "PLANTA",
    "lessons": [
      {
        "image": "fern",
        "title": "PLANTAS PARA COMER",
        "text": "LOS DINOSAURIOS HERBÍVOROS COMÍAN PLANTAS. LOS HELECHOS SON PLANTAS.",
        "question": "BUSCA LAS HOJAS. ¿SON TODAS IGUALES DE GRANDES?"
      },
      {
        "image": "tooth",
        "title": "UN DIENTE CON PUNTAS",
        "text": "ESTE DIENTE FÓSIL ES DE UN T. REX. LE AYUDABA A COMER CARNE.",
        "question": "MIRA SU PUNTA Y LOS BORDES. ¿PARECE UNA HOJA?"
      },
      {
        "image": "plateosaurus",
        "title": "OTRO COMEDOR DE PLANTAS",
        "text": "EL PLATEOSAURIO TAMBIÉN ERA HERBÍVORO. NO TODOS LOS HERBÍVOROS ERAN IGUALES.",
        "question": "OBSERVA SU CUELLO Y SUS PATAS. IMITA SU POSTURA."
      }
    ],
    "challenges": [
      {
        "prompt": "ESTAS HOJAS SON PARTES DE PLANTAS. ¿PARA QUIÉN SON ALIMENTO?",
        "visual": "leaves",
        "choices": [
          {
            "label": "HERBÍVORO",
            "mark": "",
            "icon": "🌿"
          },
          {
            "label": "CARNÍVORO",
            "mark": "",
            "icon": "🥩"
          }
        ],
        "answer": 0,
        "hint": "HERBÍVORO SIGNIFICA QUE COME PLANTAS.",
        "success": "LOS HERBÍVOROS COMÍAN PLANTAS."
      },
      {
        "prompt": "EL PLATEOSAURIO ERA HERBÍVORO. ¿QUÉ PREPARAMOS PARA ÉL?",
        "visual": "plateo-scene",
        "choices": [
          {
            "label": "PLANTAS",
            "mark": "",
            "icon": "🌿"
          },
          {
            "label": "CARNE",
            "mark": "",
            "icon": "🥩"
          },
          {
            "label": "PIEDRAS",
            "mark": "",
            "icon": "🪨"
          }
        ],
        "answer": 0,
        "hint": "RECUERDA QUÉ SIGNIFICA HERBÍVORO.",
        "success": "LE PREPARAMOS PLANTAS."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "UN JARDÍN PARA COMER",
      "prompt": "DIBUJA TRES PLANTAS DISTINTAS PARA UN HERBÍVORO.",
      "guide": "garden",
      "purpose": "Combinar cantidad y representación de alimentos vegetales."
    },
    "teacher": [
      "Relacionar dos animales con su alimento.",
      "Presenta herbívoro y carnívoro después de plantas y carne. Los dientes varían; evita enseñar que todos los herbívoros tenían el mismo diente.",
      "Relaciona plantas y herbívoros; describe una característica del diente."
    ]
  },
  {
    "title": "Dientes, cuernos y colas",
    "question": "¿QUÉ PISTAS ESCONDE SU CUERPO?",
    "word": "CUERNO",
    "lessons": [
      {
        "image": "skull",
        "title": "CUERNOS EN LA CABEZA",
        "text": "ESTE CRÁNEO ES DE TRICERATOPS. TENÍA CUERNOS Y UN GRAN ESCUDO ÓSEO.",
        "question": "BUSCA EL CUERNO QUE SE VE MÁS LARGO. ALGUNOS QUEDAN OCULTOS DE LADO."
      },
      {
        "image": "stegosaurus",
        "title": "PLACAS EN EL LOMO",
        "text": "ESTEGOSAURIO TENÍA GRANDES PLACAS SOBRE EL LOMO Y PÚAS EN LA COLA.",
        "question": "SIGUE LA FILA DE PLACAS: ¿ESTÁN EN EL LOMO O EN LAS PATAS?"
      },
      {
        "image": "ankylosaurus",
        "title": "UNA MAZA EN LA COLA",
        "text": "ANQUILOSAURIO TENÍA PLACAS ÓSEAS Y UNA MAZA AL FINAL DE LA COLA.",
        "question": "SEÑALA EL EXTREMO DE SU COLA. ¿ES FINO O GRUESO?"
      }
    ],
    "challenges": [
      {
        "prompt": "BUSCA LA MAZA DEL ANQUILOSAURIO. ¿DÓNDE ESTÁ?",
        "visual": "anky-scene",
        "choices": [
          {
            "label": "EN LA CABEZA",
            "mark": "",
            "icon": "🦖"
          },
          {
            "label": "AL FINAL DE LA COLA",
            "mark": "",
            "icon": "🦕"
          },
          {
            "label": "EN UNA PATA",
            "mark": "",
            "icon": "🐾"
          }
        ],
        "answer": 1,
        "hint": "SIGUE LA COLA HASTA SU EXTREMO.",
        "success": "LA MAZA ESTÁ AL FINAL DE LA COLA."
      },
      {
        "prompt": "¿QUÉ PARTE DE ESTE PAQUICEFALOSAURIO PARECE UN CASCO?",
        "visual": "pachy-scene",
        "choices": [
          {
            "label": "LA COLA",
            "mark": "",
            "icon": "🦕"
          },
          {
            "label": "LA CABEZA",
            "mark": "",
            "icon": "🦖"
          },
          {
            "label": "EL PIE",
            "mark": "",
            "icon": "🐾"
          }
        ],
        "answer": 1,
        "hint": "OBSERVA LA FORMA REDONDEADA SOBRE LOS OJOS.",
        "success": "SU CABEZA TENÍA UNA CÚPULA ÓSEA GRUESA."
      }
    ],
    "draw": {
      "mode": "paint",
      "title": "PINTAMOS UN DINOSAURIO",
      "prompt": "PINTA UN PAQUICEFALOSAURIO. ¿CUÁNTOS HAS PINTADO?",
      "animals": [
        "pachycephalosaurus"
      ],
      "targets": [
        0
      ],
      "purpose": "Relacionar la cantidad uno con un animal completo coloreado."
    },
    "teacher": [
      "Reconocer partes del cuerpo y describir diferencias.",
      "Señala las partes en imágenes. No atribuyas una única función demostrada a todas las placas o cuernos.",
      "Señala una parte del cuerpo y utiliza una pista para reconocer al animal."
    ]
  },
  {
    "title": "Un huevo misterioso",
    "question": "¿CÓMO EMPEZABA SU VIDA?",
    "word": "HUEVO",
    "lessons": [
      {
        "image": "eggs",
        "title": "HUEVOS DEL PASADO",
        "text": "ALGUNOS HUEVOS DE DINOSAURIO SE CONSERVARON COMO FÓSILES.",
        "question": "OBSERVA SU FORMA. SON FÓSILES: DE ELLOS YA NO NACERÁ UNA CRÍA."
      },
      {
        "image": "nest",
        "title": "OBSERVAMOS UN NIDO ACTUAL",
        "text": "ESTE ES UN NIDO DE AVE DE HOY. LAS AVES TAMBIÉN PONEN HUEVOS.",
        "question": "¿QUÉ HAY ALREDEDOR DE LOS HUEVOS? LOS NIDOS DE DINOSAURIO NO ERAN TODOS IGUALES."
      },
      {
        "image": "juvenile",
        "title": "TAMBIÉN FUERON CRÍAS",
        "text": "ESTA COPIA DE MUSEO MUESTRA EL ESQUELETO DE UNA MAIASAURA JOVEN. LAS CRÍAS CRECÍAN.",
        "question": "SEÑALA SU CABEZA Y SU COLA. ¿QUÉ HA CAMBIADO EN TI AL CRECER?"
      }
    ],
    "challenges": [
      {
        "prompt": "HAY UN HUEVO EN CADA NIDO. ¿CUÁNTOS NECESITAMOS PARA QUE HAYA DOS EN CADA UNO?",
        "visual": "@nests",
        "choices": [
          {
            "label": "UNO MÁS",
            "mark": "1",
            "icon": "①"
          },
          {
            "label": "DOS MÁS",
            "mark": "2",
            "icon": "②"
          },
          {
            "label": "TRES MÁS",
            "mark": "3",
            "icon": "③"
          }
        ],
        "answer": 2,
        "hint": "A CADA UNO DE LOS TRES NIDOS LE FALTA UN HUEVO.",
        "success": "NECESITAMOS TRES HUEVOS MÁS: UNO PARA CADA NIDO."
      },
      {
        "prompt": "¿QUÉ CASCARÓN YA SE HA ABIERTO?",
        "visual": "@shells",
        "choices": [
          {
            "label": "EL PRIMERO",
            "mark": "1",
            "icon": "①"
          },
          {
            "label": "EL SEGUNDO",
            "mark": "2",
            "icon": "②"
          },
          {
            "label": "EL TERCERO",
            "mark": "3",
            "icon": "③"
          }
        ],
        "answer": 1,
        "hint": "BUSCA LAS DOS PARTES SEPARADAS.",
        "success": "PARA SALIR, LA CRÍA ROMPE EL CASCARÓN."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "UN NIDO CON TRES HUEVOS",
      "prompt": "DIBUJA UN NIDO Y COLOCA TRES HUEVOS DENTRO.",
      "guide": "blank",
      "purpose": "Representar dentro/fuera y una colección de tres elementos."
    },
    "teacher": [
      "Comprender una secuencia de tres momentos.",
      "Compara huevos fósiles, un nido actual de ave y una copia de esqueleto juvenil. Explica que los fósiles no eclosionan y que no todos los dinosaurios construían el mismo nido.",
      "Distribuye uno más en cada nido; distingue fósiles y huevos actuales."
    ]
  },
  {
    "title": "Cielo y mar prehistóricos",
    "question": "¿ALAS, ALETAS O PATAS?",
    "word": "ALAS",
    "lessons": [
      {
        "image": "marine",
        "title": "ALETAS PARA NADAR",
        "text": "EL PLESIOSAURIO ERA UN REPTIL MARINO, NO UN DINOSAURIO.",
        "question": "BUSCA SUS ALETAS. MUEVE TUS BRAZOS COMO SI NADARAS."
      },
      {
        "image": "flying",
        "title": "ALAS PARA VOLAR",
        "text": "EL PTERODÁCTILO ERA UN PTEROSAURIO: UN REPTIL VOLADOR.",
        "question": "SIGUE EL BORDE DE UN ALA. ¿VES PLUMAS O UNA MEMBRANA?"
      },
      {
        "image": "bird",
        "title": "UN DINOSAURIO DE HOY",
        "text": "LAS AVES SON DINOSAURIOS VIVOS. ESTE GORRIÓN TIENE PLUMAS, PICO Y DOS PATAS.",
        "question": "BUSCA UNA PLUMA Y EL PICO EN LA FOTOGRAFÍA."
      }
    ],
    "challenges": [
      {
        "prompt": "EL MOSASAURIO TIENE ALETAS. ¿DÓNDE SE DESPLAZABA?",
        "visual": "mosasaurus",
        "choices": [
          {
            "label": "EN EL MAR",
            "mark": "waves",
            "icon": "🌊"
          },
          {
            "label": "POR EL CIELO",
            "mark": "air",
            "icon": "🪽"
          },
          {
            "label": "POR TIERRA",
            "mark": "ground",
            "icon": "🌱"
          }
        ],
        "answer": 0,
        "hint": "MIRA SUS ALETAS Y SU COLA.",
        "success": "ERA UN REPTIL MARINO."
      },
      {
        "prompt": "EL PTERODÁCTILO TIENE ALAS. ¿CÓMO SE DESPLAZABA?",
        "visual": "pterodactylus",
        "choices": [
          {
            "label": "VOLANDO",
            "mark": "air",
            "icon": "🪽"
          },
          {
            "label": "CAMINANDO BAJO EL AGUA",
            "mark": "waves",
            "icon": "🌊🐾"
          }
        ],
        "answer": 0,
        "hint": "ABRE LOS BRAZOS COMO SUS ALAS.",
        "success": "SUS ALAS LE PERMITÍAN VOLAR."
      }
    ],
    "draw": {
      "mode": "paint",
      "title": "PINTAMOS DOS REPTILES MARINOS",
      "prompt": "PINTA DOS ICTIOSAURIOS. CUÉNTALOS MIENTRAS LOS PINTAS.",
      "animals": [
        "ichthyosaurus",
        "ichthyosaurus-two",
        "trex"
      ],
      "targets": [
        0,
        1
      ],
      "purpose": "Seleccionar y contar dos reptiles marinos entre tres figuras. Se rellena el animal completo; no se dibujan ni se rodean partes."
    },
    "teacher": [
      "Relacionar desplazamiento y partes del cuerpo.",
      "Diferencia reptiles marinos, pterosaurios y dinosaurios. Evita decir que ningún dinosaurio vuela: las aves son dinosaurios.",
      "Relaciona aletas con nadar, alas con volar y reconoce un ave actual."
    ]
  },
  {
    "title": "Detectives del pasado",
    "question": "¿CÓMO INVESTIGAMOS EL PASADO?",
    "word": "FÓSIL",
    "lessons": [
      {
        "image": "trackway",
        "title": "UNA HUELLA EN LA ROCA",
        "text": "UN FÓSIL TAMBIÉN PUEDE SER UNA MARCA DEJADA POR UN SER VIVO.",
        "question": "BUSCA LA MARCA DE LOS DEDOS EN ESTA HUELLA FÓSIL."
      },
      {
        "image": "dig",
        "title": "UN YACIMIENTO",
        "text": "EN ESTE LUGAR HAY HUESOS DE DINOSAURIOS EN LA ROCA. SE ESTUDIAN CON MUCHO CUIDADO.",
        "question": "OBSERVA EL SUELO ROCOSO. ¿POR QUÉ NO DEBEMOS PISAR LOS HALLAZGOS?"
      },
      {
        "image": "excavation",
        "title": "EL MUSEO NOS ENSEÑA",
        "text": "EL ESQUELETO MONTADO NOS AYUDA A IMAGINAR EL CUERPO DE UN T. REX.",
        "question": "BUSCA EL CRÁNEO Y LAS COSTILLAS QUE SE VEN EN LA FOTO."
      }
    ],
    "challenges": [
      {
        "prompt": "PARA QUITAR ARENA JUNTO A UNA PIEZA DELICADA, ¿CÓMO MOVERÍAMOS EL PINCEL?",
        "visual": "brush",
        "choices": [
          {
            "label": "SUAVEMENTE",
            "mark": "",
            "icon": "🖌️"
          },
          {
            "label": "DANDO GOLPES",
            "mark": "",
            "icon": "🔨"
          }
        ],
        "answer": 0,
        "hint": "QUEREMOS CUIDAR EL HALLAZGO.",
        "success": "EN NUESTRA EXCAVACIÓN DE AULA USAMOS MOVIMIENTOS SUAVES."
      },
      {
        "prompt": "ESTE MUSEO EXPONE UN ESQUELETO. ¿QUÉ PARTES ESTAMOS VIENDO?",
        "visual": "gallery",
        "choices": [
          {
            "label": "HUESOS",
            "mark": "",
            "icon": "🦴"
          },
          {
            "label": "PELO",
            "mark": "",
            "icon": "💇"
          },
          {
            "label": "HOJAS",
            "mark": "",
            "icon": "🍂"
          }
        ],
        "answer": 0,
        "hint": "MIRA EL CRÁNEO Y LAS COSTILLAS.",
        "success": "VEMOS HUESOS: EL MUSEO TAMBIÉN PUEDE EXPONER COPIAS."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "DISEÑAMOS UNA HUELLA",
      "prompt": "DIBUJA UNA HUELLA CON TRES DEDOS. PUEDES SEGUIR LA GUÍA.",
      "guide": "footprint",
      "purpose": "Crear un modelo de huella y distinguirlo de un fósil auténtico."
    },
    "teacher": [
      "Entender que investigamos mediante pistas.",
      "Simula una excavación con piezas grandes y brochas suaves. Explica que la impresión de plastilina es un modelo, no un fósil auténtico.",
      "Distingue una huella fósil y un esqueleto, y propone cuidados."
    ]
  },
  {
    "title": "El gran misterio",
    "question": "¿QUÉ PASA SI LLEGA MENOS LUZ?",
    "word": "LUZ",
    "lessons": [
      {
        "image": "impact",
        "title": "UN GRAN IMPACTO",
        "text": "HACE MUCHÍSIMO TIEMPO, UN ASTEROIDE CHOCÓ CON LA TIERRA Y CAMBIÓ EL AMBIENTE.",
        "question": "ESTA IMAGEN IMAGINA EL IMPACTO: NO ES UNA FOTOGRAFÍA."
      },
      {
        "image": "sunlight",
        "title": "LAS PLANTAS NECESITAN LUZ",
        "text": "TRAS EL IMPACTO, EL POLVO REDUJO LA LUZ. MUCHAS PLANTAS TUVIERON DIFICULTADES PARA CRECER.",
        "question": "EN ESTA FOTO ACTUAL, BUSCA LAS HOJAS QUE RECIBEN MÁS LUZ."
      },
      {
        "image": "feather",
        "title": "LAS AVES CONTINUARON",
        "text": "ALGUNAS AVES SOBREVIVIERON. ESTA PLUMA ES DE UN AVE ACTUAL.",
        "question": "MIRA SU EJE CENTRAL Y SUS DOS LADOS. LAS AVES SON DINOSAURIOS VIVOS."
      }
    ],
    "challenges": [
      {
        "prompt": "¿QUÉ PLANTA RECIBE MÁS LUZ EN ESTE MODELO?",
        "visual": "@light",
        "choices": [
          {
            "label": "LA PRIMERA",
            "mark": "1",
            "icon": "①"
          },
          {
            "label": "LA SEGUNDA",
            "mark": "2",
            "icon": "②"
          }
        ],
        "answer": 0,
        "hint": "COMPARA LOS RAYOS QUE LLEGAN A CADA PLANTA.",
        "success": "LA PRIMERA RECIBE MÁS LUZ. EL MODELO NOS AYUDA A PENSAR."
      },
      {
        "prompt": "EN ESTA RECONSTRUCCIÓN DE ARQUEÓPTERIX, ¿QUÉ CUBRE LAS ALAS?",
        "visual": "archaeopteryx",
        "choices": [
          {
            "label": "PLACAS",
            "mark": "",
            "icon": "🔶"
          },
          {
            "label": "PLUMAS",
            "mark": "",
            "icon": "🪶"
          },
          {
            "label": "CONCHAS",
            "mark": "",
            "icon": "🐚"
          }
        ],
        "answer": 1,
        "hint": "OBSERVA EL BORDE DE LAS ALAS Y SU COLA.",
        "success": "VEMOS PLUMAS, COMO EN LAS AVES ACTUALES."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "LUZ PARA MI PLANTA",
      "prompt": "DIBUJA UNA PLANTA, EL SOL Y LOS RAYOS QUE LLEGAN A SUS HOJAS.",
      "guide": "blank",
      "purpose": "Representar visualmente la relación entre luz y plantas."
    },
    "teacher": [
      "Comprender una cadena sencilla de cambios.",
      "Usa luz, sombra y una planta dibujada. Es un modelo: la linterna no demuestra por sí sola la extinción. Evita escenas violentas o alarmantes.",
      "Relaciona la luz con las plantas y reconoce las plumas de las aves."
    ]
  },
  {
    "title": "¡Somos expertos!",
    "question": "¿QUÉ PODEMOS ENSEÑAR EN NUESTRO MUSEO?",
    "word": "MUSEO",
    "lessons": [
      {
        "image": "parasaurolophus",
        "title": "SABEMOS OBSERVAR",
        "text": "PARASAUROLOFO TENÍA UNA CRESTA LARGA EN LA CABEZA. SUS RASGOS NOS AYUDAN A RECONOCERLO.",
        "question": "DESCRIBE SU CRESTA SIN DECIR EL NOMBRE DEL ANIMAL."
      },
      {
        "image": "velociraptor",
        "title": "SABEMOS COMPARAR",
        "text": "ESTA RECONSTRUCCIÓN DE VELOCIRAPTOR MUESTRA PLUMAS Y UNA COLA LARGA.",
        "question": "¿QUÉ PARTE TE RECUERDA A UN AVE? ¿QUÉ PARTE ES DIFERENTE?"
      },
      {
        "image": "pteranodon-scene",
        "title": "SABEMOS EXPLICAR",
        "text": "PTERANODON VOLABA CON ALAS DE MEMBRANA. ERA UN REPTIL VOLADOR.",
        "question": "CUÉNTASELO A UN COMPAÑERO: ¿POR QUÉ NO LO PONEMOS CON LOS REPTILES MARINOS?"
      }
    ],
    "challenges": [
      {
        "prompt": "PREPARAMOS EL MUSEO. ¿QUÉ CARTEL PONEMOS AL PLESIOSAURIO?",
        "visual": "plesiosaurus",
        "choices": [
          {
            "label": "REPTIL MARINO",
            "mark": "",
            "icon": "🌊"
          },
          {
            "label": "REPTIL VOLADOR",
            "mark": "",
            "icon": "🪽"
          },
          {
            "label": "DINOSAURIO TERRESTRE",
            "mark": "",
            "icon": "🦕"
          }
        ],
        "answer": 0,
        "hint": "OBSERVA SUS CUATRO ALETAS.",
        "success": "REPTIL MARINO: NADABA CON ALETAS."
      },
      {
        "prompt": "¿QUÉ DOS PISTAS VES EN ESTE MOSASAURIO PARA SABER QUE NADABA?",
        "visual": "mosasaur-scene",
        "choices": [
          {
            "label": "ALETAS Y COLA",
            "mark": "",
            "icon": "🐟"
          },
          {
            "label": "ALAS Y PLUMAS",
            "mark": "",
            "icon": "🪽🪶"
          },
          {
            "label": "CUERNOS Y PATAS",
            "mark": "",
            "icon": "🦏🐾"
          }
        ],
        "answer": 0,
        "hint": "SEÑALA DOS PARTES DE SU CUERPO.",
        "success": "SUS ALETAS Y SU COLA LE AYUDABAN A MOVERSE EN EL AGUA."
      }
    ],
    "draw": {
      "mode": "draw",
      "title": "MI PIEZA DEL MUSEO",
      "prompt": "DIBUJA TU DINOSAURIO FAVORITO CON UNA PISTA PARA RECONOCERLO.",
      "guide": "museum",
      "purpose": "Seleccionar una característica y explicarla oralmente."
    },
    "teacher": [
      "Comunicar lo aprendido cooperando.",
      "Recupera la pregunta inicial y los trabajos. Cada niño puede hablar, señalar, gesticular o mostrar una pieza.",
      "Usa dos pistas para describir y clasificar una pieza del museo."
    ]
  }
];
  const art={
  "skeleton": [
    "assets/route-notebook-v3/skeleton.jpg",
    "Esqueleto montado de Triceratops",
    "FOTOGRAFÍA"
  ],
  "human-track": [
    "assets/route-notebook-v3/human-track.jpg",
    "Marca de un pie humano en arena",
    "FOTOGRAFÍA"
  ],
  "trackway": [
    "assets/route-notebook-v3/trackway.jpg",
    "Huella fósil conservada en una roca",
    "FOTOGRAFÍA"
  ],
  "nest": [
    "assets/route-notebook-v3/nest.jpg",
    "Nido actual de ave con huevos",
    "FOTOGRAFÍA"
  ],
  "juvenile": [
    "assets/route-notebook-v3/juvenile.jpg",
    "Copia de un esqueleto de Maiasaura joven",
    "FOTOGRAFÍA · COPIA DE MUSEO"
  ],
  "excavation": [
    "assets/route-notebook-v3/excavation.jpg",
    "Esqueleto de T. rex expuesto en un museo",
    "FOTOGRAFÍA"
  ],
  "gallery": [
    "assets/route-notebook-v3/gallery.jpg",
    "Copia de un esqueleto de Allosaurus",
    "FOTOGRAFÍA · COPIA DE MUSEO"
  ],
  "impact": [
    "assets/route-notebook-v3/impact.jpg",
    "Representación del impacto de Chicxulub",
    "ILUSTRACIÓN CIENTÍFICA"
  ],
  "feather": [
    "assets/route-notebook-v3/feather.jpg",
    "Pluma de un ave actual",
    "FOTOGRAFÍA"
  ],
  "sunlight": [
    "assets/route-notebook-v3/sunlight.jpg",
    "Hojas actuales iluminadas por el sol",
    "FOTOGRAFÍA"
  ],
  "brush": [
    "assets/route-notebook-v3/brush.jpg",
    "Pinceles de cerdas",
    "FOTOGRAFÍA"
  ],
  "dig": [
    "assets/route-notebook-v3/dig.jpg",
    "Yacimiento de huesos de dinosaurios en una roca",
    "FOTOGRAFÍA"
  ],
  "skull": [
    "assets/route-notebook-v3/skull.jpg",
    "Cráneo fósil de Triceratops",
    "FOTOGRAFÍA"
  ],
  "eggs": [
    "assets/route-notebook/eggs.jpg",
    "Huevos fosilizados de dinosaurio",
    "FOTOGRAFÍA"
  ],
  "fern": [
    "assets/route-notebook/fern.jpg",
    "Helechos actuales",
    "FOTOGRAFÍA"
  ],
  "tooth": [
    "assets/route-notebook/tooth.jpg",
    "Diente fósil de T. rex",
    "FOTOGRAFÍA"
  ],
  "bird": [
    "assets/route-notebook/bird.jpg",
    "Gorrión actual",
    "FOTOGRAFÍA"
  ],
  "trex": [
    "assets/dino-explorer/real/trex.webp",
    "T. rex",
    "RECONSTRUCCIÓN"
  ],
  "triceratops": [
    "assets/dino-explorer/real/triceratops.webp",
    "Triceratops",
    "RECONSTRUCCIÓN"
  ],
  "spinosaurus": [
    "assets/dino-explorer/real/spinosaurus.webp",
    "Espinosaurio",
    "RECONSTRUCCIÓN"
  ],
  "stegosaurus": [
    "assets/dino-explorer/real/stegosaurus.webp",
    "Estegosaurio",
    "RECONSTRUCCIÓN"
  ],
  "ankylosaurus": [
    "assets/dino-explorer/real/ankylosaurus.webp",
    "Anquilosaurio",
    "RECONSTRUCCIÓN"
  ],
  "diplodocus": [
    "assets/dino-explorer/real/diplodocus.webp",
    "Diplodocus",
    "RECONSTRUCCIÓN"
  ],
  "plateosaurus": [
    "assets/dino-explorer/real/plateosaurus.webp",
    "Plateosaurio",
    "RECONSTRUCCIÓN"
  ],
  "coelophysis": [
    "assets/dino-explorer/real/coelophysis.webp",
    "Coelophysis",
    "RECONSTRUCCIÓN"
  ],
  "brachiosaurus": [
    "assets/dino-explorer/real/brachiosaurus.webp",
    "Braquiosaurio",
    "RECONSTRUCCIÓN"
  ],
  "herrerasaurus": [
    "assets/dino-explorer/real/herrerasaurus.webp",
    "Herrerasaurio",
    "RECONSTRUCCIÓN"
  ],
  "pachycephalosaurus": [
    "assets/dino-explorer/real/pachycephalosaurus.webp",
    "Paquicefalosaurio",
    "RECONSTRUCCIÓN"
  ],
  "ichthyosaurus": [
    "assets/dino-explorer/real/ichthyosaurus.webp",
    "Ictiosaurio",
    "RECONSTRUCCIÓN"
  ],
  "mosasaurus": [
    "assets/dino-explorer/real/mosasaurus.webp",
    "Mosasaurio",
    "RECONSTRUCCIÓN"
  ],
  "pterodactylus": [
    "assets/dino-explorer/real/pterodactylus.webp",
    "Pterodáctilo",
    "RECONSTRUCCIÓN"
  ],
  "plesiosaurus": [
    "assets/dino-explorer/real/plesiosaurus.webp",
    "Plesiosaurio",
    "RECONSTRUCCIÓN"
  ],
  "velociraptor": [
    "assets/dino-explorer/real/velociraptor.webp",
    "Velociraptor",
    "RECONSTRUCCIÓN"
  ],
  "parasaurolophus": [
    "assets/dino-explorer/real/parasaurolophus.webp",
    "Parasaurolofo",
    "RECONSTRUCCIÓN"
  ],
  "triassic": [
    "assets/dino-world/documental/triasico-eoraptor.webp",
    "TRIASICO EORAPTOR",
    "RECONSTRUCCIÓN"
  ],
  "jurassic": [
    "assets/dino-world/documental/jurasico-bosque.webp",
    "JURASICO BOSQUE",
    "RECONSTRUCCIÓN"
  ],
  "cretaceous": [
    "assets/dino-world/documental/cretacico-tierra.webp",
    "CRETACICO TIERRA",
    "RECONSTRUCCIÓN"
  ],
  "little": [
    "assets/dino-world/documental/triasico-coelophysis.webp",
    "TRIASICO COELOPHYSIS",
    "RECONSTRUCCIÓN"
  ],
  "giant": [
    "assets/dino-world/documental/jurasico-braquiosaurio.webp",
    "JURASICO BRAQUIOSAURIO",
    "RECONSTRUCCIÓN"
  ],
  "marine": [
    "assets/dino-world/documental/jurasico-plesiosaurio.webp",
    "JURASICO PLESIOSAURIO",
    "RECONSTRUCCIÓN"
  ],
  "flying": [
    "assets/dino-world/documental/jurasico-pterodactilo.webp",
    "JURASICO PTERODACTILO",
    "RECONSTRUCCIÓN"
  ],
  "plateo-scene": [
    "assets/dino-world/documental/triasico-plateosaurio.webp",
    "TRIASICO PLATEOSAURIO",
    "RECONSTRUCCIÓN"
  ],
  "anky-scene": [
    "assets/dino-world/documental/cretacico-anquilosaurio.webp",
    "CRETACICO ANQUILOSAURIO",
    "RECONSTRUCCIÓN"
  ],
  "pachy-scene": [
    "assets/dino-world/documental/cretacico-paquicefalosaurio.webp",
    "CRETACICO PAQUICEFALOSAURIO",
    "RECONSTRUCCIÓN"
  ],
  "archaeopteryx": [
    "assets/dino-world/documental/jurasico-arqueopterix.webp",
    "JURASICO ARQUEOPTERIX",
    "RECONSTRUCCIÓN"
  ],
  "pteranodon-scene": [
    "assets/dino-world/documental/cretacico-pteranodon.webp",
    "CRETACICO PTERANODON",
    "RECONSTRUCCIÓN"
  ],
  "mosasaur-scene": [
    "assets/dino-world/documental/cretacico-mosasaurio.webp",
    "CRETACICO MOSASAURIO",
    "RECONSTRUCCIÓN"
  ],
  "track": [
    "assets/dino-footprints/trex.webp",
    "Modelo de huella con tres dedos",
    "MODELO DE HUELLA"
  ],
  "trail": [
    "assets/dino-footprints/brachiosaurus.webp",
    "Marca de una pata en un rastro de tres marcas",
    "MODELO PARA CONTAR"
  ],
  "leaves": [
    "assets/autumn-vocab/hojas-caidas.webp",
    "Hojas caídas de plantas actuales",
    "IMAGEN REALISTA · HOJAS"
  ],
  "trex-two": [
    "assets/route-notebook-v3/trex-dos.webp",
    "Otro T. rex, con una postura diferente",
    "RECONSTRUCCIÓN"
  ]
};
  const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const upper=t=>t.toLocaleUpperCase('es-ES');
  const image=(key,caption=false)=>{const a=art[key];return '<figure class="nb-photo"><img draggable="false" src="'+a[0]+'" alt="'+a[1]+'">'+(caption?'<figcaption>'+a[2]+'</figcaption>':'')+'</figure>';};
  const btn=(text,action,value='',extra='')=>'<button type="button" data-action="dino-route-'+action+'" data-value="'+value+'" '+extra+'>'+text+'</button>';
  const colors=['#b54570','#356ea4','#3b8657','#d78a28','#564b70'];
  const colorNames=['Rosa','Azul','Verde','Naranja','Violeta'];
  const sections=[['PORTADA',0],['DESCUBRO',1],['INVESTIGO',4],['DIBUJO',6],['VOCABULARIO',7],['REPASO',8],['RESUMEN',9],['SEÑO',11]];
  const vocabulary=[[["HUELLA", "🐾", "LA MARCA QUE DEJA UNA PATA."], ["RASTRO", "🐾🐾", "VARIAS HUELLAS NOS MUESTRAN UN CAMINO."]], [["TIERRA", "🌍", "NUESTRO PLANETA HA CAMBIADO MUCHO."], ["PASADO", "⌛", "LO QUE OCURRIÓ ANTES DE HOY."]], [["LARGO", "🦕", "SE EXTIENDE MUCHO DE UN EXTREMO AL OTRO."], ["CORTO", "📏", "SE EXTIENDE POCO: LO COMPARAMOS."]], [["PLANTA", "🌿", "UN SER VIVO QUE NECESITA LUZ Y AGUA."], ["HERBÍVORO", "🌿🦕", "UN ANIMAL QUE COME PLANTAS."]], [["CUERNO", "🦏", "UNA PUNTA DURA EN LA CABEZA."], ["PLACA", "🔶", "UNA PIEZA DURA: ALGUNOS TENÍAN PLACAS EN EL LOMO."]], [["HUEVO", "🥚", "DENTRO PUEDE CRECER UNA CRÍA."], ["CRÍA", "🐣", "UN ANIMAL QUE ACABA DE NACER."]], [["ALAS", "🪽", "AYUDAN A VOLAR A MUCHOS ANIMALES."], ["ALETAS", "🐟", "AYUDAN A MOVERSE POR EL AGUA."]], [["FÓSIL", "🦴", "UN RESTO O UNA HUELLA DE VIDA MUY ANTIGUA."], ["PALEONTÓLOGO", "🧑‍🔬", "INVESTIGA LA VIDA DEL PASADO CON FÓSILES."]], [["LUZ", "☀️", "LAS PLANTAS NECESITAN LUZ PARA CRECER."], ["ASTEROIDE", "☄️", "UN CUERPO ROCOSO QUE VIAJA POR EL ESPACIO."]], [["MUSEO", "🏛️", "UN LUGAR PARA CONSERVAR Y COMPARTIR DESCUBRIMIENTOS."], ["EXPERTO", "🧑‍🏫", "ALGUIEN QUE HA APRENDIDO MUCHO SOBRE UN TEMA."]]];
  const sessions=new Map();let dispose=()=>{};
  function session(p){if(!sessions.has(p.round))sessions.set(p.round,{page:0,answers:{},strokes:[],color:colors[0],index:false,sheet:false,painted:{},paintHistory:[],paintFeedback:''});p.routeSession=sessions.get(p.round);return p.routeSession;}
  function hub(){return '<section class="nb-hub"><header><small>PROYECTO DINOSAURIOS · 4 AÑOS</small><h2>Diez cuadernos para descubrir</h2><p>Diez aventuras con su resumen visual de dos páginas.</p></header><div class="nb-volumes">'+weeks.map((w,i)=>btn('<span>SEMANA '+(i+1)+'</span><img src="assets/route-notebook-v5/portada-'+(i+1)+'.webp" alt="'+escape(w.title)+'"><strong>'+upper(w.title)+'</strong><small>ABRIR CUADERNO →</small>','open',i,'class="nb-volume" style="--tab:'+['#e9a9b2','#a8c9de','#b6c991','#e9c386'][i%4]+'"')).join('')+'</div></section>';}
  function title(w,page){return page===0?w.title:page<=3?w.lessons[page-1].title:page<=5?'Investigo con pistas':page===6?w.draw.title:page===7?'Descubrimos palabras nuevas':page===8?'Repasamos '+w.word:page===9?'Resumen · página 1 de 2':page===10?'Resumen · página 2 de 2':'Guía de la seño';}
  function svg(label,body){return '<svg class="nb-model" role="img" aria-label="'+label+'" viewBox="0 0 720 370">'+body+'</svg>';}
  function diagram(key){
    if(key==='@trail')return '<div class="nb-trail-model" aria-label="Tres marcas y un espacio para una más">'+image('trail')+image('trail')+image('trail')+'<b>+ 1</b></div>';
    if(key==='@timeline')return svg('Tres capítulos consecutivos: Triásico, Jurásico y el siguiente',[[20,'1','TRIÁSICO'],[260,'2','JURÁSICO'],[500,'3','¿QUÉ SIGUE?']].map(([x,n,t])=>'<rect x="'+x+'" y="80" width="200" height="210" rx="22" fill="'+(n==='3'?'#f1d8ae':'#cce1d6')+'"/><text x="'+(x+100)+'" y="170" text-anchor="middle" font-size="64">'+n+'</text><text x="'+(x+100)+'" y="235" text-anchor="middle" font-size="24">'+t+'</text>').join('')+'<path d="M225 185h28m-10-10 10 10-10 10M465 185h28m-10-10 10 10-10 10" fill="none" stroke="#466254" stroke-width="5"/>');
    if(key==='@ropes')return svg('Tres cuerdas desde la misma línea: azul corta, verde larga, rosa mediana','<path d="M90 30v300" stroke="#7a7e76" stroke-dasharray="8 8" stroke-width="3"/>'+[[95,350,'#356ea4'],[185,640,'#3b8657'],[275,480,'#b54570']].map(([y,x,c])=>'<path d="M100 '+y+'H'+x+'" stroke="'+c+'" stroke-width="22" stroke-linecap="round"/>').join(''));
    if(key==='@nests')return svg('Tres nidos con un huevo en cada nido',[120,360,600].map((x,i)=>'<path d="M'+(x-95)+' 190Q'+x+' 330 '+(x+95)+' 190Q'+x+' 250 '+(x-95)+' 190Z" fill="#c69b64" stroke="#7a5938" stroke-width="5"/><ellipse cx="'+x+'" cy="160" rx="42" ry="60" fill="#fff1d0" stroke="#9f825e" stroke-width="4"/><text x="'+x+'" y="320" text-anchor="middle" font-size="28">NIDO '+(i+1)+'</text>').join(''));
    if(key==='@shells')return svg('Tres huevos: el segundo tiene las dos mitades del cascarón separadas','<ellipse cx="120" cy="175" rx="65" ry="90" fill="#f8e5bf" stroke="#947b55" stroke-width="5"/><path d="M300 130Q360-20 420 130l-20-14-20 14-20-14-20 14-20-14Z M300 205l20 14 20-14 20 14 20-14 20 14 20-14Q360 365 300 205Z" fill="#f8e5bf" stroke="#947b55" stroke-width="5"/><ellipse cx="600" cy="175" rx="65" ry="90" fill="#f8e5bf" stroke="#947b55" stroke-width="5"/><path d="M590 90l15 45-20 30 20 25" fill="none" stroke="#947b55" stroke-width="4"/>'+[120,360,600].map((x,i)=>'<text x="'+x+'" y="345" text-anchor="middle" font-size="32">'+(i+1)+'</text>').join(''));
    if(key==='@light')return svg('Dos plantas: la primera recibe rayos de luz; una pantalla bloquea la luz sobre la segunda',[170,550].map((x,i)=>'<rect x="'+(x-145)+'" y="15" width="290" height="340" rx="20" fill="#edf1e4"/><circle cx="'+x+'" cy="65" r="30" fill="#edbf54"/><path d="M'+(x-35)+' 105v'+(i?35:120)+'m35-'+(i?35:120)+'v'+(i?35:120)+'m35-'+(i?35:120)+'v'+(i?35:120)+'" stroke="#edbf54" stroke-width="8"/>'+(i?'<rect x="'+(x-90)+'" y="150" width="180" height="24" fill="#7f8890"/>':'')+'<path d="M'+x+' 310v-80m0 40q-65 0-55-45 55-5 55 45m0 15q65 0 55-45-55-5-55 45" fill="#78a36b" stroke="#4a7951" stroke-width="5"/><text x="'+(x-115)+'" y="65" font-size="30">'+(i+1)+'</text>').join(''));
    return image(key,true);
  }
  function outlineDino(key,color){
    const src=key==='trex-distractor'?'assets/dinos-pdi/trex-outline.webp':'assets/route-notebook-v6/'+key+'.png';
    return '<span class="nb-coloring-figure" style="--shape:url(\''+src+'\');--paint:'+color+'"><img src="'+src+'" alt="" draggable="false"></span>';
  }
  function palette(s,paint=false){return '<div class="nb-pens" aria-label="Herramientas de dibujo">'+colors.map((c,i)=>paint?btn('','paint-color',i,'class="nb-color" style="--ink:'+c+'" aria-label="'+colorNames[i]+'" aria-pressed="'+(s.color===c)+'"'):'<button type="button" data-nb-color="'+c+'" style="--ink:'+c+'" aria-label="'+colorNames[i]+'" aria-pressed="'+(s.color===c)+'"></button>').join('')+(paint?btn('DESHACER','paint-undo')+btn('BORRAR','paint-reset'):'<button type="button" data-nb-undo>DESHACER</button><button type="button" data-nb-clear>BORRAR</button>')+'</div>';}
  function guide(kind){
    const paths={lengths:'<path d="M210 310h60m180 0h60"/>',landscape:'<path d="M0 280Q160 250 300 280T720 270"/>',garden:'<path d="M0 315H720"/>',footprint:'<path d="M260 300Q210 255 230 200L175 110Q160 70 185 80L265 160 280 50Q290 10 305 50L320 160 395 80Q430 55 415 105L360 205Q385 285 325 310Z"/>',museum:'<rect x="30" y="20" width="660" height="320" rx="20"/>'};
    return paths[kind]?'<svg class="nb-draw-guide" viewBox="0 0 720 370" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#c8d1bd" stroke-width="3" stroke-dasharray="8 8">'+paths[kind]+'</g></svg>':'';
  }
  function project(p){
    const w=weeks[p.round],s=session(p),page=s.page;let body='';
    if(page===0){body='<div class="nb-cover nb-cover-typographic"><img class="nb-cover-art" src="assets/route-notebook-v5/portada-'+(p.round+1)+'.webp" alt="'+escape(w.title)+'"><div><span class="nb-sticker">INVESTIGAMOS JUNTOS</span><h3>'+w.question+'</h3><p>OBSERVAMOS · PENSAMOS · CREAMOS</p><p class="nb-prompt">¿QUÉ CREES QUE VAMOS A DESCUBRIR?</p><small>EL RESUMEN TIENE DOS PÁGINAS PARA RECORDAR LO APRENDIDO.</small></div></div>';}
    else if(page<=3){const l=w.lessons[page-1];body='<div class="nb-spread">'+image(l.image,true)+'<article><span class="nb-sticker">DESCUBRIMIENTO '+page+'</span><h3>'+l.title+'</h3><p>'+l.text+'</p><p class="nb-prompt">'+l.question+'</p>'+(p.round===1?'<button type="button" class="nb-era" data-action="dino-route-era" data-value="'+['triassic','jurassic','cretaceous'][page-1]+'">EXPLORAR '+['TRIÁSICO','JURÁSICO','CRETÁCICO'][page-1]+' →</button><small>AL VOLVER SEGUIREMOS EN ESTA PÁGINA.</small>':'')+'</article></div>';}
    else if(page<=5){const q=w.challenges[page-4],choice=s.answers[page],correct=choice===q.answer;body='<div class="nb-challenge nb-observe"><h3>'+q.prompt+'</h3><div class="nb-evidence">'+diagram(q.visual)+'</div><div class="nb-responses">'+q.choices.map((o,i)=>btn(''+'<span>'+o.label+'</span>'+(choice===i?'<b>'+(correct?'✓':'↻')+'</b>':''),'answer',i,'class="'+(choice===i?(correct?'is-correct':'is-retry'):'')+'" aria-pressed="'+(choice===i)+'"')).join('')+'</div><p class="nb-feedback" role="status">'+(choice===undefined?'LA SEÑO LEE LAS OPCIONES. OBSERVA Y EXPLICA TU ELECCIÓN.':correct?q.success:q.hint)+'</p></div>';}
    else if(page===6){const d=w.draw;if(d.mode==='paint'){body='<div class="nb-paint"><h3>'+d.prompt+'</h3>'+palette(s,true)+'<div class="nb-paint-grid '+(d.animals.length===1?'nb-paint-single':'')+'">'+d.animals.map((key,i)=>{const a=art[key]||art.ichthyosaurus;return btn(outlineDino(p.round===6&&key==='trex'?'trex-distractor':key,s.painted[i]||'#ffffff'),'paint-target',i,'aria-label="Pintar '+a[1]+'" aria-pressed="'+Boolean(s.painted[i])+'"');}).join('')+'</div><p class="nb-feedback" role="status">'+(s.paintFeedback||'TOCA UN ANIMAL PARA PINTARLO ENTERO. LOS COLORES SON ARTÍSTICOS.')+'</p></div>';}
      else body='<div class="nb-drawing"><h3>'+d.prompt+'</h3>'+palette(s)+'<div class="nb-canvas-wrap">'+guide(d.guide)+'<canvas data-nb-draw aria-label="Dibuja con el dedo o el lápiz sobre la página"></canvas></div></div>';}
    else if(page===7){body='<div class="nb-vocabulary">'+vocabulary[p.round].map(([word,icon,meaning])=>'<article><h3>'+word+'</h3><p>'+meaning+'</p></article>').join('')+'<p class="nb-prompt">LA SEÑO EXPLICA CADA PALABRA. ¿DÓNDE LA HEMOS VISTO EN EL PROYECTO?</p></div>';}
    else if(page===8){body='<div class="nb-word"><p>DECIMOS <b>'+w.word+'</b> · REPASAMOS CON EL DEDO O EL LÁPIZ</p><div class="nb-guided-host" data-word="'+w.word+'"></div><small>PUEDES REPASAR UNA LETRA O TODA LA PALABRA CON AYUDA.</small></div>';}
    else if(page===9||page===10){body='<div class="nb-summary nb-summary-large"><img src="assets/route-notebook-v5/resumen-'+(p.round+1)+'-'+(page-8)+'.webp" alt="Resumen de la semana '+(p.round+1)+', página '+(page-8)+' de 2: '+escape(w.title)+'"><div class="nb-summary-actions">'+btn('← CUADERNO','page',8)+'<strong>SEMANA '+(p.round+1)+' · RESUMEN '+(page-8)+' / 2</strong><a class="nb-pdf-link" href="assets/route-notebook-v5/semana-'+(p.round+1)+'.pdf" download="dinosaurios-semana-'+(p.round+1)+'.pdf">DESCARGAR PDF</a></div></div>';}
    else {body='<div class="nb-teacher"><article><h3>PROPÓSITO Y ACOMPAÑAMIENTO</h3><p>'+escape(w.teacher[0])+'</p><p>'+escape(w.teacher[1])+'</p><h3>OBSERVA EL APRENDIZAJE</h3><p>'+escape(w.teacher[2])+'</p></article><article><h3>DEL CUADERNO AL AULA</h3><p>'+escape(w.draw.purpose)+'</p><p>Lee cada consigna y sus opciones. Primero observamos la imagen; después respondemos. Reparte las páginas durante la semana y acepta señalar, gesticular o explicar oralmente.</p><p>El resumen visual de dos páginas está en RESUMEN. Las fotografías, reconstrucciones y modelos están diferenciados. No se exige leer ni escribir de forma autónoma.</p><a href="assets/route-notebook-v3/CREDITOS.html" target="_blank" rel="noopener">Imágenes y fuentes ↗</a></article></div>';}
    const section=sections.reduce((a,x,i)=>page>=x[1]?i:a,0);
    return '<section class="route-pdi nb-reader '+(page===9||page===10?'nb-summary-reader':'')+'" data-week="'+p.round+'"><header class="nb-toolbar"><button type="button" data-action="close-projection">← SEMANAS</button><strong>SEMANA '+(p.round+1)+'</strong>'+btn('ÍNDICE','index',0,'aria-expanded="'+s.index+'"')+'</header><nav class="nb-tabs" aria-label="Secciones del cuaderno">'+sections.map(([label,start],i)=>btn(label,'page',start,'aria-current="'+(i===section?'step':'false')+'"')).join('')+'</nav><div class="nb-binder"><div class="nb-rings" aria-hidden="true">'+Array.from({length:6},()=>'<i></i>').join('')+'</div><main class="nb-paper"><div class="nb-page-heading"><h2 tabindex="-1">'+upper(title(w,page))+'</h2><span>'+String(page+1).padStart(2,'0')+'</span></div><div class="nb-page-content">'+body+'</div></main></div><footer class="nb-footer">'+btn('← ANTERIOR','page',page-1,page===0?'disabled':'')+'<span aria-live="polite">PÁGINA '+(page+1)+' DE 12</span>'+btn(page===11?'FIN DEL CUADERNO':page===9?'SIGUIENTE · RESUMEN 2 →':'SIGUIENTE →','page',page+1,page===11?'disabled':'')+'</footer>'+(s.index?'<div class="nb-index"><div><h3>ELIGE UNA PÁGINA</h3>'+btn('CERRAR ÍNDICE','index')+'</div><nav>'+Array.from({length:12},(_,i)=>btn('<b>'+String(i+1).padStart(2,'0')+'</b><span>'+upper(title(w,i))+'</span>','page',i,'aria-current="'+(i===page?'page':'false')+'"')).join('')+'</nav></div>':'')+(s.sheet?'<div class="nb-sheet-viewer" role="dialog" aria-modal="true" aria-label="Resumen ampliado"><header><strong>RESUMEN · SEMANA '+(p.round+1)+'</strong>'+btn('VOLVER AL RESUMEN','sheet')+'</header><img src="assets/route-notebook-v5/resumen-'+(p.round+1)+'-'+((s.summaryPage||0)+1)+'.webp" alt="Resumen de la semana '+(p.round+1)+'"></div>':'')+'</section>';
  }
  function update(p,action,value){const s=session(p),d=weeks[p.round].draw;
    if(action==='index'){s.index=!s.index;s.sheet=false;return true;}

    if(action==='page'){if(!Number.isInteger(value)||value<0||value>11)return false;s.page=value;s.index=false;s.sheet=false;return true;}
    if(action==='answer'&&s.page>=4&&s.page<=5){const q=weeks[p.round].challenges[s.page-4];if(!Number.isInteger(value)||value<0||value>=q.choices.length)return false;s.answers[s.page]=value;return true;}
    if(s.page===6&&d.mode==='paint'){
      if(action==='paint-color'&&Number.isInteger(value)&&colors[value]){s.color=colors[value];return true;}
      if(action==='paint-reset'){s.paintHistory.push({...s.painted});s.painted={};s.paintFeedback='EMPEZAMOS DE NUEVO.';return true;}
      if(action==='paint-undo'){if(s.paintHistory.length)s.painted=s.paintHistory.pop();s.paintFeedback='PUEDES CONTINUAR PINTANDO.';return true;}
      if(action==='paint-target'&&Number.isInteger(value)&&value>=0&&value<d.animals.length){if(!d.targets.includes(value)){s.paintFeedback=(p.round===6?'ESTE NO ES UN REPTIL MARINO. BUSCA LOS DOS ICTIOSAURIOS.':'ESTE NO ES UN T. REX. BUSCA SU CABEZA GRANDE Y SUS BRAZOS CORTOS.');return true;}s.paintHistory.push({...s.painted});s.painted[value]=s.color;const count=Object.keys(s.painted).length;s.paintFeedback=count===d.targets.length?(count===2?(p.round===6?'¡HAS PINTADO DOS ICTIOSAURIOS!':'¡LOS DOS T. REX ESTÁN PINTADOS!'):'¡HAS PINTADO UN DINOSAURIO!' ):count+' DE '+d.targets.length+' PINTADOS. BUSCA EL OTRO.';return true;}
    }return false;
  }
  function unmount(){dispose();dispose=()=>{};}
  function mount(root){
    unmount();const reader=root.querySelector('.nb-reader');if(!reader)return;const s=sessions.get(Number(reader.dataset.week));
    root.scrollTop=0;reader.scrollTop=0;
    if(s.sheet||s.index){reader.querySelectorAll('.nb-toolbar,.nb-tabs,.nb-binder,.nb-footer').forEach(el=>el.inert=true);reader.querySelector(s.sheet?'.nb-sheet-viewer button':'.nb-index button')?.focus();}
    const host=reader.querySelector('.nb-guided-host');if(host){if(window.ROSA_GUIDED?.mountWord){window.ROSA_GUIDED.mountWord(host,host.dataset.word);dispose=()=>window.ROSA_GUIDED.unmountWord();}else host.innerHTML='<p>LA PIZARRA GUIADA NO SE HA CARGADO. RECARGA LA PÁGINA.</p>';}
    const canvas=reader.querySelector('[data-nb-draw]');
    if(canvas){
      const ctx=canvas.getContext('2d');let active=null,line=null;const wrap=canvas.parentElement;
      function render(){const rect=wrap.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));ctx.lineCap='round';ctx.lineJoin='round';for(const stroke of s.strokes){ctx.strokeStyle=stroke.color;ctx.lineWidth=7*dpr;ctx.beginPath();stroke.points.forEach(([x,y],i)=>{if(i===0)ctx.moveTo(x*canvas.width,y*canvas.height);else ctx.lineTo(x*canvas.width,y*canvas.height);});ctx.stroke();}}
      function point(e){const r=canvas.getBoundingClientRect();return [Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))];}
      canvas.addEventListener('pointerdown',e=>{if(active!==null||e.button!==0)return;e.preventDefault();active=e.pointerId;canvas.setPointerCapture(active);line={color:s.color,points:[point(e)]};line.points.push([line.points[0][0]+.0001,line.points[0][1]]);s.strokes.push(line);render();});
      canvas.addEventListener('pointermove',e=>{if(e.pointerId!==active||!line)return;e.preventDefault();line.points.push(point(e));render();});
      for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(e.pointerId===active){active=null;line=null;}});
      reader.addEventListener('click',e=>{const color=e.target.closest('[data-nb-color]');if(color){s.color=color.dataset.nbColor;reader.querySelectorAll('[data-nb-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===color)));}if(e.target.closest('[data-nb-undo]')){s.strokes.pop();render();}if(e.target.closest('[data-nb-clear]')){s.strokes=[];render();}});
      const observer=new ResizeObserver(render);observer.observe(wrap);render();dispose=()=>observer.disconnect();
    }
    const key=e=>{if(s.index||s.sheet){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();reader.querySelector(s.sheet?'.nb-sheet-viewer button':'.nb-index button')?.click();}return;}if(e.target.closest('input,textarea,canvas,select'))return;let page=s.page;if(e.key==='ArrowRight')page++;else if(e.key==='ArrowLeft')page--;else return;const b=reader.querySelector('[data-action="dino-route-page"][data-value="'+page+'"]');if(b&&!b.disabled){e.preventDefault();b.click();}};
    reader.addEventListener('keydown',key);
    reader.querySelector('h3')?.setAttribute('tabindex','-1');
  }
  window.ROSA_DINO_ROUTE={hub,project,update,mount,unmount,count:weeks.length};
})();
