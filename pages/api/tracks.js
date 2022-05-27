/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default function handler(req, res){
  switch(req.method){
    case 'GET':{
      res.status(200).json(
        products.map(p => ({
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

const products = [
  {
    id: 1,
    name: "Welcome to the Village",
    genre: "Orchestral",
    filename: "Welcome to the Village.mp3",
    price: 0.1,
    token: 'USD',
    cid: "bafybeih62m7cld3dfsud5huzscvy7sywdittbgbtydlp57hhuhbx6cudp4",
    duration: "2:23",
    author: "MOS"    
  }
]