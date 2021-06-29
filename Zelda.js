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
let livesLost = false

//Load sprite assets 35x48
loadSprite("LinkGoingRight", "Sprites/LinkGoingRight.png")
loadSprite("LinkGoingLeft", "Sprites/LinkGoingLeft.png")
loadSprite("LinkGoingUp", "Sprites/LinkGoingUp.png")
loadSprite("LinkGoingDown", "Sprites/LinkGoingDown.png")


loadSprite("boss1", "Sprites/Lvl1Boss1.png")
loadSprite("Lvl1Wall", "Sprites/Wall.png")
loadSprite("bg", "Sprites/LVL1BG.png")
loadSprite("door", "Sprites/Door.png")
loadSprite("lives", "Sprites/Lives.png")
loadSprite("hole", "Sprites/Hole.png")
loadSprite("hole2", "Sprites/Hole2.png")




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

    //Player movements & sprite change

    
    const player = add([sprite("LinkGoingRight"), pos(10, 260)])


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
            go("gameOver", {score: scoreLabel.value})
        }
        


    }
    

    player.action(() => {
        player.resolve()
    })

    keyDown("left", () =>  {
        player.changeSprite("LinkGoingLeft")
        player.move(-playerSpeed, 0)
    })

    keyDown("right", () =>  {
        player.changeSprite("LinkGoingRight")
        player.move(playerSpeed, 0)
    })

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
	});
})



start('game', { level: 0, score: 0})


