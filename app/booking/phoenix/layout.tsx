import { notFound } from 'next/navigation';

// Phoenix fleet is not yet live — return 404 for all requests.
// To re-enable: remove the notFound() call and restore the metadata export.
//
// Original metadata (restore when launching):
// export const metadata: Metadata = {
//   title: 'Phoenix Fleet | Book Your Exotic Car | Drive Exotiq',
//   description: 'Browse and book from our Phoenix exotic car fleet.',
// };

export default function PhoenixBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  notFound();
}
