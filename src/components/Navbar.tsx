import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="px-4 flex justify-between items-center mr-4 ">
        <Link href="/" className="text-2xl font-bold">RestaurantFinder</Link>
        <nav className="flex space-x-4 items-center">
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/search">Search-by-zipcode</Link>
          <Link href="/business-owner">Business-Owner</Link>
          <Link href="/admin">Admin-Dashboard</Link>
        </nav>  
      </div>
    </header>
  );
}