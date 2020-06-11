interface Points {
  image_url: string;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: Number;
  longitude: Number;
  city: string;
  uf: string;
  items: string[];
}

function newFunction(points: Points[]) {
  const serializedPoints = points.map((point) => {
    return {
      ...point,
      image_url: `http://192.168.0.50:3332/uploads/${point.image}`,
    };
  });
  return serializedPoints;
}

export default newFunction;
