// 👉👉 INICIO BLOQUE 1: CONFIGURACIÓN Y DATOS MAESTROS 👈👈

export const allCharacters_data = [
    { name: "La Viuda", gender: "F", interpretationLevel: "Extrovertido", isBirthdayFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/the-widow/", description: "Elegante pero dramática, figura central tras la tragedia.", imageUrl: "Fotos_Personajes/VIUDA_WIDOW.webp" },
    { name: "La Sobrina", gender: "F", interpretationLevel: "Neutro", fichaLink: "https://123actionbarcelona.com/englishyes/SOBRINA/", description: "Joven aparentemente dulce y encantadora.", imageUrl: "Fotos_Personajes/LILLY_ROSE.webp" },
    { name: "La Cocinera", gender: "F", interpretationLevel: "Neutro", fichaLink: "https://123actionbarcelona.com/englishyes/coninera/", description: "De carácter fuerte, intenso y alegre", imageUrl: "Fotos_Personajes/COCINERA_COOK.webp" },
    { name: "El Ama de Llaves", gender: "F", interpretationLevel: "Neutro", isBirthdayFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/amadellaves/", description: "Recta y eficiente, jefa del servicio", imageUrl: "Fotos_Personajes/AMA_DE_LLAVES.webp" },
    { name: "La Doncella", gender: "F", interpretationLevel: "Introvertido", isKidFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/ladoncella/", description: "Discreta y atenta, a menudo invisible pero siempre presente.", imageUrl: "Fotos_Personajes/DONCELLA_THE_MAID.webp" },
    { name: "La Hermana", gender: "F", interpretationLevel: "Extrovertido", preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/hermana/", description: "Explosiva, con fuertes opiniones y actitud altiva.", imageUrl: "Fotos_Personajes/LA_HERMANA_THE_SISTER.webp" },
    { name: "La Secretaria", gender: "F", interpretationLevel: "Neutro", fichaLink: "https://123actionbarcelona.com/englishyes/secretaria/", description: "Organizada y comprometida con el sufragio femenino", imageUrl: "Fotos_Personajes/LA_SECRETARIA.webp" },
    { name: "La Vecina 1", gender: "F", interpretationLevel: "Introvertido", isSeniorFriendly: true, preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/vecinas/", description: "Siempre al tanto de los chismes del vecindario.", imageUrl: "Fotos_Personajes/VECINAS.webp" },
    { name: "La Vecina 2", gender: "F", interpretationLevel: "Introvertido", isSeniorFriendly: true, preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/vecinas/", description: "Siempre al tanto de los chismes del vecindario.", imageUrl: "Fotos_Personajes/VECINAS.webp" },
    { name: "La Vecina 3", gender: "F", interpretationLevel: "Introvertido", isSeniorFriendly: true, preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/vecinas/", description: "Siempre al tanto de los chismes del vecindario.", imageUrl: "Fotos_Personajes/VECINAS.webp" },
    { name: "La Vecina 4", gender: "F", interpretationLevel: "Introvertido", isSeniorFriendly: true, preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/vecinas/", description: "Siempre al tanto de los chismes del vecindario.", imageUrl: "Fotos_Personajes/VECINAS.webp" },
    { name: "La Vecina 5", gender: "F", interpretationLevel: "Introvertido", isSeniorFriendly: true, preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/vecinas/", description: "Siempre al tanto de los chismes del vecindario.", imageUrl: "Fotos_Personajes/VECINAS.webp" },
    { name: "El Gestor", gender: "M", interpretationLevel: "Extrovertido", isBirthdayFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/gestoresp/", description: "Maneja la fortuna familiar y conoce sus entresijos.", imageUrl: "Fotos_Personajes/GESTOR_ACCOUNTANT.webp" },
    { name: "El Hijastro", gender: "M", interpretationLevel: "Extrovertido", fichaLink: "https://123actionbarcelona.com/englishyes/jeremy/", description: "Un joven militar de honor muy masculino.", imageUrl: "Fotos_Personajes/HIJASTRO_STEPSON.webp" },
    { name: "El Hermano", gender: "M", interpretationLevel: "Extrovertido", preferCenterImage: true, fichaLink: "https://123actionbarcelona.com/englishyes/henry/", description: "Carismático director de cine que solo piensa en el arte", imageUrl: "Fotos_Personajes/HERMANO_BROTHER.webp" },
    { name: "El Doctor", gender: "M", interpretationLevel: "Neutro", isBirthdayFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/doctoresp/", description: "Muy profesional aunque va de enterado", imageUrl: "Fotos_Personajes/DOCTOR.webp" },
    { name: "El Socio", gender: "M", interpretationLevel: "Introvertido", isKidFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/petersocio/", description: "Hombre de negocios con alta autoestima", imageUrl: "Fotos_Personajes/SOCIO.webp" },
    { name: "El Cuñado", gender: "M", interpretationLevel: "Neutro", fichaLink: "https://123actionbarcelona.com/englishyes/cunadoroy/", description: "Excéntrico, divertido y derrochador", imageUrl: "Fotos_Personajes/BROTHER_IN_LAW.webp" },
    { name: "El Gemelo 1", gender: "M", interpretationLevel: "Introvertido", isKidFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/losgemelos/", description: "Pequeño genio de carácter algo particular", imageUrl: "Fotos_Personajes/GEMELOS_TWINS.webp" },
    { name: "El Gemelo 2", gender: "M", interpretationLevel: "Introvertido", isKidFriendly: true, isSeniorFriendly: true, fichaLink: "https://123actionbarcelona.com/englishyes/losgemelos/", description: "Pequeño genio de carácter algo particular", imageUrl: "Fotos_Personajes/GEMELOS_TWINS.webp" }
];

export const packs_data = {
    8:  ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor"],
    9:  ["La Viuda", "El Gestor", "La Sobrina", "El Hermano", "La Cocinera", "El Hijastro", "El Ama de Llaves", "El Doctor", "La Doncella"],
    10: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio"],
    11: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana"],
    12: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado"],
    13: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1"],
    14: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2"],
    15: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Secretaria"],
    16: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Vecina 1", "La Vecina 2"],
    17: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Secretaria", "La Vecina 1", "La Vecina 2"],
    18: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Secretaria", "La Vecina 1", "La Vecina 2", "La Vecina 3"],
    19: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Secretaria", "La Vecina 1", "La Vecina 2", "La Vecina 3", "La Vecina 4"],
    20: ["La Viuda", "El Gestor", "La Sobrina", "El Hijastro", "La Cocinera", "El Hermano", "El Ama de Llaves", "El Doctor", "La Doncella", "El Socio", "La Hermana", "El Cuñado", "El Gemelo 1", "El Gemelo 2", "La Secretaria", "La Vecina 1", "La Vecina 2", "La Vecina 3", "La Vecina 4", "La Vecina 5"]
};

export const specialIconDetails = {
    isBirthdayFriendly: {
        title: '🌟 <strong>Rol principal</strong>',
        text: 'Permite que el homenajeado se luzca.'
    },
    isKidFriendly: {
        title: '🧸 <strong>Apto para menores</strong>',
        text: 'Fácil de entender y sin contenido +18.'
    },
    isSeniorFriendly: {
        title: '👵🏻 <strong>Personaje versátil</strong>',
        text: 'Compatible con personas mayores: trama clara y fácil de interpretar.'
    }
};

export const comboIconDetails = {
    birthday_senior: {
        title: '🌟👵🏻 <strong>Personaje versátil</strong>',
        text: '<strong>Compatible con personas mayores:</strong> trama clara y fácil de interpretar, ideal para un papel destacado sin complicaciones.'
    },
    kid_senior: {
        title: '🧸👵🏻 <strong>Personaje versátil</strong>',
        text: 'Compatible tanto con <strong>jugadores jóvenes</strong> como con <strong>personas mayores</strong>.<br><br>Trama accesible, sin contenido +18 y fácil de interpretar para cualquier tipo de jugador.'
    }
};

// 👉👉 FIN BLOQUE 1: CONFIGURACIÓN Y DATOS MAESTROS 👈👈
