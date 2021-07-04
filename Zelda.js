kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0,0,0,1]
})


const playerSpeed = 100
const bossSpeed = 120

let numLives = 3
//let livesLost = false

//Load sprite assets 35x48
loadSprite("LinkGoingRight", "Sprites/LinkGoingRight.png")
loadSprite("LinkGoingLeft", "Sprites/LinkGoingLeft.png")
loadSprite("LinkGoingUp", "Sprites/LinkGoingUp.png")
loadSprite("LinkGoingDown", "Sprites/LinkGoingDown.png")


loadSprite("LinkRunLeft", "Sprites/LinkRunLeft.png", {
    sliceX: 8,
    anims: {
        runLeft: {from: 0, to: 7},
        idleLeft: {from: 6, to: 6}
    }
})

loadSprite("LinkRunRight", "Sprites/LinkRunRight.png", {
    sliceX: 8,
    anims: {
        runRight: {from: 0, to: 7},
        idleRight: {from: 1, to: 1}
    }
})


loadSprite("boss1", "Sprites/Lvl1Boss1.png")
loadSprite("Lvl1Wall", "Sprites/Wall.png")
loadSprite("bg", "Sprites/LVL1BG.png")
loadSprite("door", "Sprites/Door.png")
loadSprite("lives", "Sprites/Lives.png")
loadSprite("hole", "Sprites/Hole.png")
loadSprite("hole2", "Sprites/Hole2.png")

//Load audio assets
loadSound("cave", "Sounds/Cave.mp3")
loadSound("intro", "Sounds/Intro.mp3")

//Load start screen
loadSprite("startScreen", "HomeScreen.png")


scene('game', (
{level, score}

) => {

    layers(['bg', 'game', 'ui'], 'game')

    //WIDTH = 704px (16 cols)
    //HEIGHT = 528px (12 rows)

    const map = [
       'xxxxxxxxxxxxxxxx',
       'x              x',
       'x         b    x',
       'x         &    x',
       'x              x',
       'x              x',
       'd              x',
       'x   $          x',
       'x              x',
       'xb             x',
       'x              x',
       'xxxxxxxxxxxxxxxx',
       
    ]

    const levelCfg = {
        width: 44,
        height: 44,
        'x' : [sprite("Lvl1Wall"), solid(), "wall"],
        'd' : [sprite("door")],
        'b' : [sprite("boss1"), "boss", {dir: -1.5}],
        '$' : [sprite("hole"), solid()],
        '&' : [sprite("hole2"), solid()],

    }

    addLevel(map, levelCfg)
    //add([sprite('Lvl1Floor'), layer('bg')])
    add([sprite('bg'), layer('bg')])
    

    const scoreLabel = add([text("0"), pos (525,535), layer("ui"),{value: score,}, scale(3.5)])
    const life1 = add([sprite("lives"), pos(600, 535)])
    const life2 = add([sprite("lives"), pos(630, 535)])
    const life3 = add([sprite("lives"), pos(660, 535)])
    const caveMusic = play("cave", {loop: true,})
    caveMusic.volume(0.1)

    //Player movements & sprite change
  
    const player = add([sprite("LinkGoingRight"), scale(1), pos(10, 260)])


    function respawn(){
        //destroy(player)
        //readd(player)
        numLives --
        player.pos = vec2(10, 260)

        if (numLives == 2){
            destroy(life3)
            //how to rest lives on restart?
        }

        if (numLives == 1){
            destroy(life2)
        }

        if (numLives == 0){
            destroy(life1)
        }

        
        if (numLives == 0){
            caveMusic.stop()
            go("gameOver", {score: scoreLabel.value})
        }
        


    }
    

    player.action(() => {
        player.resolve()
    })

    keyPress("left", () =>  {
       // player.scale.x = 1
        player.changeSprite("LinkRunLeft")
        player.play("runLeft")
    })

    
    keyDown("left", () =>  {
        player.move(-playerSpeed, 0)
    })


     keyRelease("left", () => {
        player.play("idleLeft")
     })


    //-----------------------------------------------

    // keyDown("right", () =>  {
    //     player.changeSprite("LinkGoingRight")
    //     player.move(playerSpeed, 0)
    // })

    
    keyPress("right", () =>  {
        //player.scale.x = -1
        player.changeSprite("LinkRunRight")
        player.play("runRight")
    })

    
    keyDown("right", () =>  {
        player.move(playerSpeed, 0)
    })


     keyRelease("right", () => {
        //player.scale.x = 1
        player.play("idleRight") 
     })



    //-----------------------------------------------

    keyDown("up", () =>  {
        player.changeSprite("LinkGoingUp")
        player.move(0, -playerSpeed)
    })

    keyDown("down", () =>  {
        player.changeSprite("LinkGoingDown")
        player.move(0, playerSpeed)
    })

    //movement of lvl1 bnoss
    action("boss", (boss) => {
        boss.move(boss.dir * bossSpeed, 0)
    })

    //collision detection with boss
    collides("boss", "wall", (boss) => {
        boss.dir = -boss.dir
    })

    player.overlaps("boss", () => {
        respawn()
    })
})



//CALL RESET FUNCTION IN GAME OVER SCENE TO REST VALUES
//Game over scene
 scene("gameOver", ({score}) => {

    add([text("Game Over!", 32), origin("center"), pos(width()/2, height()/2)])
    add([text("Final Score:" + score, 32), origin("center"), pos(width()/2, height()/2 + 50)])
    keyPress("enter", () => {
		go("game",{ level: 0, score: 0});
        numLives = 3
	});
})


//Start screen scene
scene("start", () => {
    const introMusic = play("intro", {loop: true,})
    const introText = add([text("Press Enter to start", 32), origin("center"), pos(width()/2 + 25, height()/2 + 300), color(1,0,0)]) 
    introMusic.volume(0.1)
    add([sprite("startScreen"), pos(width()/8, height()/10)])


    introText.action(() => {
        loop(4, () => {
            add([text("Press Enter to start", 32), origin("center"), pos(width()/2 + 25, height()/2 + 300), color(0,0,0)])

        })         
    

    })
    
    keyDown("enter", () =>{
        go('game', { level: 0, score: 0})
        introMusic.stop()
    })


})



start('start', { level: 0, score: 0})


