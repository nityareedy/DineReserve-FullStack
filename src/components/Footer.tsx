import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Restaurant Finder. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <a href="#" className="hover:text-gray-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;