process.stdin.on('data', ((chunk) => {
    let input = chunk.toString().trim()

        if(input === 'quit'){
            process.exit(0);
        }

        try{
            const value = eval(input);
            console.log(value);
        }catch(exception){
            console.log('ERROR BROOOO')
        }

        process.stdout.write('escribe tu ecuacion')
}))

process.stdout.write('escribe tu ecuacion')




