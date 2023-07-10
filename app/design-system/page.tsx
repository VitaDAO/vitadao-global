export default function DesignSystem() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 rounded-xl bg-white p-5">
        <p className="text-h1 font-semibold">Headline 1</p>
        <p className="text-h2 font-semibold">Headline 2</p>
        <p className="text-h3 font-semibold">Headline 3</p>
        <p className="text-h4 font-semibold">Headline 4</p>
        <p className="text-lg">Large Text</p>
        <p className="">Normal Text</p>
        <p className="text-sm">Small Text</p>
      </div>
      <div className="space-y-5 rounded-xl bg-white p-5">
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-vita-yellow"></div>
          <div className="h-16 bg-vita-purple"></div>
        </div>
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-black"></div>
          <div className="h-16 bg-gray-800"></div>
          <div className="h-16 bg-gray-600"></div>
          <div className="h-16 bg-gray-400"></div>
          <div className="h-16 bg-gray-200"></div>
          <div className="h-16 bg-white"></div>
        </div>
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-tag-yellow"></div>
          <div className="h-16 bg-tag-turquoise"></div>
          <div className="h-16 bg-tag-sky"></div>
          <div className="h-16 bg-tag-pink"></div>
        </div>
      </div>
    </div>
  );
}
