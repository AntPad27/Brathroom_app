import './globals.css'

export const metadata = {
  title: 'UCSC Restroom Radar',
  description: 'Find, rate, and add bathrooms on campus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
