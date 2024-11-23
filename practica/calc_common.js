const readline = require('readline');
const rl = readline.createInterface({
    input : process.stdin,
    output : process.stout
});

rl.question('escribe la ecuacion', (input) =>{

    if(input === 'quit'){
        rl.close()
    }else{
        try{
            let value = eval(input);
            console.log(value);
        }catch(exception){
            console.log('error bro')
        }
        rl.close()
    }
    process.stdout.write('escribe tu ecuacion');

});

process.stdout.write('escribe tu ecuacion');
