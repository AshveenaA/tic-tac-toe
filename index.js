const App=
{
    $:
    {
        menu:document.querySelector('[data-id="menu"]'),
        menuItems:document.querySelector('[data-id="menu-items"]'),
        reset:document.querySelector('[data-id="reset-btn"]'),
        newround:document.querySelector('[data-id="new-round-btn"]'),
        squares:document.querySelectorAll('[data-id="square"]'),
        modal:document.querySelector('[data-id="modal"]'),
        modaltext:document.querySelector('[data-id="modal-text"]'),
        modalbutton:document.querySelector('[data-id="modal-btn"]'),
        turn:document.querySelector('[data-id="turn"]'),
    },

    state:
    { 
        moves:[],
    },

    getGameStatus(moves){
       const p1Moves=moves.filter(move=>move.playerId===1).map(move=>+move.squareId)
       const p2Moves=moves.filter(move=>move.playerId===2).map(move=>+move.squareId)

      console.log(p1Moves);

       const winningPatterns = [
        [1, 2, 3],
        [1, 5, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 5, 7],
        [3, 6, 9],
        [4, 5, 6],
        [7, 8, 9],
        ];

        let winner=null

        console.log(p1Moves);
        winningPatterns.forEach((pattern)=>{
            
            const p1Wins=pattern.every(v=>p1Moves.includes(v))
            const p2Wins=pattern.every(v=>p2Moves.includes(v))

            if(p1Wins) winner=1
            if(p2Wins) winner=2
        });

        return{
            status:moves.length===9|| winner!=null?'complete':'in-progress',
            winner
        };

    },

    init(){
        App.registereventListeners() ;
    },
    

    registereventListeners()
        {

            App.$.menu.addEventListener("click",(event)=>
            {
                App.$.menuItems.classList.toggle("hidden");
            });
    
            App.$.reset.addEventListener("click",(event)=>
            {
                console.log("reset the game");
            });
    
            App.$.newround.addEventListener("click",(event)=>
            {
                console.log("start another game");
            });
           
            App.$.modalbutton.addEventListener("click",(event)=>
            {
                App.state.moves=[];
                App.$.squares.forEach(square=>square.replaceChildren());
                App.$.modal.classList.add("hidden");
               
            });


            App.$.squares.forEach
            ((square) =>{
                square.addEventListener("click",(event)=>
                {
            
             //CHECK IF IT IS ALREADY PLAYED SQUARE
                const hasMove=(squareId)=>{
                    const existingMove=App.state.moves.find((move)=>move.squareId==squareId);
                    return existingMove!==undefined;
                };

                if(hasMove(+square.id))
                {
                    return;
                }

                //DETERMINE WHO TURN IT IS
                const lastMove=App.state.moves.at(-1);
                const getOppositePlayer=(playerId)=>(playerId===1?2:1);
                const currentPlayer=App.state.moves.length==0?1:getOppositePlayer(lastMove.playerId);
                const nextPlayer=getOppositePlayer(currentPlayer);

                const squareicon=document.createElement("i");
                const turnIcon=document.createElement("i");
                const turnLabel=document.createElement("p");
                turnLabel.innerText=`Player ${nextPlayer} you are up!`;

                if(currentPlayer===1)
                {
                    squareicon.classList.add("fa-solid", "fa-x", "yellow");
                    turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnLabel.classList="turquoise";
                }
                else
                {
                    squareicon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnLabel.classList="yellow";
                }
                App.$.turn.replaceChildren(turnIcon,turnLabel);

                App.state.moves.push({
                    squareId:+square.id,
                    playerId:currentPlayer,
                });



                square.replaceChildren(squareicon);
            

                 //CHECK WHO WINS THE GAME
                const game=App.getGameStatus(App.state.moves);
               

               if(game.status==="complete")
                {
                    App.$.modal.classList.remove("hidden");
                   let message="";
                    if(game.winner){
                      
                      message=`Player${game.winner} wins!`;
                
                       
                    }
                     else{
                            message="Tie!";
                        }
                        App.$.modaltext.textContent=message;
                    }
                
            });
            });
        },
};
window.addEventListener("load",App.init);
