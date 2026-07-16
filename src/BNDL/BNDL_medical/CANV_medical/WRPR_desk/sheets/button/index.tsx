import React from 'react';
import Button from 'RCMP/RCMP_button_V00.05'; 
import { Heart  } from 'iconsax-react';

// ============================================================
// کامپوننت نمایش مثال‌ها
// ============================================================
const ButtonExamples: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 font-sans" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-4">نمونه‌های دکمه</h1>
      <p className="text-center text-gray-600 mb-8">
        این صفحه تمام حالت‌های ممکن کامپوننت <code>Button</code> را نمایش می‌دهد.
      </p>

      {/* ===== واریانت‌ها ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">واریانت‌های دکمه</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'پر شده', variant: 'fill' }} />
          <Button logic={{ content: 'ثانویه', variant: 'secondary' }} />
          <Button logic={{ content: 'مرزی', variant: 'outline' }} />
          <Button logic={{ content: 'متن‌گونه', variant: 'text' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          <strong>fill:</strong> پس‌زمینه‌ی اصلی &nbsp;|&nbsp;
          <strong>secondary:</strong> پس‌زمینه‌ی فرعی &nbsp;|&nbsp;
          <strong>outline:</strong> فقط حاشیه &nbsp;|&nbsp;
          <strong>text:</strong> فقط متن (با زیرخط در هاور)
        </p>
      </section>

      {/* ===== سایزها ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">سایزهای مختلف</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'کوچک', size: 'sm', variant: 'fill' }} />
          <Button logic={{ content: 'متوسط', size: 'md', variant: 'fill' }} />
          <Button logic={{ content: 'بزرگ', size: 'lg', variant: 'fill' }} />
          <Button logic={{ content: 'بسیار بزرگ', size: 'xl', variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          سایزها از چپ به راست: <code>sm</code> (۳۲px)، <code>md</code> (۴۰px)، <code>lg</code> (۴۸px)، <code>xl</code> (۵۶px)
        </p>
      </section>

      {/* ===== حالت‌های state ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">حالت‌های دکمه</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'معمولی', state: 'normal', variant: 'fill' }} />
          <Button logic={{ content: 'غیرفعال', state: 'disabled', variant: 'fill' }} />
          <Button logic={{ content: 'در حال بارگذاری', state: 'loading', variant: 'fill' }} />
          {/* حالت‌های hover و active با CSS پیاده‌سازی شده‌اند و نیازی به تنظیم state ندارند */}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          <strong>normal:</strong> حالت عادی &nbsp;|&nbsp;
          <strong>disabled:</strong> غیرفعال (قابل کلیک نیست) &nbsp;|&nbsp;
          <strong>loading:</strong> نمایش چرخ‌گردان به همراه محتوا
        </p>
        <p className="text-sm text-gray-500">
          (حالت‌های <strong>hover</strong> و <strong>active</strong> با CSS مدیریت می‌شوند.)
        </p>
      </section>

      {/* ===== با آیکون ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">دکمه‌های دارای آیکون</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            logic={{
              content: 'پسندیدن',
              icon: <Heart className="text-red-500" />,
              variant: 'fill',
            }}
          />
          <Button
            logic={{
              content: 'بارگذاری',
              icon: <Heart className="animate-spin" />,
              variant: 'outline',
            }}
          />
          {/* تنها آیکون (بدون متن) */}
          <Button
            logic={{
              icon: <Heart className="text-primary" />,
              variant: 'fill',
              size: 'lg',
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          آیکون را می‌توانید به‌صورت دلخواه (ReactNode) به <code>icon</code> پاس دهید.
          در صورتی که <code>content</code> رشته باشد، آیکون در کنار متن با فاصله‌ی مناسب قرار می‌گیرد.
        </p>
      </section>

      {/* ===== تمام‌عرض (fullWidth) ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">تمام‌عرض (fullWidth)</h2>
        <div className="max-w-md">
          <Button logic={{ content: 'این دکمه تمام عرض را می‌گیرد', fullWidth: true, variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          با فعال کردن <code>fullWidth</code>، دکمه به اندازه‌ی عرض پدر خود کشیده می‌شود.
        </p>
      </section>

      {/* ===== نوع تایپوگرافی (type) ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">نوع تایپوگرافی (type)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ content: 'تیتر', type: 'headline', variant: 'fill' }} />
          <Button logic={{ content: 'برچسب', type: 'lable', variant: 'fill' }} />
          <Button logic={{ content: 'بدنه', type: 'body', variant: 'fill' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          این پراپ بر روی اندازه‌ی قلم و وزن فونت تأثیر می‌گذارد (از طریق کامپوننت <code>TextIcon</code>).
        </p>
      </section>

      {/* ===== لینک (React Router) ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">استفاده به‌عنوان لینک (React Router)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button logic={{ to: '/dashboard', content: 'رفتن به داشبورد', variant: 'secondary' }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          با استفاده از پراپ <code>to</code>، دکمه به یک <code>&lt;Link&gt;</code> تبدیل می‌شود.
        </p>
      </section>

      {/* ===== لینک خارجی (anchor) ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">لینک خارجی (anchor)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            logic={{
              href: 'https://example.com',
              content: 'باز کردن مثال',
              variant: 'outline',
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          با پراپ <code>href</code>، دکمه به یک <code>&lt;a&gt;</code> با <code>target="_blank"</code> تبدیل می‌شود.
        </p>
      </section>

      {/* ===== رویداد کلیک ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">رویداد کلیک</h2>
        <Button
          logic={{
            content: 'کلیک کن (پیام در کنسول)',
            variant: 'fill',
            onClick: () => console.log('دکمه کلیک شد!'),
          }}
        />
        <p className="text-sm text-gray-500 mt-2">
          با استفاده از <code>onClick</code> می‌توانید تابع دلخواه خود را به رویداد کلیک متصل کنید.
        </p>
      </section>

      {/* ===== ترکیب چند ویژگی ===== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ترکیب چند ویژگی</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            logic={{
              content: 'ثبت سفارش',
              icon: <Heart />,
              variant: 'secondary',
              size: 'lg',
              fullWidth: false,
              type: 'headline',
              state: 'normal',
              onClick: () => alert('سفارش ثبت شد!'),
            }}
          />
          <Button
            logic={{
              content: 'در حال ارسال',
              icon: <Heart className="animate-spin" />,
              variant: 'fill',
              size: 'md',
              state: 'loading',
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          تمام پراپ‌ها را می‌توان به‌صورت همزمان استفاده کرد.
        </p>
      </section>
    </div>
  );
};

export default ButtonExamples;