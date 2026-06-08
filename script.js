const menu = document.getElementById("menu");
const jogo = document.getElementById("jogo");
const tutorial = document.getElementById("tutorial");

let canvas;
let ctx;

let birdY;
let velocity;
let gravity;

let pipes;
let score;

let gameRunning = false;

let jogador = "";

let clouds = [
    {x:100,y:100},
    {x:300,y:180},
    {x:500,y:120},
    {x:700,y:80}
];

function carregarJogador(){

    let ultimoJogador =
    localStorage.getItem("ultimoJogador");

    if(ultimoJogador){

        document.getElementById(
            "ultimoJogador"
        ).innerText =
        "Último jogador: " +
        ultimoJogador;

    }

}

function mostrarTutorial(){

    if(tutorial.style.display === "block"){
        tutorial.style.display = "none";
    }else{
        tutorial.style.display = "block";
    }

}

function iniciarJogo(){

    jogador =
    document.getElementById(
        "nomeJogador"
    ).value.trim();

    if(jogador === "adminreset"){

        localStorage.clear();

        alert(
            "Ranking apagado com sucesso!"
        );

        atualizarRanking();

        document.getElementById(
            "nomeJogador"
        ).value = "";

        return;
    }

    if(jogador === ""){

        alert(
            "Digite seu nome para jogar!"
        );

        return;
    }

    localStorage.setItem(
        "ultimoJogador",
        jogador
    );

    document.getElementById(
        "jogadorAtual"
    ).innerText =
    jogador;

    menu.style.display = "none";
    jogo.style.display = "block";

    iniciarFlappy();

}

function voltarMenu(){

    gameRunning = false;

    document.getElementById(
        "gameOver"
    ).style.display = "none";

    jogo.style.display = "none";

    menu.style.display = "block";

}

function iniciarFlappy(){

    canvas =
    document.getElementById("game");

    ctx =
    canvas.getContext("2d");

    birdY = 250;
    velocity = 0;
    gravity = 0.4;

    pipes = [];
    score = 0;

    gameRunning = true;

    document.getElementById(
        "score"
    ).innerText = score;

    document.onclick = pular;
    document.onkeydown = pular;

    atualizar();

}

function pular(){

    if(gameRunning){
        velocity = -8;
    }

}

function criarCano(){

    pipes.push({
        x:400,
        top:Math.random()*250,
        contado:false
    });

}

function atualizar(){

    if(!gameRunning){
        return;
    }

    velocity += gravity;
    birdY += velocity;

    if(birdY < 0 || birdY > 520){
        gameOver();
        return;
    }

    if(
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < 200
    ){
        criarCano();
    }

    ctx.clearRect(0,0,400,600);

    clouds.forEach(cloud=>{

        cloud.x -= 1;

        if(cloud.x < -100){
            cloud.x = 500;
        }

        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(cloud.x,cloud.y,20,0,Math.PI*2);
        ctx.arc(cloud.x+25,cloud.y,25,0,Math.PI*2);
        ctx.arc(cloud.x+50,cloud.y,20,0,Math.PI*2);
        ctx.fill();

    });

    /* PASSARINHO */

    ctx.fillStyle = "#FFD700";

    ctx.beginPath();
    ctx.ellipse(
        65,
        birdY + 15,
        18,
        14,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#FFC300";

    ctx.beginPath();
    ctx.ellipse(
        58,
        birdY + 18,
        10,
        7,
        -0.5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        72,
        birdY + 10,
        4,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(
        73,
        birdY + 10,
        2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#ff8800";

    ctx.beginPath();
    ctx.moveTo(82,birdY+15);
    ctx.lineTo(95,birdY+10);
    ctx.lineTo(95,birdY+20);
    ctx.fill();

    pipes.forEach(pipe => {

        pipe.x -= 3;

        let gradiente =
        ctx.createLinearGradient(
            pipe.x,
            0,
            pipe.x + 60,
            0
        );

        gradiente.addColorStop(
            0,
            "#0f7d0f"
        );

        gradiente.addColorStop(
            0.5,
            "#32cd32"
        );

        gradiente.addColorStop(
            1,
            "#0f7d0f"
        );

        ctx.fillStyle = gradiente;

        ctx.fillRect(
            pipe.x,
            0,
            60,
            pipe.top
        );

        ctx.fillRect(
            pipe.x - 5,
            pipe.top - 20,
            70,
            20
        );

        ctx.fillRect(
            pipe.x,
            pipe.top + 180,
            60,
            600
        );

        ctx.fillRect(
            pipe.x - 5,
            pipe.top + 180,
            70,
            20
        );

        ctx.strokeStyle = "#0b4f0b";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            pipe.x,
            0,
            60,
            pipe.top
        );

        ctx.strokeRect(
            pipe.x,
            pipe.top + 180,
            60,
            600
        );

        if(
            pipe.x < 80 &&
            pipe.x > 20 &&
            (
                birdY < pipe.top ||
                birdY + 30 > pipe.top + 180
            )
        ){
            gameOver();
        }

        if(pipe.x < 50 && !pipe.contado){

            score++;

            pipe.contado = true;

            document.getElementById(
                "score"
            ).innerText = score;

        }

    });

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0,550,400,50);

    ctx.fillStyle = "#32CD32";
    ctx.fillRect(0,540,400,10);

    requestAnimationFrame(
        atualizar
    );

}

function gameOver(){

    gameRunning = false;

    let recorde =
    Number(
        localStorage.getItem(
            "recorde_" + jogador
        )
    ) || 0;

    if(score > recorde){

        recorde = score;

        localStorage.setItem(
            "recorde_" + jogador,
            score
        );

    }

    atualizarRanking();

    document.getElementById(
        "finalScore"
    ).innerText =
    jogador +
    " fez " +
    score +
    " pontos";

    document.getElementById(
        "recorde"
    ).innerText =
    "Recorde de " +
    jogador +
    ": " +
    recorde;

    jogo.style.display = "none";

    document.getElementById(
        "gameOver"
    ).style.display = "block";

}

function reiniciarJogo(){

    document.getElementById(
        "gameOver"
    ).style.display = "none";

    jogo.style.display = "block";

    iniciarFlappy();

}

function atualizarRanking(){

    let ranking = [];

    for(let i = 0; i < localStorage.length; i++){

        let chave = localStorage.key(i);

        if(chave.startsWith("recorde_")){

            let nome =
            chave.replace(
                "recorde_",
                ""
            );

            let pontos =
            Number(
                localStorage.getItem(chave)
            );

            ranking.push({
                nome,
                pontos
            });

        }

    }

    ranking.sort(
        (a,b) =>
        b.pontos - a.pontos
    );

    let html = "";

    ranking
    .slice(0,5)
    .forEach((item,index)=>{

        html += `
        <div>
            ${index + 1}º 🏆
            ${item.nome}
            - ${item.pontos} pts
        </div>
        `;

    });

    if(html === ""){

        html =
        "<div>Nenhum jogador ainda</div>";

    }

    const rankingDiv =
    document.getElementById(
        "ranking"
    );

    if(rankingDiv){
        rankingDiv.innerHTML = html;
    }

}

carregarJogador();
atualizarRanking();