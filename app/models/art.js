const { Movie, Music, Sentence } = require('./classic')

class Art {
    // 使用scope后, 对结果进行修改，会报错
    static async getData(art_id, type, useScope=true) {
        let art = null
        const finder = {
            where: {
                id: art_id
            }
        }
        const scope = useScope ? 'hideTime': null

        switch(type) {
            case 100:
                // movie
                art = await Movie.scope(scope).findOne(finder)
                break;
            case 200:
                // music
                art = await Music.scope(scope).findOne(finder)
                break;
            case 300:
                // sentence
                art = await Sentence.scope(scope).findOne(finder)
                break;
            case 400:
                break;
            default:
                break;
        }

        return art
    }
}

module.exports = {
    Art
}