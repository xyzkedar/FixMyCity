import './globals.css';

export const metadata = {
  title: 'FixMyCity - Urban Problem Solver',
  description: 'AI-powered civic infrastructure reporting platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Orbitron:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
