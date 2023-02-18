const Gameboard = (() => {

    let board = [null, null, null, null, null, null, null, null, null];

    const turn = () => {
        players = ["X", "O"];
        sum = 0;
        for (let i = 0; i < 9; i++){
            if (board[i] != null){
                sum++;
            }
        }
        return players[sum % 2];
    }

    const winner = () => {
        combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
        for (let i = 0; i < combinations.length; i++){
            if (board[combinations[i][0]] == board[combinations[i][1]] && board[combinations[i][1]] == board[combinations[i][2]]){
                if (board[combinations[i][0]] == "X"){
                    return "X";
                }
                else if (board[combinations[i][0]] == "O"){
                    return "O";
                }
            }
        }
        return null;
    }

    const utility = () => {
        if (winner() == "X"){
            return 1;
        }
        else if (winner() == "O"){
            return -1;
        }
        return 0;
    }

    const actions = () => {
        actionArray = [];
        for (let i = 0; i < 9; i++){
            if (board[i] == null){
                actionArray.push(i);
            }
        }
        return actionArray;
    }

    const result = (action) => {
        if (board[action] != null){
            return false;
        }
        board[action] = turn();
        return true;
    }

    const terminal = () => {
        sum = 0;
        for (let i = 0; i < 9; i++){
            if (board[i] != null){
                sum++;
            }
        }
        if (winner() != null){
            return true;
        }
        else if (sum == 9){
            return true;
        }
        return false;
    }

    const clear = () => {
        for (let i = 0; i < 9; i++){
            board[i] = null;
        }
    }

    return {
        board,
        turn,
        winner,
        utility,
        actions,
        result,
        terminal,
        clear
    }

})();

const displayController = (() => {
    const displayBoard = () => {
        const elements = document.querySelector(".grid").children;
        for (let i = 0; i < 9; i++){
            elements.item(i).textContent = Gameboard.board[i];
        }
    }

    const changeWinner = () => {
        if (Gameboard.terminal() && Gameboard.winner() != null){
            document.querySelector("#reset").textContent = "↻ Play Again";
            document.querySelector("#turn").textContent = `Player ${Gameboard.winner()} wins!`;
        }
        else if (Gameboard.terminal() && Gameboard.winner() == null){
            document.querySelector("#reset").textContent = "↻ Play Again";
            document.querySelector("#turn").textContent = `It's a tie.`
        }
        else{
            console.log("turn: " + Gameboard.turn());
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
        }
    }

    const addEvents = () => {
        const mode = document.querySelector("#mode");
        const player = document.querySelector("#player");
        const reset = document.querySelector("#reset");
        if (mode.value == "AI"){
            document.querySelector(".AI-settings").style.display = "inline-block";
        }
        else{
            document.querySelector(".AI-settings").style.display = "none";
        }
        const elements = document.querySelector(".grid").children;
        if (mode.value == "AI" && player.value == "O"){
            setTimeout(() => {
                AI.randomTurn();
            }, 250);
        }
        for (let i = 0; i < 9; i++){
            elements.item(i).addEventListener("click", () => {
                if (!Gameboard.terminal() && player.value == "X"){
                    let x = Gameboard.result(i);
                    displayBoard();
                    if (mode.value == "AI" && !Gameboard.terminal()){
                        for (let i = 0; i < 9; i++) {
                            elements.item(i).style.pointerEvents = 'none';
                        }
                        document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                        setTimeout(() => {
                            AI.randomMove();
                            for (let i = 0; i < 9; i++) {
                                elements.item(i).style.pointerEvents = 'auto';
                            }
                            changeWinner();
                        }, 500);
                    }
                    else{
                        changeWinner();
                    }
                }
                else if (!Gameboard.terminal() && player.value == "O"){
                    let x = Gameboard.result(i);
                    displayBoard();
                    if (mode.value == "AI" && !Gameboard.terminal() && x){
                        const elements = document.querySelector(".grid").children;

                        if (mode.value == "AI" && !Gameboard.terminal()){
                            for (let i = 0; i < 9; i++) {
                                elements.item(i).style.pointerEvents = 'none';
                            }
                            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
    
                            setTimeout(() => {
                                AI.randomMove();
                                for (let i = 0; i < 9; i++) {
                                    elements.item(i).style.pointerEvents = 'auto';
                                }
                                changeWinner();
                            }, 500);
                        }
                        else{
                            changeWinner();
                        } 
                    }
                    else{
                        changeWinner();
                    }
                }
            });
        }
        reset.addEventListener("click", () => {
            Gameboard.clear();
            reset.textContent = "↻ Reset Game";
            displayBoard();
            document.querySelector("#turn").textContent = "Player X's turn";
            if (mode.value == "AI" && player.value == "O"){
                setTimeout(() => {
                    AI.randomTurn();
                }, 250);
            }
        })
    }

    const AIsettings = () => {
        document.querySelector("#turn").textContent = `Player X's turn`
        if (document.querySelector("#mode").value == "AI"){
            Gameboard.clear();
            displayBoard();
            document.querySelector(".AI-settings").style.display = "inline-block";
            if (document.querySelector("#player").value == "O"){
                AI.randomTurn();
            }
        }
        else{
            Gameboard.clear();
            displayBoard();
            document.querySelector(".AI-settings").style.display = "none";
        }
    }

    const reset = () => {
        Gameboard.clear(); 
        displayBoard();
        document.querySelector("#turn").textContent = "Player X's turn";
        document.querySelector("#reset").textContent = "↻ Reset Game";
        if (document.querySelector("#player").value == 'O'){
            setTimeout(() => {
                AI.randomTurn();
            }, 250);
        } 
    }

    return {
        displayBoard,
        addEvents,
        AIsettings,
        reset
    }
})();

const AI = (() => {
    const randomMove = () => {
        actions = Gameboard.actions();
        move = Math.floor(Math.random() * actions.length);
        Gameboard.result(actions[move]);
        document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
        displayController.displayBoard();
    }

    const randomTurn = () => {
        const elements = document.querySelector(".grid").children;

        for (let i = 0; i < 9; i++) {
            elements.item(i).style.pointerEvents = 'none';
        }
        setTimeout(() => {
            AI.randomMove();
            for (let i = 0; i < 9; i++) {
                elements.item(i).style.pointerEvents = 'auto';
            }
        }, 250);
        
    }
    return {
        randomMove,
        randomTurn
    }
})();


displayController.addEvents();