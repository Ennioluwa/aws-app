export const getParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <h1 style="color: red">Verify your email address</h1>
            <p>Click on this link to complete your registration</p>
            <p>This link expires in 10 mins</p>
            <p>${process.env.CLIENT_URL}/auth/activation/${token}</p>
          </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};
export const getResetParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <h1 style="color: red">Reset Password Link</h1>
            <p>Click on this link to reset your password</p>
            <p>This link expires in 10 mins</p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};
