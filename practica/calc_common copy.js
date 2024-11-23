
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

const readline = require('readline');
const rl = readline.createInterface({
    input,
    output
});

    function question(query){

        return new Promise(resolve =>{
            rl.question(query, resolve);
        });
    }

 let answer = await question('ingresa tu ecuacion');

    while(answer!='quit'){
    
        try{
            let value = eval(input);
            console.log(value);
        }catch(exception){
            console.log('error bro')
        }

        answer = await question('ingrese su ecuacion');

    }

    rl.close();