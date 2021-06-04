//@ts-check

setTimeout(function(){

    let squares = document.getElementsByClassName('square');
    let toggle;
    let black = false;
    
    for(let i=0; i < squares.length; i++){
        let test = Math.floor(i/8);
        let modulo = test%2
        toggle = modulo == 0;
        if(toggle){
            if(black){
               squares[i].setAttribute('style','background-color: rgb(169, 169, 169);');
            }else{
                squares[i].setAttribute('style','background-color: rgb(169, 169, 169, 0.432);');
            }
        }else{
            if(black){
                squares[i].setAttribute('style','background-color: rgb(169, 169, 169, 0.432);');
             }else{
                 squares[i].setAttribute('style','background-color: rgb(169, 169, 169);');
             }
        }
        black =! black;
    }
}, 10);


// for(let i =0; i < 8; i++){
//     for(let j = 0; j < 8; j++){
//         if(black){
//             squares[i+j].setAttribute('style','background-color: rgb(169, 169, 169);')
//         }else{
//             squares[i+j].setAttribute('style','background-color: rgb(169, 169, 169);');
//         }
//         black != black;
//     }
// }