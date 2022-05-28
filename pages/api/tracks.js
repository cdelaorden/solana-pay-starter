const tracks = require('./tracks.json')
/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default function handler(req, res){
  switch(req.method){
    case 'GET':{
      res.status(200).json(
        tracks.map(p => ({
          id: p.id,
          name: p.name,
          genre: p.genre,
          filename: p.filename,
          duration: p.duration,
          author: p.author,
          price: p.price,
          token: p.token
        }))
      )
       
    }
  }
}

