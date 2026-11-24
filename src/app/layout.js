
import "./globals.css";

export const metadata = {
  title: "RoomSync - Meeting Room Booking",
  description: "Manage meeting rooms and bookings with RoomSync.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
