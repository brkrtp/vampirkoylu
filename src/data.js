export const rip = require('./img/rip.png');
export const roles = [
    {
        image:require('./img/dracula.png'),
        title:"Vampir",
        description:"Köylüleri kandırır, her gece köylülerden birini aralarında oylama yaparak oyundan çıkarırlar.",
        required:true
    },
    {
        image:require('./img/farmer.png'),
        title:"Köylü",
        description:"Vampirleri oylama ile oyundan çıkartarak oyunu kazanmaya çalışırlar.",
        required:true
    },
    {
        image:require('./img/hunter.png'),
        title:"Avcı",
        description:"Her el oyunda seçtiği birinin vampir olup olmadığını öğrenir."
    },
    
    
    {
        image:require('./img/skull.png'),
        title:"Mezarcı",
        description:"Her el oyunda ölenler arasından seçtiği birini hayata döndürür."
    },
    {
        image:require('./img/doctor.png'),
        title:"Doktor",
        description:"Her el birini korur, eğer vampirlerle doktor aynı kişiye karar vermişlerse o kişi ölmez."
    },
    // {
    //     image:"https://previews.123rf.com/images/gmast3r/gmast3r1806/gmast3r180600239/102434451-boy-head-emoji-with-facial-emotions-avatar-character-man-shut-up-face-with-different-male-emotions-c.jpg",
    //     title:"Susturucu",
    //     description:"Her el oyunda seçtiği birinin konuşmasını yasaklar."
    // },
    
    
]