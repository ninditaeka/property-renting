import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment or use default
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class Mail {
  private mailOptions: {
    from: {
      address: string;
      name: string;
    };
  };

  constructor() {
    this.mailOptions = {
      from: {
        address: process.env.EMAIL || 'noreply@rentease.com',
        name: 'RentEase',
      },
    };
  }

  // Set company name for email sender
  setCompanyName(name: string): void {
    this.mailOptions.from.name = name;
  }

  // Set sender email address
  setSenderEmail(email: string): void {
    this.mailOptions.from.address = email;
  }

  // Configure email transporter
  private createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generic method to send email
  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const transporter = this.createTransporter();

    const mailOptions = {
      ...this.mailOptions,
      ...options,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }
}

// Helper function to generate verification token
export const generateVerificationToken = (email: string, role: string) => {
  return jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1d' });
};

// Helper function to send verification email
export const sendVerificationEmail = async (
  email: string,
  token: string,
  role: string,
  isNewUser = true,
) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationUrl = isNewUser
    ? `${baseUrl}/register/${role.toLowerCase()}/verify?token=${token}`
    : `${baseUrl}/complete-profile?token=${token}`;

  const mail = new Mail();

  try {
    await mail.sendEmail({
      to: email,
      subject: isNewUser
        ? 'Complete Your Registration'
        : 'Complete Your Profile',
      html: `
        <h1>${isNewUser ? 'Complete Your Registration' : 'Complete Your Profile'}</h1>
        <p>Hello, Welcome Back to RentEase, your favorite rent App</p>
        <p>Please click the link below to ${isNewUser ? 'verify and continue register through your email' : 'complete your profile'}:</p>
        <a href="${verificationUrl}" style="color: #007bff; text-decoration: none; font-weight: bold;">Click here</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Email sending failed');
  }
};

// Verify token validity
export const validateToken = (
  token: string,
): { email: string; role: string } => {
  try {
    // Verify token without checking database
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
    };

    return decoded;
  } catch (err) {
    throw new Error('Token is invalid or has expired');
  }
};

export default Mail;
