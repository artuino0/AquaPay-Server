import jwt from "jsonwebtoken";

interface Payload {
  uid: string;
}

const verifyToken = (token: string): Promise<Payload> => {
  let SECRET_KEY = process.env.SECRET_KEY || "";
  return new Promise((res, rej) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        rej(err);
      } else {
        res(decoded as Payload);
      }
    });
  });
};

export default verifyToken;
