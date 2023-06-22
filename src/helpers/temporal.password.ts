const passGenerator = (): string => {
  let password: string = "";
  for (let i = 0; i < 8; i++) {
    let randomNumber = Math.floor(Math.random() * 10);
    password = `${password}${randomNumber}`;
  }
  return password;
};

export default passGenerator;
