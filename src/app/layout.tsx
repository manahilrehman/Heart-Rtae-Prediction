import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CardioPredict AI | Heart Disease Risk Prediction (Logistic Regression)',
  description: 'Full-Stack Next.js Clinical Risk Stratification Web Application powered by scikit-learn Logistic Regression.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

