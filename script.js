//2399
let maxW = document.documentElement.clientWidth;

let gameStart = false;
const salto = 150;
const gameSpeed = 15;
let endGame = false;
let groundMove;
let dinoMove;
let cactusMove;
let staSaltando = false;
let punti = 1;
document.documentElement.addEventListener('keydown', clickForStartGame); //add event che fa startare il gioco

window.addEventListener('resize',()=>{
    bloccatutto();
    maxW = document.documentElement.clientWidth; //fa in modo che il gioco non crei problemi
    //se si fa il resize della finestra
})

function clickForStartGame() {
    if (!gameStart) {
        gameStart = true;
        document.documentElement.addEventListener('keydown', clickJump);
        document.getElementById('dino-stationary').style.display = "none";

        dinoMove = dinoMovement();
        groundMove = groundMovement();

        document.getElementById('cactus-spawn').innerHTML = `
        <div class="cactus" style="position: absolute; left:${maxW}px; top: calc(50% - 36px);"> 
        <img src="imgs/cactus.png">
        </div>`;



        cactusMove = cactusMovement(dinoMove, groundMove);
        //console.log(maxW);
    } //if (!gameStart)
}

let wait = false;
function clickJump() {
    {
        let topTemp = parseInt(getComputedStyle(document.getElementById('dino'), null).top);
        if (event.key == ' ' || event.key == 'w') {
            if (!wait && !endGame) {
                const jumpDelay = 300;
                const waitJumpDelay = jumpDelay - 100;
                //console.log(topTemp - salto);
                document.getElementById('dino').style.top = `${topTemp - salto}px`;
                wait = true;
                staSaltando = true;
                setTimeout(() => {
                    document.getElementById('dino').style.top = "calc(50% - 70px)";
                    setTimeout(() => {
                        wait = false;
                        staSaltando = false;
                    }, waitJumpDelay);
                }, jumpDelay);
            }
        }
    }
}

function dinoMovement() {
    let dinoImageMov = 0;
    const dinoMovementSpeed = 100;
    let dinoMove = setInterval(function () {
        if (dinoImageMov % 2 == 0) {
            document.getElementById('dino-run-0').style.display = "block";
            document.getElementById('dino-run-1').style.display = "none";
        }
        else {
            document.getElementById('dino-run-1').style.display = "block";
            document.getElementById('dino-run-0').style.display = "none";
        }

        //console.log(dinoImageMov);
        dinoImageMov++;
    }, dinoMovementSpeed);
    return dinoMove;
}

function groundMovement() {
    let groundSpace = 0;
    let groundMove = setInterval(function () {
        groundSpace += 10;
        document.getElementById('ground').style.left = `-${groundSpace}px`;
        //console.log(maxW,groundSpace);
        if (groundSpace == 2400) { //2399 è la width dell'imm ground, che conosciamo e non varia
            groundSpace = 0;
        }
    }, gameSpeed);
    return groundMove;
}

function cactusMovement(dinoMove, groundMove) {
    let incrementaPunteggio = false;
    let cactusDistance = 100;
    let cactusMoveSpace = [maxW,maxW+cactusDistance];
    let dinoTopStart = getComputedStyle(document.getElementById('dino'), null).top;
    let cactusMove = setInterval(function () {
        let dinoW = getComputedStyle(document.getElementById('dino'), null).width;
        let dinoTop = getComputedStyle(document.getElementById('dino'), null).top;
        /*let cactusH = getComputedStyle(document.querySelector('.cactus'), null).height;
        let cactusW = getComputedStyle(document.querySelector('.cactus'), null).width;*/
        let cactusso = document.getElementsByClassName('cactus');
        let cactusH = [];
        let cactusW = [];
        for(let i=0; i<cactusso.length; i++){
            cactusH.push(getComputedStyle(cactusso[i], null).height);
            cactusW.push(getComputedStyle(cactusso[i], null).width);
        }
  //per domani : ho notato che i cactus bonus spawnati non ottengono la collisione
  //perché querySelector prende soltanto il primo con classe cactus

  for(let i=0; i<cactusso.length; i++){
        //se il cactus sta a dinoW si esegue il controllo
        
        const collision = 30;
        //console.log(i,cactusMoveSpace[i] ,'<',parseInt(dinoW) - collision ,'&&', cactusMoveSpace[i] ,'>', -parseInt(cactusW[i]) + collision);
        if (cactusMoveSpace[i] < parseInt(dinoW) - collision && cactusMoveSpace[i] > - parseInt(cactusW[i]) + collision) {
           // console.log(i,'cactus',cactusW[i],cactusH[i],cactusso.length);
            if (parseInt(dinoTopStart) - parseInt(cactusH[i]) < parseInt(dinoTop))
                bloccatutto();
            else if(staSaltando){
                staSaltando = false;
                document.getElementById('points').innerHTML = `${punti++}`;}
        }}
        
        cactusMoveSpace[0] -= 10;
        cactusMoveSpace[1] -= 10;
        let cactus = document.getElementsByClassName('cactus');
        for (let i = 0; i < cactus.length; i++)
            cactus[i].style.left = `${cactusMoveSpace[0] + i * cactusDistance}px`;
        //console.log(maxW,groundSpace);
        if (cactusMoveSpace[0] < -(cactusDistance)) { //deve basarsi sul cactus extra ci stava un + 100 dopo cactusdistance          
            spawnaCactus();
            formaCactus();
            cactusDistance = spawnaCactusBonus(cactusDistance);
            cactusMoveSpace[0] = maxW;
            cactusMoveSpace[1] = maxW + cactusDistance;
        }
        
    }, gameSpeed);
    return cactusMove;
}

function spawnaCactus() {
    document.getElementById('cactus-spawn').innerHTML = `
    <div class="cactus" style="position: absolute; left:${maxW}px; top: calc(50% - 36px);">
    </div>
    `;
}

function spawnaCactusBonus(cactusDistance) {
    let cactusBonus = Math.floor(Math.random() * 10); //5 su 10 che esca più di un cactus
    //console.log(cactusBonus);
    if (cactusBonus % 2) {
        const minCactusDist = 300;
        const varCactusDist = 200; //aggiunge un num da 0 a 200
        cactusDistance = minCactusDist + Math.floor(Math.random() * varCactusDist);
        //console.log(cactusDistance);
        document.getElementById('cactus-spawn').innerHTML += `
    <div class="cactus" style="position: absolute; left:${maxW}px; top: calc(50% - 36px);"> 
    <img src="imgs/cactus.png">
    </div>
        `;
    }
    return cactusDistance;

}

function formaCactus() {
    let forma = Math.floor(Math.random() * 3 + 1); //forma da 1 a 3 cactus vicini
    for (let i = 0; i < forma; i++)
        document.querySelector(".cactus").innerHTML += `<img src="imgs/cactus.png">`
}

function bloccatutto() {
    clearInterval(dinoMove);
    clearInterval(groundMove);
    clearInterval(cactusMove);
    endGame = true;
    document.getElementById('lose').style.display ="block";
    document.getElementById('dino').innerHTML = `<img src="imgs/dino-lose.png" alt="">`;
}