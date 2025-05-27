require("dotenv").config(); 
//dotenv: //tải các biến môi trường từ file .env vào process.env
//.config(): đọc file .env và gán các biến môi trường vào process.env
module.exports = { //xuất đối tượng chứa các thông tin cấu hình kết nối cơ sở dữ liệu
  HOST: process.env.MYSQL_HOST,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DB: process.env.MYSQL_DATABASE,
  dialect: "mysql",
  pool: { //Định nghĩa các thông số cho connection pool
    max: 5, //Số lượng kết nối tối đa trong pool 
    min: 0,
    acquire: 30000, //Thời gian tối đa (tính bằng ms) để cố gắng kết nối trước khi timeout 
    idle: 10000, //Thời gian tối đa (tính bằng ms) mà một kết nối có thể không hoạt động trước khi bị đóng
  },
};
