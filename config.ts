import process from "process"

// class Config {
//   port!: string
//   mongoURI!: string
//   constructor(params: Partial<Config>) {
//     Object.assign(params);
//   }
// }
// const config = new Config({
//   port: process.env.PORT || "3000", mongoURI: process.env.MONGO_URI
// })

const config = {
  port: process.env.PORT || "3000", mongoURI: process.env.MONGO_URI
}
export default config