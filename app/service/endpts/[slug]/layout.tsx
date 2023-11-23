
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="px-0 pt-[30px] sm:px-[30px] sm:pb-[30px] sm:pt-[90px]">
      <div className="rounded-[20px] bg-white p-[20px] pb-[30px] @xl/main:p-[30px]">
        {children}
      </div>
    </div>
  );
}
