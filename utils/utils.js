class OtpUtil {
    static generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }
  
    static async sendOTP(mobile, otp) {
      // Integrate with SMS service provider here
      // This is a mock implementation
      console.log(`Sending OTP: ${otp} to mobile: ${mobile}`);
      return true;
    }
  }

  



  module.exports = OtpUtil;  