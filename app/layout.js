import './globals.css';

export const metadata = {
  title: 'Resume Blackmail',
  description:
    'Upload your resume, set salary targets and non-negotiables, and let your CV negotiate with a recruiter persona.',
  applicationName: 'Resume Blackmail',
};

export const viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="resume-blackmail-body">{children}</body>
    </html>
  );
}