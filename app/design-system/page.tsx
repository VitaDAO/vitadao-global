import { Button } from "@/components/ui/button";

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
      <div className="rounded-xl bg-white p-5">
        <h3 className="mb-3">Brand Primary</h3>
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-vita-yellow"></div>
          <div className="h-16 bg-vita-purple"></div>
        </div>
        <h3 className="mb-3 mt-12">Greyscale</h3>
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-black"></div>
          <div className="h-16 bg-gray-800"></div>
          <div className="h-16 bg-gray-600"></div>
          <div className="h-16 bg-gray-400"></div>
          <div className="h-16 bg-gray-200"></div>
          <div className="h-16 bg-white"></div>
        </div>
        <h3 className="mb-3 mt-12">Tags</h3>
        <div className="grid grid-cols-6 gap-5">
          <div className="h-16 bg-tag-yellow"></div>
          <div className="h-16 bg-tag-turquoise"></div>
          <div className="h-16 bg-tag-sky"></div>
          <div className="h-16 bg-tag-pink"></div>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5">
        <h3 className="mb-3">Default</h3>
        <div className="grid grid-cols-3 gap-5">
          <Button>Primary Button</Button>
          <Button intent="secondary">Secondary Button</Button>
          <Button intent="tertiary">Tertiary Button</Button>
        </div>
        <h3 className="mb-3 mt-12">Thin</h3>
        <div className="grid grid-cols-3 gap-5">
          <Button variant="thin">Primary Button Thin</Button>
          <Button variant="thin" intent="secondary">
            Secondary Button Thin
          </Button>
          <Button variant="thin" intent="tertiary">
            Tertiary Button Thin
          </Button>
        </div>
        <h3 className="mb-3 mt-12">With Icon</h3>
        <div className="grid grid-cols-3 gap-5">
          <Button variant="with-icon" icon="icon--vita icon--vita--home">
            Button With Icon
          </Button>
          <Button
            variant="with-icon"
            intent="secondary"
            icon="icon--vita icon--vita--home"
          >
            Button With Icon
          </Button>
          <Button
            variant="with-icon"
            intent="tertiary"
            icon="icon--vita icon--vita--home"
          >
            Button With Icon
          </Button>
        </div>
        <h3 className="mb-3 mt-12">With Arrow</h3>
        <div className="grid grid-cols-3 gap-5">
          <Button variant="with-arrow">Button With Arrow</Button>
          <Button variant="with-arrow" intent="secondary">
            Button With Arrow
          </Button>
          <Button variant="with-arrow" intent="tertiary">
            Button With Arrow
          </Button>
        </div>
        <h3 className="mb-3 mt-12">Clickthrough</h3>
        <div className="grid grid-cols-3 gap-5">
          <Button variant="clickthrough">Clickthrough Normal</Button>
          <Button variant="clickthrough" intent="secondary">
            Clickthrough Normal
          </Button>
          <Button variant="clickthrough" intent="tertiary">
            Clickthrough Normal
          </Button>
        </div>
      </div>
    </div>
  );
}
