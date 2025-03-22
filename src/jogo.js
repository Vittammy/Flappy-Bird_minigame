console.log(' [Vivi] Flappy Bird');

let frames = 0;

// ----- sons
const som_caiu = new Audio();
som_caiu.src = './sons/pancada.mp3';

// ---------------------------------------------------------------------------------------------- imagens
const sprites = new Image();
sprites.src = '../img/tude.png';
// ------ 
const ready = new Image();
ready.src = '../img/inicio2.png';
// ------
const birde = new Image();
birde.src = '../img/birde2.png';
//-------
const verde = new Image();
verde.src = '../img/chao.png';
// ---------
const montanhas = new Image();
montanhas.src = '../img/montanhas.png';
//---------
const tubos = new Image();
tubos.src = '../img/tubos.png';
//-------------------------------------------------------------------------------------------------------------

const canvas = document.querySelector('canvas'); // canvas foi feito para desenhar
const contexto = canvas.getContext('2d'); //o jogo vai ser 2d

// -------- função de colisao com o chao
function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
};

// -------------------------------------------- [ Passarenho ] --------------------------------------------

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 100,
        altura: 29,
        x: 10,
        y: 20,

        gravidade: 0.25,
        velocidade: 0,

        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },

        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                console.log('fez colisao');
                som_caiu.play();

                setTimeout(() => {
                    mudaParaTela(telas.INICIO);
                }, 1000);

                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },

        // ------------ movimentos do passarinho

        movimentos: [
            { spriteX: 0, spriteY: 3, }, // asa pra cima
            { spriteX: 0, spriteY: 38, }, // asa no meio
            { spriteX: 0, spriteY: 68, }, // asa pra baixo
        ],

        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloDeFrames = 9;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {

                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;

            }
        },

        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                birde,
                spriteX, spriteY, // sprite X, sprite Y
                flappyBird.largura, flappyBird.altura, // width, heigth
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}


// -------------------------------------------- [ Chao ] --------------------------------------------
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 0,
        largura: 256,
        altura: 128,
        x: 0,
        y: canvas.height - 110,

        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },

        desenha() {
            contexto.drawImage(
                verde,
                chao.spriteX, chao.spriteY, // sprite X, sprite Y
                chao.largura, chao.altura, // width, heigth
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            contexto.drawImage(
                verde,
                chao.spriteX, chao.spriteY, // sprite X, sprite Y
                chao.largura, chao.altura, // width, heigth
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );

        }
    }
    return chao;
}


// -------------------------------------------- [ Plano de Fundo ] --------------------------------------------
function criaFundo() {
    const fundo = {
        spriteX: 0,
        spriteY: 0,
        largura: 300,
        altura: 300,
        x: 0,
        y: canvas.height - 220,

        desenha() {
            contexto.fillStyle = '#5fcde4';
            contexto.fillRect(0, 0, canvas.width, canvas.height);

            contexto.drawImage(
                montanhas,
                fundo.spriteX, fundo.spriteY, // sprite X, sprite Y
                fundo.largura, fundo.altura, // width, heigth
                fundo.x, fundo.y,
                fundo.largura, fundo.altura,
            );

            contexto.drawImage(
                montanhas,
                fundo.spriteX, fundo.spriteY, // sprite X, sprite Y
                fundo.largura, fundo.altura, // width, heigth
                (fundo.x + fundo.largura - 85), fundo.y,
                fundo.largura, fundo.altura,
            );
        }
    }
    return fundo;
}


// -------------------------------------------- [ Mensagem Get Ready ] --------------------------------------------
const getReady = {
    spriteX: 0,
    spriteY: 0,
    largura: 300,
    altura: 200,
    x: (canvas.width / 2) - 260 / 2,
    y: 60,

    desenha() {
        contexto.drawImage(
            ready,
            getReady.spriteX, getReady.spriteY, // sprite X, sprite Y
            getReady.largura, getReady.altura, // width, heigth
            getReady.x, getReady.y,
            getReady.largura, getReady.altura,
        );
    }
}

// -------------------------------------------- [ Canos ] --------------------------------------------
function criaCanos() {
    const canos = {
        largura: 40,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 2,
        },
        ceu: {
            spriteX: 45,
            spriteY: 3,
        },
        espaco: 200,

        desenha() {
            canos.pares.forEach(function (par) {

                const espacamento = 100; // entre canos
                const yRandom = par.y;

                // ----------------------- [ Cano do Céu ]
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                contexto.drawImage(
                    tubos,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
                // ----------------------- [ Cano do Chão ]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamento + yRandom;
                contexto.drawImage(
                    tubos,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }

            });

        },

        bateuPassarinho(par) {

            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if (globais.flappyBird.x >= par.x) {
                console.log('flappy bird invadiu a área dos canos');
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peDoFlappy >= par.canoChao.y) {
                    return true;
                }
            }

            return false;
        },

        pares: [], // pares de canos

        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                console.log('passou 100 frames');
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1), // gera um numero aleatorio multiplicando o 150
                });
            }

            canos.pares.forEach(function (par) { // percorre todos os canos
                par.x = par.x - 2;

                if (canos.bateuPassarinho(par)) {
                    console.log('voce perdeu');
                    mudaParaTela(telas.INICIO);
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift(); // remove o 1 elemento do array e retorna ele
                }
            });
        }
    }
    return canos;
}

// ----------------------------- [ Telas ] -----------------------------------------
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    INICIO: {
        inicializa() {
            globais.fundo = criaFundo();
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            globais.fundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            getReady.desenha();
        },
        click() {
            mudaParaTela(telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
            globais.canos.atualiza();
        },
    }
}

telas.JOGO = {
    desenha() {
        globais.fundo.desenha();
        globais.flappyBird.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
        globais.chao.atualiza();
    }
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(telas.INICIO);
loop();