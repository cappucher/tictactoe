let board = [null, null, null, null, null, null, null, null, null];

const Gameboard = (() => {

    const turn = (state = board) => {
        players = ["X", "O"];
        sum = 0;
        for (let i = 0; i < 9; i++){
            if (state[i] != null){
                sum++;
            }
        }
        return players[sum % 2];
    }

    const winner = (state = board) => {
        combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
        for (let i = 0; i < combinations.length; i++){
            if (state[combinations[i][0]] == state[combinations[i][1]] && state[combinations[i][1]] == state[combinations[i][2]]){
                if (state[combinations[i][0]] == "X"){
                    return "X";
                }
                else if (state[combinations[i][0]] == "O"){
                    return "O";
                }
            }
        }
        return null;
    }

    const utility = (state = board) => {
        if (winner(state) == "X"){
            return 1;
        }
        else if (winner(state) == "O"){
            return -1;
        }
        return 0;
    }

    const actions = (state = board) => {
        actionArray = [];
        for (let i = 0; i < 9; i++){
            if (state[i] == null){
                actionArray.push(i);
            }
        }
        return actionArray;
    }

    const result = (action, state = board) =>{
        if (state[action] != null){
            return false;
        }
        state[action] = turn();
        return true;
    }
    const resultCopy = (action, state = board) => {
        if (state[action] != null){
            return board;
        }
        let boardCopy = state.slice();
        boardCopy[action] = turn(state);
         return boardCopy;
    }

    const terminal = (state = board) => {
        sum = 0;
        for (let i = 0; i < 9; i++){
            if (state[i] != null){
                sum++;
            }
        }
        if (winner(state) != null){
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
        turn,
        winner,
        utility,
        actions,
        result,
        terminal,
        clear,
        resultCopy
    }

})();

const displayController = (() => {

    const displayBoard = () => {
        const elements = document.querySelector(".grid").children;
        for (let i = 0; i < 9; i++){
            elements.item(i).textContent = board[i];
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
            for (let i = 0; i < 9; i++) {
                elements.item(i).style.pointerEvents = 'none';
            }
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
            setTimeout(() => {
                if (document.querySelector("#difficulty").value == "easy"){
                    AI.randomMove();
                }
                else if (document.querySelector("#difficulty").value == "impossible"){
                    AI.minimax();
                }
                else{
                    AI.stopObvious();
                }
                for (let i = 0; i < 9; i++) {
                    elements.item(i).style.pointerEvents = 'auto';
                }
                changeWinner();
            }, 500);
        }
        for (let i = 0; i < 9; i++){
            elements.item(i).addEventListener("click", () => {
                if (!Gameboard.terminal() && player.value == "X"){
                    let x = Gameboard.result(i);
                    displayBoard();
                    if (mode.value == "AI" && !Gameboard.terminal() && x){
                        for (let i = 0; i < 9; i++) {
                            elements.item(i).style.pointerEvents = 'none';
                        }
                        document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                        setTimeout(() => {
                            if (document.querySelector("#difficulty").value == "easy"){
                                AI.randomMove();
                            }
                            else if (document.querySelector("#difficulty").value == "impossible"){
                                AI.minimax();
                            }
                            else{
                                AI.stopObvious();
                            }
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
                                if (document.querySelector("#difficulty").value == "easy"){
                                    AI.randomMove();
                                }
                                else if (document.querySelector("#difficulty").value == "impossible"){
                                    AI.minimax();
                                }
                                else{
                                    AI.stopObvious();
                                }
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
        let actions = Gameboard.actions();
        let move = Math.floor(Math.random() * actions.length);
        Gameboard.result(actions[move]);
        document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
        displayController.displayBoard();
    }

    const minimax = (state) => {
        let computerTurn = document.querySelector("#player").value == "X" ? "O" : "X";
        results = {}
        if (computerTurn == "X"){
            let big = -2;
            let bestMove = 0;
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                results[Gameboard.actions(state)[i]] = minValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state));
            }
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                if (Gameboard.winner(Gameboard.resultCopy(Gameboard.actions(state)[i], state)) == "X"){
                    Gameboard.result(Gameboard.actions(state)[i]);
                    document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                    displayController.displayBoard();
                    return;
                }
                if (results[Gameboard.actions(state)[i]] > big){
                    big = results[Gameboard.actions(state)[i]];
                    bestMove = Gameboard.actions(state)[i];
                }
            }
             Gameboard.result(bestMove);
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
            displayController.displayBoard();
        }
        else{
            let small = 2;
            let bestMove = 0;
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                results[Gameboard.actions(state)[i]] = maxValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state));
            }
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                if (Gameboard.winner(Gameboard.resultCopy(Gameboard.actions(state)[i], state)) == "O"){
                    Gameboard.result(Gameboard.actions(state)[i]);
                    document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                    displayController.displayBoard();
                    return;
                }
                if (results[Gameboard.actions(state)[i]] < small){
                    small = results[Gameboard.actions(state)[i]];
                    bestMove = Gameboard.actions(state)[i];
                }
            }
            Gameboard.result(bestMove);
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
            displayController.displayBoard();
        }
    }

    const maxValue = (state, depth = 9) => {
        if (Gameboard.terminal(state) || depth == 0){
            return Gameboard.utility(state);
        }
        let v = -2;
        for (let i = 0; i < Gameboard.actions(state).length; i++){
            v = Math.max(v, minValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state), depth - 1));
        }
        return v;
    }

    const minValue = (state, depth = 9) => {
        if (Gameboard.terminal(state) || depth == 0){
            return Gameboard.utility(state);
        }
        let v = 2;
        for (let i = 0; i < Gameboard.actions(state).length; i++){
            v = Math.min(v, maxValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state), depth - 1));
        }
        return v;
    }
    
    const stopObvious = (state) => {
        let computerTurn = document.querySelector("#player").value == "X" ? "O" : "X";
        results = {}
        if (computerTurn == "X"){
            let big = -2;
            let bestMove = 0;
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                results[Gameboard.actions(state)[i]] = minValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state), 2);
            }
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                if (Gameboard.winner(Gameboard.resultCopy(Gameboard.actions(state)[i], state)) == "X"){
                    Gameboard.result(Gameboard.actions(state)[i]);
                    document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                    displayController.displayBoard();
                    return;
                }
                if (results[Gameboard.actions(state)[i]] > big){
                    big = results[Gameboard.actions(state)[i]];
                    bestMove = Gameboard.actions(state)[i];
                }
            }
             Gameboard.result(bestMove);
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
            displayController.displayBoard();
        }
        else{
            let small = 2;
            let bestMove = 0;
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                results[Gameboard.actions(state)[i]] = maxValue(Gameboard.resultCopy(Gameboard.actions(state)[i], state), 2);
            }
            for (let i = 0; i < Gameboard.actions(state).length; i++){
                if (Gameboard.winner(Gameboard.resultCopy(Gameboard.actions(state)[i], state)) == "O"){
                    Gameboard.result(Gameboard.actions(state)[i]);
                    document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
                    displayController.displayBoard();
                    return;
                }
                if (results[Gameboard.actions(state)[i]] < small){
                    small = results[Gameboard.actions(state)[i]];
                    bestMove = Gameboard.actions(state)[i];
                }
            }
            Gameboard.result(bestMove);
            document.querySelector("#turn").textContent = `Player ${Gameboard.turn()}'s turn`
            displayController.displayBoard();
        }
    }

    const randomTurn = () => {
        const elements = document.querySelector(".grid").children;

        for (let i = 0; i < 9; i++) {
            elements.item(i).style.pointerEvents = 'none';
        }
        setTimeout(() => {
            if (document.querySelector("#difficulty").value == "easy"){
                randomMove();
            }
            else if (document.querySelector("#difficulty").value == "impossible"){
                minimax();
            }
            else{
                stopObvious();
            }
            for (let i = 0; i < 9; i++) {
                elements.item(i).style.pointerEvents = 'auto';
            }
        }, 250);
        
    }
    return {
        randomMove,
        randomTurn,
        stopObvious,
        minimax
    }
})();




displayController.addEvents();