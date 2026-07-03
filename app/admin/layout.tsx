import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Drive Exotiq',
  description: 'Manage Drive Exotiq applications',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deep-black">
      <header className="bg-jet-grey border-b border-metallic-silver/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pure-white">Drive Exotiq</h1>
              <p className="text-sm text-metallic-silver">Admin Dashboard</p>
            </div>
            <a
              href="/"
              className="text-gulf-blue hover:text-gulf-blue/80 text-sm font-medium transition-colors"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}





