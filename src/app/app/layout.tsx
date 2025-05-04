export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-stone-950 h-full min-h-screen">
      {children}
    </div>
  );
}
