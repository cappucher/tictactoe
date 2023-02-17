const Gameboard = (() => {

    const board = [null, null, null, null, null, null, null, null, null];

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

    const addEvents = () => {
        const elements = document.querySelector(".grid").children;
        for (let i = 0; i < 9; i++){
            elements.item(i).addEventListener("click", () => {
                if (!Gameboard.terminal()){
                    Gameboard.result(i);
                    displayBoard();
                    
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
            });
        }
        document.querySelector("#reset").addEventListener("click", () => {
            Gameboard.clear();
            document.querySelector("#reset").textContent = "↻ Reset Game";
            displayBoard();
            document.querySelector("#turn").textContent = "Player X's turn";
        })
    }

    return {
        displayBoard,
        addEvents
    }
})();

displayController.addEvents();