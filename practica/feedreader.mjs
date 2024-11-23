import {getLinks, saveLinks} from './feedmanager.mjs';

const feeds = await getLinks();

feeds.push('https://www.tutsplus.com');

await saveLinks(feeds);