import {dirname, join} from 'path';
import { fileURLToPath } from 'url';
import { access, constants } from 'fs/promises';
import { readFile, writeFile } from 'fs';
const  __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JsonFile = join(__dirname, 'feeds.json');

export async function getLinks() {
    try{
        await access(JsonFile, constants.F_OK);

    }catch(error){
        await writeFile(JsonFile, JSON.stringify([]));
    }

        const contents = await readFile(JsonFile, {encoding: 'utf8'});
        return JSON.parse(contents);
}

export async function saveLinks() {
    await writeFile(JsonFile, JSON.stringify(links));
    
}