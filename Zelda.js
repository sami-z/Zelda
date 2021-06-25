kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0,0,0,1]
})

loadSprite("Link", "Sprites/Link1.png", {
    // sliceX: -15,
    // sliceY: 15,
});

scene('game', (
// {level, score}

) => {

    const map = [
       'cxxxx', 
       'xxxxx', 
       'xxxxx',
       'xxxxx', 
       'xxxxx', 
       'xxxxx',
    ]

    const levelCfg = {
        width: 100,
        height: 100,
        'c' : [sprite('Link')]

    }

    addLevel(map, levelCfg)


})



start('game', { level: 0, score: 0})


