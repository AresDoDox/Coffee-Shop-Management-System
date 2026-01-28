import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary py-6 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <p className="font-semibold">L-Coffee Management System</p>
        <p className="mt-2 text-sm opacity-80">
          © {new Date().getFullYear()} L-Coffee. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
