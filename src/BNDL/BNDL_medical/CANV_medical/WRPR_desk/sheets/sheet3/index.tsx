import React from 'react';
import Button from 'RCMP/RCMP_button_V00.05';
import { Heart, Timer } from 'iconsax-react';

const ButtonExamples: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 font-sans" dir="ltr">
      <h1 className="text-3xl font-bold text-center mb-4">Button Examples</h1>
      <p className="text-center text-gray-600 mb-8">
        All possible states of the <code>Button</code> component are shown below.
      </p>

      {/* ===== Variants ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'Fill', variant: 'fill' }} />
          <Button logic={{ content: 'Secondary', variant: 'secondary' }} />
          <Button logic={{ content: 'Outline', variant: 'outline' }} />
          <Button logic={{ content: 'Text', variant: 'text' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          <strong>fill:</strong> solid background &nbsp;|&nbsp;
          <strong>secondary:</strong> secondary solid &nbsp;|&nbsp;
          <strong>outline:</strong> bordered &nbsp;|&nbsp;
          <strong>text:</strong> plain text (underline on hover)
        </p>
      </section>

      {/* ===== Sizes ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'Small', size: 'sm', variant: 'fill' }} />
          <Button logic={{ content: 'Medium', size: 'md', variant: 'fill' }} />
          <Button logic={{ content: 'Large', size: 'lg', variant: 'fill' }} />
          <Button logic={{ content: 'Extra Large', size: 'xl', variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Sizes: <code>sm</code> (32px), <code>md</code> (40px), <code>lg</code> (48px), <code>xl</code> (56px)
        </p>
      </section>

      {/* ===== States ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">States</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'Normal', state: 'normal', variant: 'fill' }} />
          <Button logic={{ content: 'Disabled', state: 'disabled', variant: 'fill' }} />
          <Button logic={{ content: 'Loading', state: 'loading', variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          <strong>normal:</strong> default &nbsp;|&nbsp;
          <strong>disabled:</strong> non‑interactive &nbsp;|&nbsp;
          <strong>loading:</strong> shows a spinner alongside content
        </p>
      </section>

      {/* ===== With Icons ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            logic={{
              content: 'Like',
              icon: <Heart color="currentColor" size={20} />, // inherits button text color
              variant: 'fill',
            }}
          />
          <Button
            logic={{
              content: 'Loading',
              icon: <Timer className="animate-spin stroke-current" color="currentColor" size={20} />,
              variant: 'outline',
            }}
          />
          {/* Icon‑only button */}
          <Button
            logic={{
              icon: <Heart color="currentColor" size={24} />,
              variant: 'fill',
              size: 'lg',
            }}
          />
          {/* Override color example */}
          <Button
            logic={{
              content: 'Like (red)',
              icon: <Heart color="#ef4444" size={20} />, // fixed color
              variant: 'outline',
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Icons are passed as ReactNode. They inherit the button’s text color when using <code>color="currentColor"</code>.
        </p>
      </section>

      {/* ===== Full Width ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Full Width</h2>
        <div className="max-w-md">
          <Button logic={{ content: 'This button takes full width', fullWidth: true, variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          With <code>fullWidth</code>, the button stretches to the parent’s width.
        </p>
      </section>

      {/* ===== Typography Type ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Typography Type</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'Headline', type: 'headline', variant: 'fill' , size:"xl" }} />
          <Button logic={{ content: 'Label', type: 'lable', variant: 'fill' }} />
          <Button logic={{ content: 'Body', type: 'body', variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Affects font size and weight (via <code>TextIcon</code>).
        </p>
      </section>

      {/* ===== Internal Link ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Internal Link (React Router)</h2>
        <Button logic={{ to: '/dashboard', content: 'Go to Dashboard', variant: 'secondary' }} />
        <p className="text-sm text-gray-500 mt-2">With <code>to</code>, it renders a <code>&lt;Link&gt;</code>.</p>
      </section>

      {/* ===== External Link ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">External Link</h2>
        <Button logic={{ href: 'https://example.com', content: 'Open Example', variant: 'outline' }} />
        <p className="text-sm text-gray-500 mt-2">With <code>href</code>, it renders an <code>&lt;a&gt;</code> with <code>target="_blank"</code>.</p>
      </section>

      {/* ===== Click Event ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Click Event</h2>
        <Button
          logic={{
            content: 'Click me (console log)',
            variant: 'fill',
            onClick: () => console.log('Button clicked!'),
          }}
        />
        <p className="text-sm text-gray-500 mt-2">Attach a custom function with <code>onClick</code>.</p>
      </section>

      {/* ===== Combined Features ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Combined Features</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            logic={{
              content: 'Submit Order',
              icon: <Heart color="currentColor" size={20} />,
              variant: 'secondary',
              size: 'lg',
              type: 'headline',
              onClick: () => alert('Order submitted!'),
            }}
          />
          <Button
            logic={{
              content: 'Sending...',
              icon: <Timer className="animate-spin" color="currentColor" size={20} />,
              variant: 'fill',
              size: 'md',
              state: 'loading',
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">All props can be combined freely.</p>
      </section>
    </div>
  );
};

export default ButtonExamples;